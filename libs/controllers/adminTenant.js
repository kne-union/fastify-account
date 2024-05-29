const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  fastify.get(
    `${options.prefix}/admin/getAllTenantList`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
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
      return await fastify.account.services.admin.getAllTenantList({
        filter: { name },
        perPage,
        currentPage
      });
    }
  );

  fastify.get(
    `${options.prefix}/admin/getTenantInfo`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
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
      return await fastify.account.services.tenant.getTenantInfo({ id });
    }
  );

  fastify.post(
    `${options.prefix}/admin/addTenant`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
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
      await fastify.account.services.admin.addTenant(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/saveTenant`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
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
      await fastify.account.services.admin.saveTenant(request.body);
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/tenant/orgList`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
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
      return await fastify.account.services.tenant.getTenantOrgList({ tenantId });
    }
  );
});
