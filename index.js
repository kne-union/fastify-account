const fp = require('fastify-plugin');
const packageJson = require('./package.json');
const path = require('path');
const autoload = require('@fastify/autoload');

module.exports = fp(
  async function (fastify, options) {
    await fastify.sequelize.addModels(path.resolve(__dirname, './models'));
    options = Object.assign(
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
    fastify.decorate('accountServices', {});
    fastify.register(autoload, {
      dir: path.resolve(__dirname, './services'),
      options
    });
    fastify.register(autoload, {
      dir: path.resolve(__dirname, './controllers'),
      options
    });
    fastify.decorate('authenticate', async request => {
      const info = await request.jwtVerify();
      //这里判断失效时间
      //info.iat
      request.authenticatePayload = info.payload;
      request.userInfo = await fastify.accountServices.user.getUserInfo(request.authenticatePayload);
    });
    fastify.decorate('authenticateTenant', async request => {
      request.tenantInfo = await fastify.accountServices.tenant.tenantUserAuthenticate(request.userInfo);
    });
    fastify.decorate('authenticateAdmin', async request => {
      request.adminInfo = await fastify.accountServices.admin.superAdminAuthenticate(request.userInfo);
    });
  },
  {
    name: 'fastify-account',
    dependencies: ['fastify-sequelize']
  }
);
