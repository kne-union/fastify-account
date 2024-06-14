const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  fastify.post(
    `${options.prefix}/sendEmailCode`,
    {
      schema: {
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
                    code: { type: 'number' },
                    data: {
                      type: 'object',
                      properties: {
                        code: { type: 'string', description: '验证码' }
                      }
                    },
                    msg: { type: 'string' }
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
      const code = await fastify.account.services.account.sendEmailCode({ email });
      return options.isTest ? { code } : {};
    }
  );

  fastify.post(
    `${options.prefix}/sendSMSCode`,
    {
      schema: {
        body: {
          type: 'object',
          required: ['phone'],
          properties: {
            phone: { type: 'string', description: '电话' }
          }
        }
      }
    },
    async request => {
      const { phone } = request.body;
      const code = await fastify.account.services.account.sendSMSCode({ phone });
      return options.isTest ? { code } : {};
    }
  );

  fastify.post(
    `${options.prefix}/validateCode`,
    {
      schema: {
        body: {
          type: 'object',
          required: ['name', 'type', 'code'],
          properties: {
            name: { type: 'string', description: '被验证的账号，手机或邮箱' },
            type: { type: 'number', description: '0:手机注册,1:邮箱注册,2:手机登录,3:邮箱登录,4:验证租户管理员' },
            code: { type: 'string', description: '接受到的验证码' }
          }
        }
      }
    },
    async request => {
      const { name, type, code } = request.body;
      const isPass = await fastify.account.services.account.verificationCodeValidate({
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
        body: {
          oneOf: [
            {
              type: 'object',
              required: ['phone'],
              properties: {
                phone: { type: 'string' }
              }
            },
            {
              type: 'object',
              required: ['email'],
              properties: {
                email: { type: 'string' }
              }
            }
          ]
        }
      }
    },
    async request => {
      const { phone, email } = request.body;
      return { isExists: await fastify.account.services.user.accountIsExists({ phone, email }) };
    }
  );

  fastify.post(
    `${options.prefix}/register`,
    {
      schema: {
        body: {
          oneOf: [
            {
              type: 'object',
              required: ['phone', 'password', 'code'],
              properties: {
                avatar: { type: 'string' },
                phone: { type: 'string' },
                code: { type: 'string' },
                password: { type: 'string' },
                invitationCode: { type: 'string' },
                nickname: { type: 'string' },
                gender: { type: 'string' },
                birthday: { type: 'string', format: 'date' },
                description: { type: 'string' }
              }
            },
            {
              type: 'object',
              required: ['email', 'password', 'code'],
              properties: {
                avatar: { type: 'string' },
                email: { type: 'string' },
                code: { type: 'string' },
                password: { type: 'string' },
                invitationCode: { type: 'string' },
                nickname: { type: 'string' },
                gender: { type: 'string' },
                birthday: { type: 'string', format: 'date' },
                description: { type: 'string' }
              }
            }
          ]
        }
      }
    },
    async request => {
      const account = request.body;
      return await fastify.account.services.account.register(account);
    }
  );

  fastify.post(
    `${options.prefix}/login`,
    {
      schema: {
        body: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: { type: 'string' },
            password: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { username, password } = request.body;
      const token = await fastify.account.services.account.login({ username, password, ip: request.ip });
      return { token };
    }
  );
});
