const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  fastify.post(`${options.prefix}/sendEmailCode`, {
    schema: {
      body: {
        type: 'object', required: ['email'], properties: {
          email: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    const { email } = request.body;
    const code = await fastify.AccountService.sendEmailCode({ email });
    return options.isTest ? { code } : {};
  });

  fastify.post(`${options.prefix}/sendSMSCode`, {
    schema: {
      body: {
        type: 'object', required: ['phone'], properties: {
          phone: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    const { phone } = request.body;
    const code = await fastify.AccountService.sendSMSCode({ phone });
    return options.isTest ? { code } : {};
  });

  fastify.post(`${options.prefix}/validateCode`, {
    schema: {
      body: {
        type: 'object', required: ['name', 'type', 'code'], properties: {
          name: { type: 'string' }, type: { type: 'number' }, code: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    const { name, type, code } = request.body;
    const isPass = await fastify.AccountService.verificationCodeValidate({
      name, type, code
    });
    if (!isPass) {
      throw new Error('验证码错误');
    }
    return {};
  });

  fastify.post(`${options.prefix}/accountIsExists`, {
    schema: {
      body: {
        type: 'object', required: ['username'], properties: {
          username: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    const { username } = request.body;
    return { isExists: await fastify.AccountService.accountIsExists({ username }) };
  });

  fastify.post(`${options.prefix}/register`, {
    schema: {
      body: {
        oneOf: [{
          type: 'object', required: ['phone', 'password', 'code'], properties: {
            avatar: { type: 'string' },
            phone: { type: 'string' },
            code: { type: 'string' },
            password: { type: 'string' },
            invitationCode: { type: 'string' },
            nickname: { type: 'string' },
            gender: { type: 'string' },
            birthday: { type: 'string', 'format': 'date' },
            description: { type: 'string' }
          }
        }, {
          type: 'object', required: ['email', 'password', 'code'], properties: {
            avatar: { type: 'string' },
            email: { type: 'string' },
            code: { type: 'string' },
            password: { type: 'string' },
            invitationCode: { type: 'string' },
            nickname: { type: 'string' },
            gender: { type: 'string' },
            birthday: { type: 'string', 'format': 'date' },
            description: { type: 'string' }
          }
        }]
      }
    }
  }, async (request) => {
    const account = request.body;
    return await fastify.AccountService.register(account);
  });

  fastify.post(`${options.prefix}/login`, {
    schema: {
      body: {
        type: 'object', required: ['username', 'password'], properties: {
          username: { type: 'string' }, password: { type: 'string' }
        }
      }
    }
  }, async (request) => {
    const { username, password } = request.body;
    const token = await fastify.AccountService.login({ username, password, ip: request.ip });
    return { token };
  });
});
