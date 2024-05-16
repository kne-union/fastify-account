const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  // 用于系统初始化时，设置第一个用户，只能使用一次，其他用户由该用户创建
  fastify.post(`${options.prefix}/initSuperAdmin`, {
    onRequest: [fastify.authenticate]
  }, async (request) => {
    await fastify.AdminService.initSuperAdmin(await fastify.UserService.getUserInfo(request.authenticatePayload));
    return {};
  });

  fastify.post(`${options.prefix}/addSuperAdmin`, {
    onRequest: [fastify.authenticate, fastify.AdminService.superAdminAuthenticate]
  }, {
    schema: {
      body: {}
    }
  }, async (request) => {
    const { username, nickname, password } = request.body;
    await fastify.AdminService.addSuperAdmin({ username, nickname, password: password || options.defaultPassword });
    return {};
  });

  fastify.post(`${options.prefix}/addTenant`, {
    onRequest: [fastify.authenticate, fastify.AdminService.superAdminAuthenticate], schema: {
      body: {}
    }
  }, async () => {

  });
});
