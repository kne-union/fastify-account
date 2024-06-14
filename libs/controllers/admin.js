const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  // 用于系统初始化时，设置第一个用户，只能使用一次，其他用户由该用户创建
  fastify.post(
    `${options.prefix}/initSuperAdmin`,
    {
      onRequest: [fastify.account.authenticate.user]
    },
    async request => {
      await fastify.account.services.admin.initSuperAdmin(await fastify.account.services.user.getUserInfo(request.authenticatePayload));
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/getSuperAdminInfo`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin]
    },
    async request => {
      return { userInfo: request.userInfo };
    }
  );

  fastify.post(
    `${options.prefix}/admin/addUser`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {}
      }
    },
    async request => {
      const userInfo = request.body;
      await fastify.account.services.admin.addUser(Object.assign({}, userInfo, { password: options.defaultPassword }));
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/getAllUserList`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        query: {}
      }
    },
    async request => {
      const { filter, perPage, currentPage } = Object.assign(
        {
          perPage: 20,
          currentPage: 1
        },
        request.query
      );
      return await fastify.account.services.admin.getAllUserList({
        filter,
        perPage,
        currentPage
      });
    }
  );

  fastify.post(
    `${options.prefix}/admin/resetUserPassword`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['userId', 'password'],
          properties: {
            password: { type: 'string' },
            userId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      await fastify.account.services.admin.resetUserPassword(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/saveUser`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' },
            avatar: { type: 'string' },
            nickname: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const user = request.body;
      await fastify.account.services.user.saveUser(user);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/closeUser`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { id } = request.body;
      await fastify.account.services.user.closeUser({ id });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/openUser`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { id } = request.body;
      await fastify.account.services.user.openUser({ id });
      return {};
    }
  );
});
