const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;

  fastify.get(
    `${options.prefix}/admin/getCompanyInfo`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        tags: ['管理后台'],
        summary: '获取租户管理的公司信息',
        required: ['tenantId'],
        query: {
          type: 'object',
          properties: {
            tenantId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      return await services.tenantCompany.getTenantCompanyInfo(request.query);
    }
  );

  fastify.post(
    `${options.prefix}/admin/saveCompanyInfo`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        tags: ['管理后台'],
        summary: '修改租户管理的公司信息',
        required: ['tenantId'],
        body: {
          type: 'object',
          properties: {
            tenantId: { type: 'string' },
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
      return await services.tenantCompany.saveTenantCompanyInfo(request.body);
    }
  );
});
