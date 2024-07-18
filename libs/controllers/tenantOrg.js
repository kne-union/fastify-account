const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;
  fastify.post(
    `${options.prefix}/tenant/addOrg`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      required: ['name', 'pid'],
      properties: {
        name: { type: 'string' },
        pid: { type: 'number' }
      }
    },
    async request => {
      const { id: tenantId } = request.tenantInfo.tenant;
      return await services.tenantOrg.addTenantOrg(Object.assign({}, request.body, { tenantId }));
    }
  );

  fastify.get(
    `${options.prefix}/tenant/orgList`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      schema: {}
    },
    async request => {
      const { id: tenantId } = request.tenantInfo.tenant;
      return await services.tenantOrg.getTenantOrgList({ tenantId });
    }
  );

  fastify.post(
    `${options.prefix}/tenant/editOrg`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      required: ['name', 'pid'],
      properties: {
        name: { type: 'string' },
        pid: { type: 'number' }
      }
    },
    async request => {
      const { id: tenantId } = request.tenantInfo.tenant;
      await services.tenantOrg.saveTenantOrg(Object.assign({}, request.body, { tenantId }));
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/tenant/removeOrg`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      required: ['id'],
      properties: {
        id: { type: 'number' }
      }
    },
    async request => {
      const { id: tenantId } = request.tenantInfo.tenant;
      await services.tenantOrg.deleteTenantOrg(Object.assign({}, request.body, { tenantId }));
      return {};
    }
  );
});
