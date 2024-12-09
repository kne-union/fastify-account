const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;
  fastify.get(
    `${options.prefix}/tenant/getUserTenant`,
    {
      onRequest: [authenticate.user]
    },
    async request => {
      return await services.tenantUser.getUserTenant(request.authenticatePayload);
    }
  );
  fastify.get(
    `${options.prefix}/tenant/getTenantInfo`,
    {
      onRequest: [authenticate.user]
    },
    async request => {
      return await services.tenant.getTenantInfo(request.query);
    }
  );

  fastify.get(
    `${options.prefix}/tenant/getTenantUserInfo`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      schema: {
        tags: ['管理后台'],
        summary: '获取租户用户所有操作日志列表',
        params: {
          type: 'object',
          required: [],
          properties: {
            filter: { type: 'object' },
            type: { type: 'string' },
            perPage: { type: 'number' },
            currentPage: { type: 'number' }
          }
        }
      }
    },
    async request => {
      return request.tenantInfo;
    }
  );
});
