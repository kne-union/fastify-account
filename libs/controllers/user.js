const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;
  fastify.get(
    `${options.prefix}/getUserInfo`,
    {
      onRequest: [authenticate.user]
    },
    async request => {
      return { userInfo: request.userInfo };
    }
  );

  fastify.post(
    `${options.prefix}/setCurrentTenantId`,
    {
      onRequest: [authenticate.user],
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
      await services.user.setCurrentTenantId({ id: request.userInfo.id, tenantId });
      return {};
    }
  );
});
