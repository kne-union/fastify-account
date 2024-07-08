const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;
  fastify.post(
    `${options.prefix}/admin/addApplication`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        tags: ['管理后台-权限'],
        summary: '添加应用',
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
      await services.application.addApplication(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/saveApplication`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.application.saveApplication(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/deleteApplication`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.application.deleteApplication({ id });
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/getApplicationList`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        query: {
          type: 'object',
          properties: {
            tenantId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId } = request.query;
      return await services.application.getApplicationList({ tenantId });
    }
  );

  fastify.post(
    `${options.prefix}/admin/addPermission`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['applicationId', 'name', 'code'],
          properties: {
            applicationId: { type: 'string' },
            name: { type: 'string' },
            code: { type: 'string' },
            type: { type: 'number' },
            isModule: { type: 'number' },
            isMust: { type: 'number' },
            pid: { type: 'number' },
            description: { type: 'string' }
          }
        }
      }
    },
    async request => {
      await services.permission.addPermission(request.body);
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/getPermissionList`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        query: {
          type: 'object',
          required: ['applicationId'],
          properties: {
            applicationId: { type: 'string' },
            tenantId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { applicationId, tenantId } = request.query;
      return await services.permission.getPermissionList({ applicationId, tenantId });
    }
  );

  fastify.post(
    `${options.prefix}/admin/deletePermission`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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

      await services.permission.deletePermission({ id });

      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/savePermission`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            type: { type: 'number' },
            isMust: { type: 'number' },
            description: { type: 'string' }
          }
        }
      }
    },
    async request => {
      await services.permission.savePermission(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/saveTenantPermissionList`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId', 'applications', 'permissions'],
          properties: {
            tenantId: { type: 'string' },
            applications: {
              type: 'array',
              items: { type: 'string' }
            },
            permissions: {
              type: 'array',
              items: { type: 'number' }
            }
          }
        }
      }
    },
    async request => {
      await services.permission.saveTenantPermissionList(request.body);

      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/getTenantPermissionList`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      const { tenantId } = request.query;
      return await services.permission.getTenantPermissionList({ tenantId });
    }
  );
});
