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

  fastify.get(
    `${options.prefix}/tenant/getTenantUserList`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      schema: {
        query: {
          type: 'object',
          properties: {
            filter: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              }
            },
            currentPage: { type: 'number' },
            perPage: { type: 'number' }
          }
        }
      }
    },
    async request => {
      const { id: tenantId } = request.tenantInfo.tenant;
      const { filter, currentPage, perPage } = Object.assign(
        {},
        {
          filter: {},
          currentPage: 1,
          perPage: 20
        },
        request.query
      );
      return await services.tenantUser.getTenantUserList({ tenantId, currentPage, perPage, filter });
    }
  );

  fastify.get(
    `${options.prefix}/tenant/orgList`,
    {
      onRequest: [authenticate.user, authenticate.tenant]
    },
    async request => {
      const { id: tenantId } = request.tenantInfo.tenant;
      return await services.tenantOrg.getTenantOrgList({ tenantId });
    }
  );
});
