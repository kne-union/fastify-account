const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  fastify.get(`${options.prefix}/userInfo`, {}, async (request, reply) => {
    return {};
  });
});
