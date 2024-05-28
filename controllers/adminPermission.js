const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  fastify.post(`${options.prefix}/admin/addApplication`, {
    onRequest: [fastify.authenticate, fastify.authenticateAdmin], schema: {

    }
  }, async (request) => {

  });
});
