const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  fastify.get(
    `${options.prefix}/admin/getRoleList`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        query: {
          type: 'object',
          required: ['tenantId'],
          properties: {
            tenantId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId, perPage, currentPage } = Object.assign(
        {
          perPage: 20,
          currentPage: 1
        },
        request.query
      );
      return await fastify.account.services.tenant.getRoleList({ tenantId, perPage, currentPage });
    }
  );

  fastify.post(
    `${options.prefix}/admin/addRole`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
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
      await fastify.account.services.tenant.addRole({ tenantId, name, description });

      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/saveRole`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
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
      await fastify.account.services.tenant.saveRole(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/removeRole`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
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
      await fastify.account.services.tenant.removeRole({ id });
      return {};
    }
  );
});
