const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  fastify.get(`${options.prefix}/admin/getAllTenantList`, {
    onRequest: [fastify.authenticate, fastify.authenticateAdmin], schema: {
      query: {
        type: 'object', properties: {
          name: {
            type: 'string'
          }, serviceStartTime: {
            type: 'string', format: 'date-time'
          }, serviceEndTime: {
            type: 'string', format: 'date-time'
          }, perPage: {
            type: 'number'
          }, currentPage: {
            type: 'number'
          }
        }
      }
    }
  }, async (request) => {
    const { name, perPage, currentPage } = Object.assign({
      perPage: 20, currentPage: 1
    }, request.query);
    return await fastify.accountServices.admin.getAllTenantList({
      filter: { name }, perPage, currentPage
    });
  });

  fastify.get(`${options.prefix}/admin/getTenantInfo`, {
    onRequest: [fastify.authenticate, fastify.authenticateAdmin], schema: {
      query: {
        type: 'object', properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    const { id } = request.query;
    return await fastify.accountServices.tenant.getTenantInfo({ id });
  });

  fastify.post(`${options.prefix}/admin/addTenant`, {
    onRequest: [fastify.authenticate, fastify.authenticateAdmin], schema: {
      body: {
        type: 'object', required: ['name', 'accountNumber', 'serviceStartTime', 'serviceEndTime'], properties: {
          name: { type: 'string' }, accountNumber: { type: 'number' }, serviceStartTime: {
            type: 'string', format: 'date-time'
          }, serviceEndTime: {
            type: 'string', format: 'date-time'
          }
        }
      }
    }
  }, async (request) => {
    await fastify.accountServices.admin.addTenant(request.body);
    return {};
  });

  fastify.post(`${options.prefix}/admin/saveTenant`, {
    onRequest: [fastify.authenticate, fastify.authenticateAdmin], schema: {
      body: {
        type: 'object', required: ['id', 'name', 'accountNumber', 'serviceStartTime', 'serviceEndTime'], properties: {
          id: { type: 'string' }, name: { type: 'string' }, accountNumber: { type: 'number' }, serviceStartTime: {
            type: 'string', format: 'date-time'
          }, serviceEndTime: {
            type: 'string', format: 'date-time'
          }
        }
      }
    }
  }, async (request) => {
    await fastify.accountServices.admin.saveTenant(request.body);
    return {};
  });

  fastify.post(`${options.prefix}/admin/tenant/addOrg`, {
    onRequest: [fastify.authenticate, fastify.authenticateAdmin], required: ['name', 'tenantId', 'pid'], properties: {
      name: {type: 'string'},
      tenantId: {type: 'string'},
      pid: {type: 'number'},
    }
  }, async (request) => {
    return await fastify.accountServices.tenant.addTenantOrg(request.body);
  });

  fastify.get(`${options.prefix}/admin/tenant/orgList`, {
    onRequest: [fastify.authenticate, fastify.authenticateAdmin], schema: {
      query: {
        type: 'object', properties: {
          id: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    const { tenantId } = request.query;
    return await fastify.accountServices.tenant.getTenantOrgList({ tenantId });
  });
});
