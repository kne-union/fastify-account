const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;

  fastify.get(
    `${options.prefix}/tenant/getCompanyInfo`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      schema: {
        query: {
          type: 'object',
          properties: {
            currentPage: { type: 'number' },
            perPage: { type: 'number' }
          }
        }
      }
    },
    async request => {
      const { id: tenantId } = request.tenantInfo.tenant;
      return await services.tenantCompany.getTenantCompanyInfo({ tenantId });
    }
  );

  fastify.post(
    `${options.prefix}/tenant/saveCompanyInfo`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      schema: {
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            shortName: { type: 'string' },
            themeColor: { type: 'string' },
            logo: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { id: tenantId } = request.tenantInfo.tenant;
      return await services.tenantCompany.saveTenantCompanyInfo(Object.assign({}, request.body, { tenantId }));
    }
  );
});
