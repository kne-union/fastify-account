const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  const addApplication = async application => {
    return fastify.account.models.application.create(application);
  };
  const saveApplication = async ({ id, ...others }) => {
    const application = await fastify.account.models.application.findByPk(id);
    if (!application) {
      throw new Error('应用不存在');
    }
    ['name', 'code', 'avatar', 'url', 'description'].forEach(name => {
      if (others[name]) {
        application[name] = others[name];
      }
    });

    await application.save();
  };

  const deleteApplication = async ({ id }) => {
    const application = await fastify.account.models.application.findByPk(id);
    if (!application) {
      throw new Error('应用不存在');
    }
    if (
      (await fastify.account.models.tenantApplication.count({
        where: {
          applicationId: application.id
        }
      })) > 0
    ) {
      throw new Error('应用已经开放给其他租户使用，不能删除');
    }

    const permissionIdList = (
      await fastify.account.models.permission.findAll({
        where: { applicationId: application.id }
      })
    ).map(({ id }) => id);

    const t = await fastify.sequelize.instance.transaction();

    try {
      await fastify.account.models.tenantPermission.destroy(
        {
          where: {
            permissionId: {
              [fastify.sequence.Sequelize.Op.in]: permissionIdList
            }
          }
        },
        { transaction: t }
      );

      await fastify.account.models.tenantRolePermission.destroy(
        {
          where: {
            permissionId: {
              [fastify.sequence.Sequelize.Op.in]: permissionIdList
            }
          }
        },
        { transaction: t }
      );

      await fastify.account.models.permission.destroy(
        {
          where: {
            applicationId: application.id
          }
        },
        { transaction: t }
      );
      await application.destroy({ transaction: t });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const getApplicationList = async () => {
    return await fastify.account.models.application.findAll();
  };

  const addPermission = async ({ applicationId, pid, code, name, type, description }) => {
    if (!(await fastify.account.models.findByPk(applicationId))) {
      throw new Error('应用不存在');
    }
    const paths = [];
    if (pid > 0) {
      const parentNode = await fastify.account.models.permission.findByPk(pid);
      if (!parentNode) {
        throw new Error('未找到父级');
      }
      if (
        (await fastify.account.models.permission.count({
          where: {
            pid,
            code
          }
        })) > 0
      ) {
        throw new Error('同一级权限code不能重复');
      }
      paths.push(...parentNode.paths, parentNode.id);
    }
    return await fastify.account.models.permission.create({ applicationId, code, description, name, type, paths });
  };

  const getPermissionList = async ({ applicationId }) => {
    return await fastify.account.models.permission.findAll({
      where: { applicationId }
    });
  };

  const savePermissionList = async permission => {
    const currentPermission = await fastify.account.models.permission.findByPk(permission.id);

    if (!permission) {
      throw new Error('权限不存在');
    }

    ['name', 'type', 'description'].forEach(name => {
      if (permission[name]) {
        currentPermission[name] = permission[name];
      }
    });

    await currentPermission.save();
  };

  const deletePermission = async ({ id }) => {
    const currentPermission = await fastify.account.models.permission.findByPk(id);
    const permissionList = await fastify.account.models.permission.findAll({
      where: {
        applicationId: currentPermission.applicationId
      }
    });

    const childrenNode = permissionList.filter(({ paths }) => {
      return paths.indexOf(currentPermission.id) > -1;
    });

    const permissionIdList = [currentPermission.id, ...childrenNode.map(({ id }) => id)];

    const t = await fastify.sequelize.instance.transaction();
    try {
      await fastify.account.models.tenantPermission.destroy(
        {
          where: {
            permissionId: {
              [fastify.sequence.Sequelize.Op.in]: permissionIdList
            }
          }
        },
        { transaction: t }
      );
      await fastify.account.models.tenantRolePermission.destroy(
        {
          where: {
            permissionId: {
              [fastify.sequence.Sequelize.Op.in]: permissionIdList
            }
          }
        },
        { transaction: t }
      );
      await fastify.account.models.permission.destroy(
        {
          where: {
            id: {
              [fastify.sequence.Sequelize.Op.in]: permissionIdList
            }
          }
        },
        { transaction: t }
      );
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  fastify.account.services.permission = {
    addApplication,
    saveApplication,
    deleteApplication,
    getApplicationList,
    addPermission,
    getPermissionList,
    savePermissionList,
    deletePermission
  };
});
