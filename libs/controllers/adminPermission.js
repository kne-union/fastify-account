const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  fastify.post(
    `${options.prefix}/admin/addApplication`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['name', 'code'],
          properties: {
            name: { type: 'string' },
            url: { type: 'string' },
            avatar: { type: 'string' },
            code: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    },
    async request => {
      await fastify.account.services.permission.addApplication(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/saveApplication`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['id', 'name', 'code'],
          properties: {
            id: { type: 'string' },
            url: { type: 'string' },
            name: { type: 'string' },
            avatar: { type: 'string' },
            code: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    },
    async request => {
      await fastify.account.services.permission.saveApplication(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/deleteApplication`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { id } = request.body;
      await fastify.account.services.permission.deleteApplication({ id });
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/getApplicationList`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin]
    },
    async () => {
      return await fastify.account.services.permission.getApplicationList();
    }
  );

  fastify.post(
    `${options.prefix}/admin/addPermission`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['applicationId', 'name', 'code'],
          properties: {
            applicationId: { type: 'string' },
            name: { type: 'string' },
            code: { type: 'string' }
          }
        }
      }
    },
    async request => {
      await fastify.account.services.permission.addPermission(request.body);
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/getPermissionList`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        query: {
          type: 'object',
          required: ['applicationId'],
          properties: {
            applicationId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { applicationId } = request.query;
      return await fastify.account.services.permission.getPermissionList({ applicationId });
    }
  );

  fastify.post(
    `${options.prefix}/admin/deletePermission`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {}
    },
    async () => {}
  );
});
