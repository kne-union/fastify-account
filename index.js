const fp = require('fastify-plugin');
const packageJson = require('./package.json');
const path = require('path');
const merge = require('lodash/merge');
const get = require('lodash/get');
const { Unauthorized, Forbidden } = require('http-errors');

module.exports = fp(
  async function (fastify, options) {
    await fastify.sequelize.addModels(path.resolve(__dirname, './models'));
    options = merge(
      {
        prefix: `/api/v${packageJson.version.split('.')[0]}/account`, //如果为true，发送邮件和短信将不调用，验证码随response返回
        dbTableNamePrefix: 't_account_',
        isTest: false,
        jwt: {
          secret: 'super-secret',
          expires: null
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
        [
          'models',
          await fastify.sequelize.addModels(path.resolve(__dirname, './libs/models'), {
            prefix: options.dbTableNamePrefix
          })
        ],
        ['services', path.resolve(__dirname, './libs/services')],
        ['controllers', path.resolve(__dirname, './libs/controllers')],
        [
          'authenticate',
          {
            user: async request => {
              const info = await request.jwtVerify();
              //这里判断失效时间
              if (options.jwt.expires && Date.now() - info.iat * 1000 > options.jwt.expires) {
                throw Unauthorized('身份认证超时');
              }
              request.authenticatePayload = info.payload;
              request.userInfo = await fastify.account.services.user.getUser(request.authenticatePayload);
            },
            tenant: async request => {
              request.tenantInfo = await fastify.account.services.tenantUser.getTenantUserByUserId(request.userInfo);
            },
            admin: async request => {
              if (!(await fastify.account.services.admin.checkIsSuperAdmin(request.userInfo))) {
                throw Unauthorized('不能执行该操作，需要超级管理员权限');
              }
            },
            createPermission: permission => async request => {
              const permissions = get(request.tenantInfo, 'tenantUser.permissions');
              if (!permissions) {
                throw Forbidden('未获取到权限信息');
              }
              if (!(permission && permissions.indexOf(permission) > -1)) {
                throw Forbidden('用户没有权限执行该操作');
              }
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
