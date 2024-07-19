const fp = require('fastify-plugin');
const isNil = require('lodash/isNil');
const get = require('lodash/get');
const groupBy = require('lodash/groupBy');

const uniq = require('lodash/uniq');
module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.account;
  const { Op } = fastify.sequelize.Sequelize;
  const addPermission = async ({ applicationId, pid, code, name, type, isModule, isMust, description }) => {
    if (!(await services.application.getApplication({ id: applicationId }))) {
      throw new Error('应用不存在');
    }
    const paths = [];
    if (pid > 0) {
      const parentNode = await models.permission.findByPk(pid);
      if (!parentNode) {
        throw new Error('未找到父级');
      }
      paths.push(...parentNode.paths, parentNode.id);
    }
    if (
      (await models.permission.count({
        where: {
          pid,
          code,
          applicationId
        }
      })) > 0
    ) {
      throw new Error('同一级权限code不能重复');
    }
    return await models.permission.create({
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
      await services.tenant.getTenant({ id: tenantId });
      const tenantPermissions = await models.tenantPermission.findAll({
        where: { tenantId }
      });
      query[Op.or] = [
        {
          id: {
            [Op.in]: tenantPermissions.map(({ permissionId }) => permissionId)
          }
        },
        { isMust: 1 }
      ];
    }

    await services.application.getApplication({ id: applicationId });

    return await models.permission.findAll({
      where: Object.assign({}, { applicationId }, query)
    });
  };

  const importPermissionsToApplication = async ({ applicationId, permissions }) => {
    const permissionsPidMapping = groupBy(permissions, 'pid');
    const pidMapping = {};
    for (let pid of await Promise.all(Object.keys(permissionsPidMapping).sort())) {
      const targetPid = pid === '0' ? 0 : pidMapping[pid];
      await Promise.all(
        permissionsPidMapping[pid].map(async item => {
          const originPermission = await models.permission.findOne({
            where: {
              pid: targetPid,
              code: item.code,
              applicationId
            }
          });
          if (originPermission) {
            pidMapping[item.id] = originPermission.id;
            return;
          }
          const newPermission = await services.permission.addPermission({
            applicationId,
            pid: targetPid,
            code: item.code,
            name: item.name,
            type: item.type,
            isModule: item.isModule,
            isMust: item.isMust,
            description: item.description
          });
          pidMapping[item.id] = newPermission.id;
        })
      );
    }
  };

  const parsePermissionListJSON = async ({ file }) => {
    const data = JSON.parse(await file.toBuffer());
    await Promise.all(
      data.map(async application => {
        const { permissions, ...other } = application;
        let app = await services.application.getApplicationByCode({ code: application.code });
        if (!app) {
          app = await services.application.addApplication(other);
        }
        await services.permission.importPermissionsToApplication({ applicationId: app.uuid, permissions });
        return app;
      })
    );
    return data;
  };

  const copyPermissions = async ({ applicationId, originApplicationId }) => {
    if (applicationId === originApplicationId) {
      throw new Error('复制对象不能和自己相同');
    }
    await services.application.getApplication({ id: originApplicationId });
    await services.application.getApplication({ id: applicationId });
    const permissions = await models.permission.findAll({
      where: { applicationId: originApplicationId }
    });
    await services.permission.importPermissionsToApplication({ applicationId, permissions });
  };

  const exportPermissionList = async ({ applicationIds }) => {
    return await Promise.all(
      (applicationIds || []).map(async applicationId => {
        let application = await services.application.getApplication({ id: applicationId });
        application.permissions = await models.permission.findAll({
          where: { applicationId }
        });
        return application;
      })
    );
  };

  const deletePermission = async ({ id }) => {
    const currentPermission = await models.permission.findByPk(id);

    if (!currentPermission) {
      throw new Error('权限不存在');
    }

    await services.application.getApplication({ id: currentPermission.applicationId });

    const permissionList = await models.permission.findAll({
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
      await models.tenantPermission.destroy({
        where: {
          permissionId: {
            [Op.in]: permissionIdList
          }
        },
        transaction: t
      });
      await models.tenantRolePermission.destroy({
        where: {
          permissionId: {
            [Op.in]: permissionIdList
          }
        },
        transaction: t
      });
      await models.permission.destroy({
        where: {
          id: {
            [Op.in]: permissionIdList
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
    const currentPermission = await models.permission.findByPk(permission.id);

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
    await services.tenant.getTenant({ id: tenantId });
    const currentApplications = await models.tenantApplication.findAll({
      where: { tenantId }
    });

    const currentApplicationIds = currentApplications.map(({ applicationId }) => applicationId);

    const currentPermissions = await models.tenantPermission.findAll({
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

      await models.tenantRoleApplication.destroy({
        where: {
          applicationId: {
            [Op.in]: needDeleteApplications
          },
          tenantId
        },
        transaction: t
      });

      await models.tenantRolePermission.destroy({
        where: {
          permissionId: {
            [Op.in]: needDeletePermissions
          },
          tenantId
        },
        transaction: t
      });

      await models.tenantApplication.destroy({
        where: {
          applicationId: {
            [Op.in]: needDeleteApplications
          },
          tenantId
        },
        transaction: t
      });

      await models.tenantPermission.destroy({
        where: {
          permissionId: {
            [Op.in]: needDeletePermissions
          },
          tenantId
        },
        transaction: t
      });

      needAddApplications.length > 0 &&
        (await models.tenantApplication.bulkCreate(
          needAddApplications.map(applicationId => {
            return { tenantId, applicationId };
          }),
          { transaction: t }
        ));

      needAddPermissions.length > 0 &&
        (await models.tenantPermission.bulkCreate(
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

  const saveRolePermissionList = async ({ roleId, tenantId, applications, permissions }) => {
    const role = await models.tenantRole.findByPk(roleId);
    if (!role) {
      throw new Error('角色不存在');
    }

    if (tenantId && role.tenantId !== tenantId) {
      throw new Error('数据已过期，请刷新页面后重试');
    }

    tenantId = role.tenantId;

    await services.tenant.getTenant({ id: tenantId });

    const tenantApplications = await models.tenantApplication.findAll({
      attributes: ['applicationId'],
      where: { tenantId }
    });

    const tenantPermissions = await models.tenantPermission.findAll({
      attributes: ['permissionId'],
      where: { tenantId }
    });

    const mustPermissions = await models.permission.findAll({
      attributes: ['id'],
      where: { isMust: 1 }
    });

    const tenantApplicationIds = tenantApplications.map(({ applicationId }) => applicationId);
    const tenantPermissionIds = uniq([...mustPermissions.map(({ id }) => id), ...tenantPermissions.map(({ permissionId }) => permissionId)]);

    const currentApplications = await models.tenantRoleApplication.findAll({
      where: {
        roleId: role.id,
        tenantId,
        applicationId: {
          [Op.in]: tenantApplicationIds
        }
      }
    });

    const currentPermissions = await models.tenantRolePermission.findAll({
      where: {
        roleId: role.id,
        tenantId,
        permissionId: { [Op.in]: tenantPermissionIds }
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
        (await models.tenantRoleApplication.destroy({
          where: {
            applicationId: {
              [Op.in]: needDeleteApplications
            },
            tenantId
          },
          transaction: t
        }));

      needDeletePermissions.length > 0 &&
        (await models.tenantRolePermission.destroy({
          where: {
            permissionId: {
              [Op.in]: needDeletePermissions
            },
            tenantId
          },
          transaction: t
        }));

      needAddApplications.length > 0 &&
        (await models.tenantRoleApplication.bulkCreate(
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
        (await models.tenantRolePermission.bulkCreate(
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
    await services.tenant.getTenant({ id: tenantId });

    const applications = await models.tenantApplication.findAll({
      where: { tenantId, status: 0 }
    });

    const permissions = await models.tenantPermission.findAll({
      where: { tenantId, status: 0 }
    });

    return { applications, permissions };
  };

  const getRolePermissionList = async ({ roleId, tenantId }) => {
    const role = await models.tenantRole.findByPk(roleId);
    if (!role) {
      throw new Error('角色不存在');
    }

    if (tenantId && role.tenantId !== tenantId) {
      throw new Error('数据已过期，请刷新页面后重试');
    }

    const applications = await models.tenantRoleApplication.findAll({
      where: { roleId: role.id, tenantId: role.tenantId }
    });
    const permissions = await models.tenantRolePermission.findAll({
      where: { roleId: role.id, tenantId: role.tenantId }
    });

    return { applications, permissions };
  };

  services.permission = {
    addPermission,
    getPermissionList,
    exportPermissionList,
    deletePermission,
    savePermission,
    saveTenantPermissionList,
    saveRolePermissionList,
    getTenantPermissionList,
    getRolePermissionList,
    parsePermissionListJSON,
    copyPermissions,
    importPermissionsToApplication
  };
});
