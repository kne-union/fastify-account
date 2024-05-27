const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  fastify.get(`${options.prefix}/tenant/getUserTenant`, {
    onRequest: [fastify.authenticate]
  }, async (request) => {
    return await fastify.accountServices.tenant.getUserTenant(request.authenticatePayload);
  });

  fastify.get(`${options.prefix}/tenant/getUserCurrentTenant`, {
    onRequest: [fastify.authenticate, fastify.authenticateTenant]
  }, async (request) => {
    return request.tenantInfo;
  });
});
