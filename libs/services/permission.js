const fp = require('fastify-plugin');
const isNil = require('lodash/isNil');
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
      if (!isNil(others[name])) {
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
              [fastify.sequelize.Sequelize.Op.in]: permissionIdList
            }
          }
        },
        { transaction: t }
      );

      await fastify.account.models.tenantRolePermission.destroy(
        {
          where: {
            permissionId: {
              [fastify.sequelize.Sequelize.Op.in]: permissionIdList
            }
          }
        },
        { transaction: t }
      );

      await fastify.account.models.permission.destroy({
        where: {
          applicationId: application.id
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

  const getApplicationList = async ({ tenantId }) => {
    const query = {};
    if (tenantId) {
      const tenant = await fastify.account.models.tenant.findByPk(tenantId);
      if (!tenant) {
        throw new Error('租户不存在');
      }
      const tenantApplications = await fastify.account.models.tenantApplication.findAll({
        where: { tenantId }
      });
      query.id = {
        [fastify.sequelize.Sequelize.Op.in]: tenantApplications.map(({ applicationId }) => applicationId)
      };
    }
    return await fastify.account.models.application.findAll({
      where: query
    });
  };

  const addPermission = async ({ applicationId, pid, code, name, type, isModule, isMust, description }) => {
    if (!(await fastify.account.models.application.findByPk(applicationId))) {
      throw new Error('应用不存在');
    }
    const paths = [];
    if (pid > 0) {
      const parentNode = await fastify.account.models.permission.findByPk(pid);
      if (!parentNode) {
        throw new Error('未找到父级');
      }
      paths.push(...parentNode.paths, parentNode.id);
    }
    if (
      (await fastify.account.models.permission.count({
        where: {
          pid,
          code,
          applicationId
        }
      })) > 0
    ) {
      throw new Error('同一级权限code不能重复');
    }
    return await fastify.account.models.permission.create({
      applicationId,
      code,
      description,
      name,
      type,
      pid,
      isModule,
      isMust,
      paths
    });
  };

  const getPermissionList = async ({ applicationId, tenantId }) => {
    const query = {};
    if (tenantId) {
      const tenant = await fastify.account.models.tenant.findByPk(tenantId);
      if (!tenant) {
        throw new Error('租户不存在');
      }
      const tenantPermissions = await fastify.account.models.tenantPermission.findAll({
        where: { tenantId }
      });
      query[fastify.sequelize.Sequelize.Op.or] = [
        {
          id: {
            [fastify.sequelize.Sequelize.Op.in]: tenantPermissions.map(({ permissionId }) => permissionId)
          }
        },
        { isMust: 1 }
      ];
    }
    return await fastify.account.models.permission.findAll({
      where: Object.assign({}, { applicationId }, query)
    });
  };

  const deletePermission = async ({ id }) => {
    const currentPermission = await fastify.account.models.permission.findByPk(id);

    if (!currentPermission) {
      throw new Error('权限不存在');
    }

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
      await fastify.account.models.tenantPermission.destroy({
        where: {
          permissionId: {
            [fastify.sequelize.Sequelize.Op.in]: permissionIdList
          }
        },
        transaction: t
      });
      await fastify.account.models.tenantRolePermission.destroy({
        where: {
          permissionId: {
            [fastify.sequelize.Sequelize.Op.in]: permissionIdList
          }
        },
        transaction: t
      });
      await fastify.account.models.permission.destroy({
        where: {
          id: {
            [fastify.sequelize.Sequelize.Op.in]: permissionIdList
          }
        },
        transaction: t
      });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const savePermission = async permission => {
    const currentPermission = await fastify.account.models.permission.findByPk(permission.id);

    if (!permission) {
      throw new Error('权限不存在');
    }

    ['name', 'type', 'isMust', 'description'].forEach(name => {
      if (!isNil(permission[name])) {
        currentPermission[name] = permission[name];
      }
    });

    await currentPermission.save();
  };

  const saveTenantPermissionList = async ({ tenantId, applications, permissions }) => {
    if (!(await fastify.account.models.tenant.findByPk(tenantId))) {
      throw new Error('租户不存在');
    }
    const currentApplications = await fastify.account.models.tenantApplication.findAll({
      where: { tenantId }
    });

    const currentApplicationIds = currentApplications.map(({ applicationId }) => applicationId);

    const currentPermissions = await fastify.account.models.tenantPermission.findAll({
      where: { tenantId }
    });

    const currentPermissionIds = currentPermissions.map(({ permissionId }) => permissionId);

    const t = await fastify.sequelize.instance.transaction();
    try {
      //先删除，后添加
      const needDeleteApplications = currentApplications.filter(item => applications.indexOf(item.applicationId) === -1).map(({ applicationId }) => applicationId);
      const needAddApplications = applications.filter(applicationId => currentApplicationIds.indexOf(applicationId) === -1);
      const needDeletePermissions = currentPermissions.filter(item => permissions.indexOf(item.permissionId) === -1).map(({ permissionId }) => permissionId);
      const needAddPermissions = permissions.filter(permissionId => currentPermissionIds.indexOf(permissionId) === -1);

      await fastify.account.models.tenantRoleApplication.destroy({
        where: {
          applicationId: {
            [fastify.sequelize.Sequelize.Op.in]: needDeleteApplications
          },
          tenantId
        },
        transaction: t
      });

      await fastify.account.models.tenantRolePermission.destroy({
        where: {
          permissionId: {
            [fastify.sequelize.Sequelize.Op.in]: needDeletePermissions
          },
          tenantId
        },
        transaction: t
      });

      await fastify.account.models.tenantApplication.destroy({
        where: {
          applicationId: {
            [fastify.sequelize.Sequelize.Op.in]: needDeleteApplications
          },
          tenantId
        },
        transaction: t
      });

      await fastify.account.models.tenantPermission.destroy({
        where: {
          permissionId: {
            [fastify.sequelize.Sequelize.Op.in]: needDeletePermissions
          },
          tenantId
        },
        transaction: t
      });

      needAddApplications.length > 0 &&
        (await fastify.account.models.tenantApplication.bulkCreate(
          needAddApplications.map(applicationId => {
            return { tenantId, applicationId };
          }),
          { transaction: t }
        ));

      needAddPermissions.length > 0 &&
        (await fastify.account.models.tenantPermission.bulkCreate(
          needAddPermissions.map(permissionId => {
            return { tenantId, permissionId };
          }),
          { transaction: t }
        ));

      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const saveRolePermissionList = async ({ roleId, applications, permissions }) => {
    const role = await fastify.account.models.tenantRole.findByPk(roleId);
    if (!role) {
      throw new Error('角色不存在');
    }
    if (!(await fastify.account.models.tenant.findByPk(role.tenantId))) {
      throw new Error('租户不存在');
    }

    const tenantId = role.tenantId;

    const tenantApplications = await fastify.account.models.tenantApplication.findAll({
      attributes: ['applicationId'],
      where: { tenantId }
    });

    const tenantPermissions = await fastify.account.models.tenantPermission.findAll({
      attributes: ['permissionId'],
      where: { tenantId }
    });

    const tenantApplicationIds = tenantApplications.map(({ applicationId }) => applicationId);
    const tenantPermissionIds = tenantPermissions.map(({ permissionId }) => permissionId);

    const currentApplications = await fastify.account.models.tenantRoleApplication.findAll({
      where: {
        roleId: role.id,
        tenantId,
        applicationId: {
          [fastify.sequelize.Sequelize.Op.in]: tenantApplicationIds
        }
      }
    });

    const currentPermissions = await fastify.account.models.tenantRolePermission.findAll({
      where: {
        roleId: role.id,
        tenantId,
        permissionId: { [fastify.sequelize.Sequelize.Op.in]: tenantPermissionIds }
      }
    });

    const currentApplicationIds = currentApplications.map(({ applicationId }) => applicationId);
    const currentPermissionIds = currentPermissions.map(({ permissionId }) => permissionId);

    const t = await fastify.sequelize.instance.transaction();

    try {
      //先删除，后添加
      const needDeleteApplications = currentApplicationIds.filter(applicationId => applications.indexOf(applicationId) === -1);
      const needAddApplications = applications.filter(applicationId => currentApplicationIds.indexOf(applicationId) === -1 && tenantApplicationIds.indexOf(applicationId) > -1);
      const needDeletePermissions = currentPermissionIds.filter(permissionId => permissions.indexOf(permissionId) === -1);
      const needAddPermissions = permissions.filter(permissionId => currentPermissionIds.indexOf(permissionId) === -1 && tenantPermissionIds.indexOf(permissionId) > -1);

      needDeleteApplications.length > 0 &&
        (await fastify.account.models.tenantRoleApplication.destroy({
          where: {
            applicationId: {
              [fastify.sequelize.Sequelize.Op.in]: needDeleteApplications
            },
            tenantId
          },
          transaction: t
        }));

      needDeletePermissions.length > 0 &&
        (await fastify.account.models.tenantRolePermission.destroy({
          where: {
            permissionId: {
              [fastify.sequelize.Sequelize.Op.in]: needDeletePermissions
            },
            tenantId
          },
          transaction: t
        }));

      needAddApplications.length > 0 &&
        (await fastify.account.models.tenantRoleApplication.bulkCreate(
          needAddApplications.map(applicationId => {
            return {
              tenantId,
              roleId,
              applicationId
            };
          }),
          { transaction: t }
        ));

      needAddPermissions.length > 0 &&
        (await fastify.account.models.tenantRolePermission.bulkCreate(
          needAddPermissions.map(permissionId => {
            return {
              tenantId,
              roleId,
              permissionId
            };
          }),
          { transaction: t }
        ));

      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const getTenantPermissionList = async ({ tenantId }) => {
    await fastify.account.services.tenant.getTenantInfo({ id: tenantId });

    const applications = await fastify.account.models.tenantApplication.findAll({
      where: { tenantId, status: 0 }
    });

    const permissions = await fastify.account.models.tenantPermission.findAll({
      where: { tenantId, status: 0 }
    });

    return { applications, permissions };
  };

  const getRolePermissionList = async ({ roleId }) => {
    const role = await fastify.account.models.tenantRole.findByPk(roleId);
    if (!role) {
      throw new Error('角色不存在');
    }
    const applications = await fastify.account.models.tenantRoleApplication.findAll({
      where: { roleId: role.id, tenantId: role.tenantId }
    });
    const permissions = await fastify.account.models.tenantRolePermission.findAll({
      where: { roleId: role.id, tenantId: role.tenantId }
    });

    return { applications, permissions };
  };

  fastify.account.services.permission = {
    addApplication,
    saveApplication,
    deleteApplication,
    getApplicationList,
    addPermission,
    getPermissionList,
    deletePermission,
    savePermission,
    saveTenantPermissionList,
    saveRolePermissionList,
    getTenantPermissionList,
    getRolePermissionList
  };
});
