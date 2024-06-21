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

  fastify.post(
    `${options.prefix}/setCurrentTenantId`,
    {
      onRequest: [fastify.account.authenticate.user],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId'],
          properties: {
            tenantId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId } = request.body;
      await fastify.account.services.user.setCurrentTenantId({ id: request.userInfo.id, tenantId });
      return {};
    }
  );
});
