const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;
  fastify.get(
    `${options.prefix}/admin/getAllTenantList`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        query: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            serviceStartTime: {
              type: 'string',
              format: 'date-time'
            },
            serviceEndTime: {
              type: 'string',
              format: 'date-time'
            },
            perPage: {
              type: 'number'
            },
            currentPage: {
              type: 'number'
            }
          }
        }
      }
    },
    async request => {
      const { name, perPage, currentPage } = Object.assign(
        {
          perPage: 20,
          currentPage: 1
        },
        request.query
      );
      return await services.tenant.getAllTenantList({
        filter: { name },
        perPage,
        currentPage
      });
    }
  );

  fastify.get(
    `${options.prefix}/admin/getTenantInfo`,
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
      const { id } = request.query;
      return await services.tenant.getTenant({ id });
    }
  );

  fastify.post(
    `${options.prefix}/admin/closeTenant`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId'],
          properties: {
            tenantId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId } = request.body;
      await services.tenant.closeTenant({ tenantId });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/openTenant`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId'],
          properties: {
            tenantId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId } = request.body;
      await services.tenant.openTenant({ tenantId });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/addTenant`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['name', 'accountNumber', 'serviceStartTime', 'serviceEndTime'],
          properties: {
            name: { type: 'string' },
            accountNumber: { type: 'number' },
            serviceStartTime: {
              type: 'string',
              format: 'date-time'
            },
            serviceEndTime: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    async request => {
      await services.tenant.addTenant(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/saveTenant`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['id', 'name', 'accountNumber', 'serviceStartTime', 'serviceEndTime'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            accountNumber: { type: 'number' },
            serviceStartTime: {
              type: 'string',
              format: 'date-time'
            },
            serviceEndTime: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    async request => {
      await services.tenant.saveTenant(request.body);
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/getInviteList`,
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
      const { filter, perPage, currentPage, tenantId } = Object.assign(
        {
          perPage: 20,
          currentPage: 1
        },
        request.query
      );

      return await services.tenantInvite.getInviteList({ filter, perPage, currentPage, tenantId });
    }
  );

  fastify.post(
    `${options.prefix}/admin/addInviteToken`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId'],
          properties: {
            tenantId: { type: 'string' },
            info: {
              type: 'object',
              properties: {
                roleIds: { type: 'array', items: { type: 'number' }, default: [] },
                orgIds: {
                  type: 'array',
                  items: { type: 'number' },
                  default: []
                }
              }
            }
          }
        }
      }
    },
    async request => {
      const { tenantId, info } = request.body;
      await services.tenantInvite.addInviteToken({ tenantId, info });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/deleteInviteToken`,
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
      await services.tenantInvite.deleteInviteToken({ id: request.body.id });
      return {};
    }
  );
});
