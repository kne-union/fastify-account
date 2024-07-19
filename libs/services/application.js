const fp = require('fastify-plugin');
const isNil = require('lodash/isNil');
module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.account;

  const getApplicationInstance = async ({ id }) => {
    if (!id) {
      throw new Error('应用Id不能为空');
    }
    const application = await models.application.findOne({
      where: {
        uuid: id
      }
    });
    if (!application) {
      throw new Error('应用不存在');
    }

    return application;
  };

  const getApplication = async ({ id }) => {
    const application = await getApplicationInstance({ id });
    return Object.assign({}, application.get({ plain: true }), {
      id: application.uuid
    });
  };

  const getApplicationByCode = async ({ code }) => {
    const application = await models.application.findOne({
      where: {
        code
      }
    });
    if (application) {
      await getApplicationInstance({ id: application.uuid });
      return Object.assign({}, application.get({ plain: true }), {
        id: application.uuid
      });
    }
    return null;
  };

  const addApplication = async application => {
    const currentApplication = await models.application.create(application);
    return Object.assign({}, currentApplication.get({ plain: true }), {
      id: currentApplication.uuid
    });
  };

  const saveApplication = async ({ id, ...others }) => {
    const application = await getApplicationInstance({ id });
    ['name', 'code', 'avatar', 'url', 'description'].forEach(name => {
      if (!isNil(others[name])) {
        application[name] = others[name];
      }
    });

    await application.save();
  };

  const deleteApplication = async ({ id }) => {
    const application = await getApplicationInstance({ id });
    if (
      (await models.tenantApplication.count({
        where: {
          applicationId: application.uuid
        }
      })) > 0
    ) {
      throw new Error('应用已经开放给其他租户使用，不能删除');
    }

    const permissionIdList = (
      await models.permission.findAll({
        where: { applicationId: application.uuid }
      })
    ).map(({ id }) => id);

    const t = await fastify.sequelize.instance.transaction();

    try {
      await models.tenantPermission.destroy(
        {
          where: {
            permissionId: {
              [fastify.sequelize.Sequelize.Op.in]: permissionIdList
            }
          }
        },
        { transaction: t }
      );

      await models.tenantRolePermission.destroy(
        {
          where: {
            permissionId: {
              [fastify.sequelize.Sequelize.Op.in]: permissionIdList
            }
          }
        },
        { transaction: t }
      );

      await models.permission.destroy({
        where: {
          applicationId: application.uuid
        },
        transaction: t
      });
      await application.destroy({ transaction: t });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const getApplicationList = async ({ tenantId, appName }) => {
    const query = {};
    if (tenantId) {
      const tenant = await services.tenant.getTenant({ id: tenantId });
      if (!tenant) {
        throw new Error('租户不存在');
      }
      const tenantApplications = await models.tenantApplication.findAll({
        where: { tenantId }
      });
      query.uuid = {
        [fastify.sequelize.Sequelize.Op.in]: tenantApplications.map(({ applicationId }) => applicationId)
      };
    }
    if (appName) {
      query['code'] = appName;
    }
    const list = await models.application.findAll({
      where: query
    });

    return list.map(item => {
      return Object.assign({}, item.get({ plain: true }), {
        id: item.uuid
      });
    });
  };

  const getApplicationListByIds = async ({ ids }) => {
    const applications = await models.application.findAll({
      where: {
        uuid: {
          [fastify.sequelize.Sequelize.Op.in]: ids
        }
      }
    });

    return applications.map(item => {
      return Object.assign({}, item.get({ plain: true }), { id: item.uuid });
    });
  };

  services.application = {
    addApplication,
    getApplication,
    getApplicationByCode,
    saveApplication,
    deleteApplication,
    getApplicationList,
    getApplicationListByIds
  };
});
