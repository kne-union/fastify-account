const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  fastify.get(
    `${options.prefix}/tenant/getUserTenant`,
    {
      onRequest: [fastify.account.authenticate.user]
    },
    async request => {
      return await fastify.account.services.tenant.getUserTenant(request.authenticatePayload);
    }
  );

  fastify.get(
    `${options.prefix}/tenant/getUserCurrentTenant`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.tenant]
    },
    async request => {
      return request.tenantInfo;
    }
  );
});
