const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;

  fastify.post(
    `${options.prefix}/admin/getOperationLogList`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        tags: ['管理后台'],
        summary: '获取操作日志列表',
        body: {
          filter: { type: 'object' },
          perPage: { type: 'number' },
          currentPage: { type: 'number' }
        }
      }
    },
    async request => {
      const { filter, perPage, currentPage } = Object.assign(
        {
          perPage: 20,
          currentPage: 1
        },
        request.body
      );
      return await services.requestLog.getRequestLogList({
        filter,
        perPage,
        currentPage
      });
    }
  );
});
