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
    `${options.prefix}/tenant/getTenantUserInfo`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.tenant]
    },
    async request => {
      return request.tenantInfo;
    }
  );

  fastify.get(
    `${options.prefix}/tenant/orgList`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.tenant]
    },
    async request => {
      const { tenantId } = request.tenantInfo;
      return await fastify.account.services.tenant.getTenantOrgList({ tenantId });
    }
  );
});
