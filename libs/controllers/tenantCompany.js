const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;

  fastify.get(
    `${options.prefix}/tenant/getCompanyInfo`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      schema: {
        tags: ['租户平台'],
        summary: '获取租户的公司信息',
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
        tags: ['租户平台'],
        summary: '修改租户的公司信息',
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' },
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
