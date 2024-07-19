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
    `${options.prefix}/tenant/getTenantUserInfo`,
    {
      onRequest: [authenticate.user, authenticate.tenant]
    },
    async request => {
      return request.tenantInfo;
    }
  );
});
