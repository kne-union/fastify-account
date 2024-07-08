const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  const { services } = fastify.account;
  fastify.post(
    `${options.prefix}/sendEmailCode`,
    {
      schema: {
        tags: ['账号'],
        summary: '发送邮箱验证码',
        body: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', description: '邮箱' }
          }
        },
        response: {
          200: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', description: '验证码' }
                  }
                }
              }
            }
          }
        }
      }
    },
    async request => {
      const { email } = request.body;
      const code = await services.account.sendEmailCode({ email });
      return options.isTest ? { code } : {};
    }
  );

  fastify.post(
    `${options.prefix}/sendSMSCode`,
    {
      schema: {
        tags: ['账号'],
        summary: '发送短信验证码',
        body: {
          type: 'object',
          required: ['phone'],
          properties: {
            phone: { type: 'string', description: '电话' }
          }
        },
        response: {
          200: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: { type: 'string', description: '验证码' }
                  }
                }
              }
            }
          }
        }
      }
    },
    async request => {
      const { phone } = request.body;
      const code = await services.account.sendSMSCode({ phone });
      return options.isTest ? { code } : {};
    }
  );

  fastify.post(
    `${options.prefix}/validateCode`,
    {
      schema: {
        tags: ['账号'],
        summary: '验证码验证',
        body: {
          type: 'object',
          required: ['name', 'type', 'code'],
          properties: {
            name: { type: 'string', description: '被验证的账号，手机或邮箱' },
            type: { type: 'number', description: '0:手机注册,1:邮箱注册,2:手机登录,3:邮箱登录,4:验证租户管理员' },
            code: { type: 'string', description: '接受到的验证码' }
          }
        },
        response: {
          200: {
            content: {
              'application/json': {
                schema: {}
              }
            }
          }
        }
      }
    },
    async request => {
      const { name, type, code } = request.body;
      const isPass = await services.account.verificationCodeValidate({
        name,
        type,
        code
      });
      if (!isPass) {
        throw new Error('验证码错误');
      }
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/accountIsExists`,
    {
      schema: {
        tags: ['账号'],
        summary: '账号是否已存在',
        body: {
          oneOf: [
            {
              type: 'object',
              required: ['phone'],
              properties: {
                phone: { type: 'string', description: '电话' }
              }
            },
            {
              type: 'object',
              required: ['email'],
              properties: {
                email: { type: 'string', description: '邮箱' }
              }
            }
          ]
        },
        response: {
          200: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    isExists: { type: 'boolean', description: 'true已存在，false不存在' }
                  }
                }
              }
            }
          }
        }
      }
    },
    async request => {
      const { phone, email } = request.body;
      return { isExists: await services.user.accountIsExists({ phone, email }) };
    }
  );

  fastify.post(
    `${options.prefix}/register`,
    {
      schema: {
        tags: ['账号'],
        summary: '注册账号',
        body: {
          oneOf: [
            {
              type: 'object',
              required: ['phone', 'password', 'code'],
              properties: {
                avatar: { type: 'string', description: '头像图片id' },
                phone: { type: 'string', description: '电话' },
                code: { type: 'string', description: '验证码' },
                password: { type: 'string', description: '密码（需要md5加密）' },
                invitationCode: { type: 'string', description: '邀请码，用来默认加入租户' },
                nickname: { type: 'string', description: '昵称' },
                gender: { type: 'string', description: '性别' },
                birthday: { type: 'string', format: 'date', description: '出生日期' },
                description: { type: 'string', description: '个人简介' }
              }
            },
            {
              type: 'object',
              required: ['email', 'password', 'code'],
              properties: {
                avatar: { type: 'string', description: '头像图片id' },
                email: { type: 'string', description: '邮箱' },
                code: { type: 'string', description: '验证码' },
                password: { type: 'string', description: '密码（需要md5加密）' },
                invitationCode: { type: 'string', description: '邀请码，用来默认加入租户' },
                nickname: { type: 'string', description: '昵称' },
                gender: { type: 'string', description: '性别' },
                birthday: { type: 'string', format: 'date', description: '出生日期' },
                description: { type: 'string', description: '个人简介' }
              }
            }
          ]
        },
        response: {
          200: {
            content: {
              'application/json': {
                schema: {}
              }
            }
          }
        }
      }
    },
    async request => {
      const account = request.body;
      return await services.account.register(account);
    }
  );

  fastify.post(
    `${options.prefix}/login`,
    {
      schema: {
        tags: ['账号'],
        summary: '登录',
        body: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string', description: '用户名' },
            password: { type: 'string', description: '密码' }
          }
        },
        response: {
          200: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string', description: '用户token' },
                    currentTenantId: { type: 'string', description: '当前租户id' }
                  }
                }
              }
            }
          }
        }
      }
    },
    async request => {
      const { username, password } = request.body;
      const { token, user } = await services.account.login({ username, password, ip: request.ip });
      return { token, currentTenantId: user.currentTenantId };
    }
  );
});
