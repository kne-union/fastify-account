const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;
  fastify.get(
    `${options.prefix}/tenant/getRoleList`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      schema: {
        query: {
          type: 'object',
          properties: {
            perPage: { type: 'number' },
            currentPage: { type: 'number' },
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
      const { id: tenantId } = request.tenantInfo.tenant;
      const { filter, perPage, currentPage } = Object.assign(
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
    `${options.prefix}/tenant/addRole`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      schema: {
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { id: tenantId } = request.tenantInfo.tenant;
      const { name, description } = request.body;
      await services.tenantRole.addTenantRole({ tenantId, name, description });

      return {};
    }
  );

  fastify.post(
    `${options.prefix}/tenant/saveRole`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
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
      const { id: tenantId } = request.tenantInfo.tenant;
      await services.tenantRole.saveTenantRole(Object.assign({}, request.body, { tenantId }));
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/tenant/removeRole`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
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
      const { id: tenantId } = request.tenantInfo.tenant;
      const { id } = request.body;
      await services.tenantRole.removeTenantRole({ id, tenantId });
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/tenant/getRolePermissionList`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
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
      const { id: tenantId } = request.tenantInfo.tenant;
      const { id } = request.query;
      return await services.permission.getRolePermissionList({ roleId: id, tenantId });
    }
  );

  fastify.post(
    `${options.prefix}/tenant/saveRolePermissionList`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
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
      const { id: tenantId } = request.tenantInfo.tenant;
      await services.permission.saveRolePermissionList(Object.assign({}, request.body, { tenantId }));
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/tenant/getApplicationList`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      schema: {
        tags: ['租户管理-权限'],
        summary: '获取应用列表'
      }
    },
    async request => {
      const { id: tenantId } = request.tenantInfo.tenant;
      const appName = request.headers['x-app-name'];
      return await services.application.getApplicationList({ tenantId, appName });
    }
  );

  fastify.get(
    `${options.prefix}/tenant/getPermissionList`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      schema: {
        tags: ['租户管理-权限'],
        summary: '获取应用权限列表',
        query: {
          type: 'object',
          required: ['applicationId'],
          properties: {
            applicationId: { type: 'string' }
          }
        },
        response: {
          200: {
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      code: { type: 'string' },
                      name: { type: 'string' },
                      isModule: { type: 'number' },
                      isMust: { type: 'number' },
                      type: { type: 'number' },
                      pid: { type: 'number' },
                      paths: { type: 'array', items: { type: 'number' } },
                      description: { type: 'string' },
                      status: { type: 'number' },
                      createdAt: { type: 'string' },
                      updatedAt: { type: 'string' },
                      deletedAt: { type: 'string' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    async request => {
      const { id: tenantId } = request.tenantInfo.tenant;
      const { applicationId } = request.query;
      return await services.permission.getPermissionList({ applicationId, tenantId });
    }
  );
});
