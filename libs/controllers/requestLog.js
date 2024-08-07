const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;

  fastify.post(
    `${options.prefix}/admin/getAllOperationLogList`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        tags: ['管理后台'],
        summary: '获取所有操作日志列表',
        body: {
          type: 'object',
          required: [],
          properties: {
            filter: { type: 'object' },
            type: { type: 'string' },
            perPage: { type: 'number' },
            currentPage: { type: 'number' }
          }
        }
      }
    },
    async request => {
      const { filter, type, perPage, currentPage } = Object.assign(
        {
          perPage: 20,
          currentPage: 1
        },
        request.body
      );
      return await services.requestLog.getRequestLogList({
        filter,
        type,
        perPage,
        currentPage
      });
    }
  );

  fastify.post(
    `${options.prefix}/tenant/getTenantOperationLogList`,
    {
      onRequest: [authenticate.user, authenticate.tenant],
      schema: {
        tags: ['管理后台'],
        summary: '获取租户操作日志列表',
        body: {
          type: 'object',
          required: [],
          properties: {
            filter: { type: 'object' },
            type: { type: 'string' },
            perPage: { type: 'number' },
            currentPage: { type: 'number' }
          }
        }
      }
    },
    async request => {
      const { filter, type, perPage, currentPage } = Object.assign(
        {
          perPage: 20,
          currentPage: 1
        },
        request.body
      );
      return await services.requestLog.getRequestLogList({
        filter,
        type,
        perPage,
        currentPage
      });
    }
  );
});
