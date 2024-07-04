const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;
  // 用于系统初始化时，设置第一个用户，只能使用一次，其他用户由该用户创建
  fastify.post(
    `${options.prefix}/initSuperAdmin`,
    {
      onRequest: [authenticate.user]
    },
    async request => {
      await services.admin.initSuperAdmin(request.userInfo);
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/getSuperAdminInfo`,
    {
      onRequest: [authenticate.user, authenticate.admin]
    },
    async request => {
      return { userInfo: request.userInfo };
    }
  );

  fastify.post(
    `${options.prefix}/admin/setSuperAdmin`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['status', 'userId'],
          properties: {
            status: { type: 'boolean' },
            userId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { status, userId } = request.body;
      await services.admin[status ? 'setSuperAdmin' : 'cancelSuperAdmin'](await services.user.getUser({ id: userId }));
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/addUser`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        body: {}
      }
    },
    async request => {
      const userInfo = request.body;
      await services.admin.addUser(Object.assign({}, userInfo, { password: services.account.md5(options.defaultPassword) }));
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/getAllUserList`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      return await services.user.getAllUserList({
        filter,
        perPage,
        currentPage
      });
    }
  );

  fastify.post(
    `${options.prefix}/admin/resetUserPassword`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.admin.resetUserPassword(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/saveUser`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.user.saveUser(user);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/closeUser`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.user.closeUser({ id });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/openUser`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.user.openUser({ id });
      return {};
    }
  );
});
