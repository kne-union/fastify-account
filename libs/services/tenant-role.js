const fp = require('fastify-plugin');
const isNil = require('lodash/isNil');
const isEmpty = require('lodash/isEmpty');

module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.account;
  const { Op } = fastify.sequelize.Sequelize;

  const getTenantRoleList = async ({ tenantId, withoutDefaultRole, currentPage, perPage, filter }) => {
    const queryFilter = {};
    if (!isNil(filter?.type)) {
      queryFilter.type = filter.type;
    }
    if (!isEmpty(withoutDefaultRole) && withoutDefaultRole === 'true') {
      queryFilter.type = {
        [Op.not]: 1
      };
    }
    const { count, rows } = await models.tenantRole.findAndCountAll({
      where: Object.assign({}, queryFilter, { tenantId }),
      offset: perPage * (currentPage - 1),
      limit: perPage
    });

    return { pageData: rows, totalCount: count };
  };

  const getTenantRoleInstance = async ({ id }) => {
    const tenantRole = await models.tenantRole.findByPk(id, {
      where: {
        type: 0
      }
    });

    if (!tenantRole) {
      throw new Error('角色不存在');
    }

    return tenantRole;
  };

  const addTenantRole = async ({ tenantId, name, description }) => {
    await services.tenant.getTenant({ id: tenantId });

    return await models.tenantRole.create({
      tenantId,
      name,
      description
    });
  };

  const saveTenantRole = async ({ id, tenantId, ...otherInfo }) => {
    const tenantRole = await getTenantRoleInstance({ id });

    if (tenantId && tenantRole.tenantId !== tenantId) {
      throw new Error('数据已过期，请刷新页面后重试');
    }

    ['name', 'description'].forEach(name => {
      if (otherInfo[name]) {
        tenantRole[name] = otherInfo[name];
      }
    });

    await tenantRole.save();
  };

  const removeTenantRole = async ({ id, tenantId }) => {
    const tenantRole = await getTenantRoleInstance({ id });

    if (tenantId && tenantRole.tenantId !== tenantId) {
      throw new Error('数据已过期，请刷新页面后重试');
    }

    await services.tenantUser.checkTenantRoleUsed({ tenantRoleId: tenantRole.id });

    if (tenantRole.type === 1) {
      throw new Error('该角色为系统默认角色，不能删除');
    }

    await tenantRole.destroy();
  };

  const getPermissionByTenantRoles = async ({ tenantRoleIds }) => {
    const tenantRolePermission = await models.tenantRolePermission.findAll({
      attributes: ['permissionId'],
      include: {
        attributes: ['code', 'name', 'isModule', 'paths'],
        model: models.permission
      },
      where: {
        roleId: {
          [Op.in]: tenantRoleIds
        }
      }
    });

    return await models.permission.findAll({
      attributes: ['id', 'code', 'name', 'isModule', 'pid', 'applicationId', 'paths'],
      where: {
        id: {
          [Op.in]: tenantRolePermission.map(({ permissionId }) => permissionId)
        }
      }
    });
  };

  services.tenantRole = {
    getPermissionByTenantRoles,
    getTenantRoleList,
    getTenantRoleInstance,
    addTenantRole,
    saveTenantRole,
    removeTenantRole
  };
});
