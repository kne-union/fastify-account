const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  fastify.get(
    `${options.prefix}/getUserInfo`,
    {
      onRequest: [fastify.account.authenticate.user]
    },
    async request => {
      return { userInfo: request.userInfo };
    }
  );
});
