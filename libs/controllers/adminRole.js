const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;
  fastify.get(
    `${options.prefix}/admin/getRoleList`,
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
                type: { type: 'number' }
              }
            }
          }
        }
      }
    },
    async request => {
      const { filter, tenantId, perPage, currentPage } = Object.assign(
        {
          perPage: 20,
          currentPage: 1,
          filter: {}
        },
        request.query
      );
      return await services.tenantRole.getTenantRoleList({ tenantId, perPage, currentPage, filter });
    }
  );

  fastify.post(
    `${options.prefix}/admin/addRole`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId', 'name'],
          properties: {
            tenantId: { type: 'string' },
            name: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId, name, description } = request.body;
      await services.tenantRole.addTenantRole({ tenantId, name, description });

      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/saveRole`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['name', 'id'],
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    },
    async request => {
      await services.tenantRole.saveTenantRole(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/removeRole`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' }
          }
        }
      }
    },
    async request => {
      const { id } = request.body;
      await services.tenantRole.removeTenantRole({ id });
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/getRolePermissionList`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        query: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' }
          }
        }
      }
    },
    async request => {
      const { id } = request.query;
      return await services.permission.getRolePermissionList({ roleId: id });
    }
  );

  fastify.post(
    `${options.prefix}/admin/saveRolePermissionList`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        roleId: { type: 'string' },
        applications: {
          type: 'array',
          items: { type: 'string' }
        },
        permissions: {
          type: 'array',
          items: { type: 'number' }
        }
      }
    },
    async request => {
      await services.permission.saveRolePermissionList(request.body);
      return {};
    }
  );
});
