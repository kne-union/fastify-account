const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  const getUserTenant = async (authenticatePayload) => {
    const user = await fastify.UserService.getUserInfo(authenticatePayload);
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

  fastify.decorate('TenantService', {
    getUserTenant, tenantUserAuthenticate
  });
});
