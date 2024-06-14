const fp = require('fastify-plugin');
const packageJson = require('./package.json');
const path = require('path');
const merge = require('lodash/merge');

module.exports = fp(
  async function (fastify, options) {
    await fastify.sequelize.addModels(path.resolve(__dirname, './models'));
    options = merge(
      {
        prefix: `/api/v${packageJson.version.split('.')[0]}/account`, //如果为true，发送邮件和短信将不调用，验证码随response返回
        isTest: false,
        jwt: {
          secret: 'super-secret'
        },
        defaultPassword: 'Aa000000!'
      },
      options
    );
    fastify.register(require('fastify-ip'));
    fastify.register(require('@fastify/jwt'), options.jwt);
    fastify.register(require('@kne/fastify-namespace'), {
      options,
      name: 'account',
      modules: [
        ['models', await fastify.sequelize.addModels(path.resolve(__dirname, './libs/models'))],
        ['services', path.resolve(__dirname, './libs/services')],
        ['controllers', path.resolve(__dirname, './libs/controllers')],
        [
          'authenticate',
          {
            user: async request => {
              const info = await request.jwtVerify();
              //这里判断失效时间
              //info.iat
              request.authenticatePayload = info.payload;
              request.userInfo = await fastify.account.services.user.getUserInfo(request.authenticatePayload);
            },
            tenant: async request => {
              request.tenantInfo = await fastify.account.services.tenant.tenantUserAuthenticate(request.userInfo);
            },
            admin: async request => {
              request.adminInfo = await fastify.account.services.admin.superAdminAuthenticate(request.userInfo);
            }
          }
        ]
      ]
    });
  },
  {
    name: 'fastify-account',
    dependencies: ['fastify-sequelize']
  }
);
