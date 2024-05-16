const fp = require('fastify-plugin');
const packageJson = require('./package.json');
const path = require('path');

module.exports = fp(
  async function (fastify, options) {
    fastify.models.addModels(path.resolve(__dirname, './models'));
    options = Object.assign(
      {
        prefix: `/api/v${packageJson.version.split('.')[0]}/account`, //如果为true，发送邮件和短信将不调用，验证码随response返回
        isTest: false
      },
      options
    );

    fastify.register(require('./services/account'), options);
    fastify.register(require('./services/user'), options);
    fastify.register(require('./controllers/account'), options);
    fastify.register(require('./controllers/user'), options);
  },
  {
    name: 'fastify-account',
    dependencies: ['fastify-sequelize']
  }
);
