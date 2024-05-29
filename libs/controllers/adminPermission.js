const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  fastify.post(
    `${options.prefix}/admin/addApplication`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {}
    },
    async request => {}
  );
});
