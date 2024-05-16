const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  fastify.get(`${options.prefix}/userInfo`, {
    onRequest: [fastify.authenticate]
  }, async (request) => {
    return fastify.UserService.getUserInfo(request.authenticatePayload);
  });
});
