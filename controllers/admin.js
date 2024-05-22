const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  fastify.get(`${options.prefix}/getSuperAdminInfo`, {
    onRequest: [fastify.authenticate, fastify.authenticateAdmin]
  }, async (request) => {
    return { userInfo: request.userInfo };
  });
  // 用于系统初始化时，设置第一个用户，只能使用一次，其他用户由该用户创建
  fastify.post(`${options.prefix}/initSuperAdmin`, {
    onRequest: [fastify.authenticate]
  }, async (request) => {
    await fastify.AdminService.initSuperAdmin(await fastify.UserService.getUserInfo(request.authenticatePayload));
    return {};
  });

  fastify.post(`${options.prefix}/addSuperAdmin`, {
    onRequest: [fastify.authenticate, fastify.authenticateAdmin], schema: {
      body: {}
    }
  }, async (request) => {
    const { username, nickname, password } = request.body;
    await fastify.AdminService.addSuperAdmin({ username, nickname, password: password || options.defaultPassword });
    return {};
  });

  fastify.get(`${options.prefix}/getAllUserList`, {
    onRequest: [fastify.authenticate, fastify.authenticateAdmin], schema: {
      query: {}
    }
  }, async (request) => {
    const { filter, perPage, currentPage } = Object.assign({}, request.query, {
      perPage: 20, currentPage: 1
    });
    return await fastify.AdminService.getAllUserList({
      filter, perPage, currentPage
    });
  });

  fastify.get(`${options.prefix}/getAllTenantList`, {
    onRequest: [fastify.authenticate, fastify.authenticateAdmin], schema: {
      query: {}
    }
  }, async (request) => {
    const { filter, perPage, currentPage } = Object.assign({}, request.query, {
      perPage: 20, currentPage: 1
    });
    return await fastify.AdminService.getAllTenantList({
      filter, perPage, currentPage
    });
  });

  fastify.post(`${options.prefix}/addTenant`, {
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
    await fastify.AdminService.addTenant(request.body);
    return {};
  });

  fastify.post(`${options.prefix}/saveTenant`, {
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
    await fastify.AdminService.saveTenant(request.body);
    return {};
  });
});
