const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  const getUserTenant = async authenticatePayload => {
    const user = await fastify.account.services.user.getUserInfo(authenticatePayload);
    const tenantUserList = await fastify.account.models.tenantUser.findAll({
      where: {
        userId: user.id
      }
    });

    const tenantList =
      tenantUserList.length > 0
        ? await fastify.account.models.tenant.findAll({
            where: {
              id: {
                [fastify.sequelize.Sequelize.Op.in]: tenantUserList.map(({ tenantId }) => tenantId)
              },
              status: 0
            }
          })
        : [];

    const currentTenantUser = user.currentTenantId && tenantUserList.find(({ tenantId }) => tenantId === user.currentTenantId);
    const currentTenant = currentTenantUser && tenantList.find(({ id }) => id === currentTenantUser.tenantId);

    return {
      currentTenant,
      currentTenantUser,
      tenantList,
      tenantUserList,
      userInfo: user
    };
  };

  const getTenantInfo = async ({ id }) => {
    const tenant = await fastify.account.models.tenant.findByPk(id);
    if (!tenant) {
      throw new Error('租户不存在');
    }
    return tenant;
  };

  const getRoleList = async ({ tenantId, currentPage, perPage }) => {
    const { count, rows } = await fastify.account.models.tenantRole.findAndCountAll({
      where: { tenantId },
      offset: currentPage * (currentPage - 1),
      limit: perPage
    });

    return { pageData: rows, totalCount: count };
  };

  const addRole = async ({ tenantId, name, description }) => {
    if (!(await fastify.account.models.tenant.findByPk(tenantId))) {
      throw new Error('租户不存在');
    }

    return await fastify.account.models.tenantRole.create({
      tenantId,
      name,
      description
    });
  };

  const saveRole = async ({ id, ...otherInfo }) => {
    const tenantRole = await fastify.account.models.tenantRole.findByPk(id, {
      where: {
        type: 0
      }
    });

    if (!tenantRole) {
      throw new Error('角色不存在');
    }

    ['name', 'description'].forEach(name => {
      if (otherInfo[name]) {
        tenantRole[name] = otherInfo[name];
      }
    });

    await tenantRole.save();
  };

  const removeRole = async ({ id }) => {
    const tenantRole = await fastify.account.models.tenantRole.findByPk(id, {
      where: {
        type: 0
      }
    });

    if (!tenantRole) {
      throw new Error('角色不存在');
    }

    if (
      (await fastify.account.models.tenantUserRole.count({
        where: {
          tenantRoleId: tenantRole.id
        }
      })) > 0
    ) {
      throw new Error('该角色已经被使用，请在租户用户种处理掉所有使用该角色的租户用户后重试');
    }

    await tenantRole.destroy();
  };

  const tenantUserAuthenticate = async user => {
    if (!user.currentTenantId) {
      throw new Error('没有找到当前绑定租户');
    }
    const tenant = await fastify.account.models.tenant.findByPk(user.currentTenantId, {
      where: {
        status: 0
      }
    });
    if (!tenant) {
      throw new Error('当前绑定租户不存在或者已经被关闭');
    }

    const tenantUser = await fastify.account.models.tenantUser.findOne({
      where: {
        tenantId: tenant.id,
        userId: user.id,
        status: 0
      }
    });

    if (!tenantUser) {
      throw new Error('当前租户用户不存在或者已经被关闭');
    }

    return {
      tenant,
      tenantUser
    };
  };

  const addTenantOrg = async org => {
    if (await fastify.account.models.tenantOrg.count({ where: { name: org.name, tenantId: org.tenantId, pid: org.pid } })) {
      throw new Error('组织名称不能重复');
    }

    return await fastify.account.models.tenantOrg.create({
      name: org.name,
      enName: org.enName,
      tenantId: org.tenantId,
      pid: org.pid
    });
  };

  const editTenantOrg = async ({ id, ...otherInfo }) => {
    const tenantOrg = await fastify.account.models.tenantOrg.findByPk(id, {
      where: {
        type: 0
      }
    });

    if (!tenantOrg) {
      throw new Error('该组织不存在');
    }
    if (await fastify.account.models.tenantOrg.count({ where: { name: otherInfo.name, pid: otherInfo.pid, tenantId: otherInfo.tenantId } })) {
      throw new Error('组织名称在同一父组织下有重复');
    }

    ['name', 'enName', 'tenantId', 'pid'].forEach(name => {
      if (otherInfo[name]) {
        tenantOrg[name] = otherInfo[name];
      }
    });

    await tenantOrg.save();
  };

  const removeTenantOrg = async ({ id, tenantId }) => {
    const tenantOrg = await fastify.account.models.tenantOrg.findByPk(id, {
      where: {
        type: 0
      }
    });

    if (!tenantOrg) {
      throw new Error('该组织不存在');
    }

    const { rows } = await fastify.account.models.tenantOrg.findAndCountAll({
      where: { tenantId, pid: id }
    });

    if (rows?.length) {
      throw new Error('组织下有用户或子组织无法删除');
    }

    await tenantOrg.destroy();
  };

  const getTenantOrgList = async ({ tenantId }) => {
    const { count, rows } = await fastify.account.models.tenantOrg.findAndCountAll({
      where: { tenantId }
    });

    return { pageData: rows, totalCount: count };
  };

  fastify.account.services.tenant = {
    getUserTenant,
    tenantUserAuthenticate,
    getTenantInfo,
    getRoleList,
    addRole,
    saveRole,
    removeRole,
    addTenantOrg,
    editTenantOrg,
    getTenantOrgList,
    removeTenantOrg
  };
});
