const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;
  fastify.post(
    `${options.prefix}/initSuperAdmin`,
    {
      onRequest: [authenticate.user],
      schema: {
        tags: ['管理后台'],
        summary: '初始化用户为管理员',
        description: '用于系统初始化时，设置第一个用户，只能使用一次，其他用户由该用户创建'
      }
    },
    async request => {
      await services.admin.initSuperAdmin(request.userInfo);
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/getSuperAdminInfo`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        tags: ['管理后台'],
        summary: '获取管理员信息',
        response: {
          200: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    userInfo: {
                      type: 'object',
                      properties: {
                        id: { type: 'string', description: '用户id' },
                        nickname: { type: 'string', description: '用户昵称' },
                        email: { type: 'string', description: '邮箱' },
                        phone: { type: 'string', description: '电话' },
                        gender: { type: 'string', description: '性别' },
                        birthday: { type: 'string', format: 'date', description: '出生日期' },
                        description: { type: 'string', description: '个人简介' },
                        currentTenantId: { type: 'string', description: '当前租户ID' },
                        status: { type: 'number', description: '状态' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
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
        tags: ['管理后台'],
        summary: '设置用户为超级管理员',
        body: {
          type: 'object',
          required: ['status', 'userId'],
          properties: {
            status: { type: 'boolean', description: 'true:将用户设置为超级管理员,false:取消用户超级管理员' },
            userId: { type: 'string', description: '用户ID' }
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
        tags: ['管理后台'],
        summary: '添加用户',
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
        tags: ['管理后台'],
        summary: '获取用户列表',
        query: {
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
        tags: ['管理后台'],
        summary: '重置用户账号密码',
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
        tags: ['管理后台'],
        summary: '修改用户信息',
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
        tags: ['管理后台'],
        summary: '关闭用户',
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
        tags: ['管理后台'],
        summary: '将用户设置为正常',
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
