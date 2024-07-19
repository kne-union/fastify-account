const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  const { services } = fastify.account;
  fastify.post(
    `${options.prefix}/sendEmailCode`,
    {
      schema: {
        tags: ['账号'],
        summary: '发送登录邮箱验证码',
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
      const code = await services.account.sendVerificationCode({ name: email, type: 0 });
      return options.isTest ? { code } : {};
    }
  );

  fastify.post(
    `${options.prefix}/sendSMSCode`,
    {
      schema: {
        tags: ['账号'],
        summary: '发送登录短信验证码',
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
      const code = await services.account.sendVerificationCode({ name: phone, type: 0 });
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
            type: { type: 'number', description: '0:注册,2:登录,4:验证租户管理员,5:忘记密码' },
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
      const appName = request.headers['x-app-name'];
      const { token, user } = await services.account.login({ username, password, ip: request.ip, appName });
      return { token, currentTenantId: user.currentTenantId };
    }
  );

  fastify.post(
    `${options.prefix}/modifyPassword`,
    {
      schema: {
        tags: ['账号'],
        summary: '新用户重置新密码',
        body: {
          oneOf: [
            {
              type: 'object',
              required: ['email', 'newPwd', 'oldPwd'],
              properties: {
                email: { type: 'string', description: '邮箱' },
                newPwd: { type: 'string', description: '新密码' },
                oldPwd: { type: 'string', description: '原密码' }
              }
            },
            {
              type: 'object',
              required: ['phone', 'newPwd', 'oldPwd'],
              properties: {
                phone: { type: 'string', description: '手机号' },
                newPwd: { type: 'string', description: '新密码' },
                oldPwd: { type: 'string', description: '原密码' }
              }
            }
          ]
        }
      }
    },
    async request => {
      await services.account.modifyPassword(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/resetPassword`,
    {
      schema: {
        tags: ['账号'],
        summary: '用户重置密码',
        body: {
          type: 'object',
          required: ['newPwd', 'token'],
          properties: {
            newPwd: { type: 'string', description: '新密码' },
            token: { type: 'string', description: '验证token' }
          }
        }
      }
    },
    async request => {
      await services.account.resetPasswordByToken({
        password: request.body.newPwd,
        token: request.body.token
      });

      return {};
    }
  );

  fastify.post(
    `${options.prefix}/forgetPwd`,
    {
      schema: {
        tags: ['账号'],
        summary: '忘记密码',
        body: {
          oneOf: [
            {
              type: 'object',
              required: ['email'],
              properties: {
                email: { type: 'string', description: '邮箱' }
              }
            },
            {
              type: 'object',
              required: ['phone'],
              properties: {
                phone: { type: 'string', description: '手机号' }
              }
            }
          ]
        }
      }
    },
    async request => {
      const name = request.body.email || request.body.phone;
      const token = await services.account.sendJWTVerificationCode({ name, type: 5 });
      return options.isTest ? { token } : {};
    }
  );

  fastify.post(
    `${options.prefix}/parseResetToken`,
    {
      schema: {
        tags: ['账号'],
        summary: '通过token获取name',
        body: {
          type: 'object',
          required: ['token'],
          properties: {
            token: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { name } = await services.account.verificationJWTCodeValidate(request.body);
      return { name };
    }
  );
});
