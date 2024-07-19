const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;
  fastify.post(
    `${options.prefix}/admin/tenant/addOrg`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      required: ['name', 'tenantId', 'pid'],
      properties: {
        name: { type: 'string' },
        tenantId: { type: 'string' },
        pid: { type: 'number' }
      }
    },
    async request => {
      return await services.tenantOrg.addTenantOrg(request.body);
    }
  );

  fastify.get(
    `${options.prefix}/admin/tenant/orgList`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        query: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId } = request.query;
      return await services.tenantOrg.getTenantOrgList({ tenantId });
    }
  );

  fastify.post(
    `${options.prefix}/admin/tenant/editOrg`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      required: ['name', 'tenantId', 'pid'],
      properties: {
        name: { type: 'string' },
        tenantId: { type: 'string' },
        pid: { type: 'number' }
      }
    },
    async request => {
      await services.tenantOrg.saveTenantOrg(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/tenant/removeOrg`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      required: ['id'],
      properties: {
        id: { type: 'number' }
      }
    },
    async request => {
      await services.tenantOrg.deleteTenantOrg(request.body);
      return {};
    }
  );
});
