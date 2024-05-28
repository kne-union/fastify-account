const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  const getUserTenant = async (authenticatePayload) => {
    const user = await fastify.accountServices.user.getUserInfo(authenticatePayload);
    const tenantUserList = await fastify.models.tenantUser.findAll({
      where: {
        userId: user.id
      }
    });

    const tenantList = tenantUserList.length > 0 ? await fastify.models.tenant.findAll({
      where: {
        id: {
          [fastify.Sequelize.Op.in]: tenantUserList.map(({ tenantId }) => tenantId)
        }, status: 0
      }
    }) : [];

    const currentTenantUser = user.currentTenantId && tenantUserList.find(({ tenantId }) => tenantId === user.currentTenantId);
    const currentTenant = currentTenantUser && tenantList.find(({ id }) => id === currentTenantUser.tenantId);

    return {
      currentTenant, currentTenantUser, tenantList, tenantUserList, userInfo: user
    };
  };

  const getTenantInfo = async ({ id }) => {
    const tenant = await fastify.models.tenant.findByPk(id);
    if (!tenant) {
      throw new Error('租户不存在');
    }
    return tenant;
  };

  const getRoleList = async ({ tenantId, currentPage, perPage }) => {
    const { count, rows } = await fastify.models.tenantRole.findAndCountAll({
      where: { tenantId }, offset: currentPage * (currentPage - 1), limit: perPage
    });

    return { pageData: rows, totalCount: count };
  };

  const addRole = async ({ tenantId, name, description }) => {
    if (!await fastify.models.tenant.findByPk(tenantId)) {
      throw new Error('租户不存在');
    }

    return await fastify.models.tenantRole.create({
      tenantId, name, description
    });
  };

  const saveRole = async ({ id, ...otherInfo }) => {
    const tenantRole = await fastify.models.tenantRole.findByPk(id, {
      where: {
        type: 0
      }
    });

    if (!tenantRole) {
      throw new Error('角色不存在');
    }

    ['name', 'description'].forEach((name) => {
      if (otherInfo[name]) {
        tenantRole[name] = otherInfo[name];
      }
    });

    await tenantRole.save();
  };

  const removeRole = async ({ id }) => {
    const tenantRole = await fastify.models.tenantRole.findByPk(id, {
      where: {
        type: 0
      }
    });

    if (!tenantRole) {
      throw new Error('角色不存在');
    }

    if (await fastify.models.tenantUserRole.count({
      where: {
        tenantRoleId: tenantRole.id
      }
    }) > 0) {
      throw new Error('该角色已经被使用，请在租户用户种处理掉所有使用该角色的租户用户后重试');
    }

    await tenantRole.destroy();
  };

  const tenantUserAuthenticate = async (user) => {
    if (!user.currentTenantId) {
      throw new Error('没有找到当前绑定租户');
    }
    const tenant = await fastify.models.tenant.findByPk(user.currentTenantId, {
      where: {
        status: 0
      }
    });
    if (!tenant) {
      throw new Error('当前绑定租户不存在或者已经被关闭');
    }

    const tenantUser = await fastify.models.tenantUser.findOne({
      where: {
        tenantId: tenant.id, userId: user.id, status: 0
      }
    });

    if (!tenantUser) {
      throw new Error('当前租户用户不存在或者已经被关闭');
    }

    return {
      tenant, tenantUser
    };
  };

  const addTenantOrg = async (org) => {
    if (await fastify.models.tenantOrg.count({ where: { name: org.name } })) {
      throw new Error('组织名称不能重复');
    }

    const t = await fastify.sequelize.transaction();
    try {
      await fastify.models.tenantOrg.create({
        name: org.name,
        enName: org.enName,
        tenantId: org.tenantId,
        pid: org.pid
      });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const getTenantOrgList = async ({ tenantId }) => {
    const { count, rows } = await fastify.models.tenantOrg.findAndCountAll({
      where: { tenantId }
    });

    return { pageData: rows, totalCount: count };
  };

  fastify.accountServices.tenant = {
    getUserTenant, tenantUserAuthenticate, getTenantInfo, getRoleList, addRole, saveRole, removeRole, addTenantOrg, getTenantOrgList
  };
});
