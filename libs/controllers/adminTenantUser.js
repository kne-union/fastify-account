const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;
  fastify.get(
    `${options.prefix}/admin/getTenantUserList`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        query: {
          type: 'object',
          required: ['tenantId'],
          properties: {
            tenantId: { type: 'string' },
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
      const { filter, tenantId, currentPage, perPage } = Object.assign(
        {},
        {
          filter: {},
          currentPage: 1,
          perPage: 20
        },
        request.query
      );
      return await services.tenantUser.getTenantUserList({ tenantId, filter, currentPage, perPage });
    }
  );

  fastify.post(
    `${options.prefix}/admin/addTenantUser`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId', 'userId', 'name'],
          properties: {
            tenantId: { type: 'string' },
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
      await services.tenantUser.addTenantUser(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/saveTenantUser`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId', 'name'],
          properties: {
            tenantId: { type: 'string' },
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
      await services.tenantUser.saveTenantUser(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/deleteTenantUser`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId', 'tenantUserId'],
          properties: {
            tenantId: { type: 'string' },
            tenantUserId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId, tenantUserId } = request.body;
      await services.tenantUser.deleteTenantUser({ tenantId, tenantUserId });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/closeTenantUser`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId', 'tenantUserId'],
          properties: {
            tenantId: { type: 'string' },
            tenantUserId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId, tenantUserId } = request.body;
      await services.tenantUser.closeTenantUser({ tenantId, tenantUserId });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/openTenantUser`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId', 'tenantUserId'],
          properties: {
            tenantId: { type: 'string' },
            tenantUserId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId, tenantUserId } = request.body;
      await services.tenantUser.openTenantUser({ tenantId, tenantUserId });
      return {};
    }
  );
});
