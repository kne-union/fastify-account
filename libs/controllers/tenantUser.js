const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;

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

  fastify.post(
    `${options.prefix}/tenant/addTenantUser`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      schema: {
        body: {
          type: 'object',
          required: ['userId', 'name'],
          properties: {
            roleIds: { type: 'array', items: { type: 'number' }, default: [] },
            orgIds: {
              type: 'array',
              items: { type: 'number' },
              default: []
            },
            userId: { type: 'string' },
            name: { type: 'string' },
            avatar: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { id: tenantId } = request.tenantInfo.tenant;
      await services.tenantUser.addTenantUser(Object.assign({}, request.body, { tenantId }));
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/tenant/saveTenantUser`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      schema: {
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            roleIds: { type: 'array', items: { type: 'number' }, default: [] },
            orgIds: {
              type: 'array',
              items: { type: 'number' },
              default: []
            },
            name: { type: 'string' },
            avatar: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { id: tenantId } = request.tenantInfo.tenant;
      await services.tenantUser.saveTenantUser(Object.assign({}, request.body, { tenantId }));
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/tenant/deleteTenantUser`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      schema: {
        body: {
          type: 'object',
          required: ['tenantUserId'],
          properties: {
            tenantUserId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { id: tenantId } = request.tenantInfo.tenant;
      const { tenantUserId } = request.body;
      await services.tenantUser.deleteTenantUser({ tenantId, tenantUserId });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/tenant/closeTenantUser`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      schema: {
        body: {
          type: 'object',
          required: ['tenantUserId'],
          properties: {
            tenantUserId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { id: tenantId } = request.tenantInfo.tenant;
      const { tenantUserId } = request.body;
      await services.tenantUser.closeTenantUser({ tenantId, tenantUserId });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/tenant/openTenantUser`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      schema: {
        body: {
          type: 'object',
          required: ['tenantUserId'],
          properties: {
            tenantUserId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { id: tenantId } = request.tenantInfo.tenant;
      const { tenantUserId } = request.body;
      await services.tenantUser.openTenantUser({ tenantId, tenantUserId });
      return {};
    }
  );
});
