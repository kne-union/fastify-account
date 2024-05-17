const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  const getUserInfo = async (authenticatePayload) => {
    if (!(authenticatePayload && authenticatePayload.id)) {
      throw new Error('用户不存在或登录失效');
    }
    const user = await fastify.models.User.findByPk(authenticatePayload.id);
    if (!user) {
      throw new Error('用户不存在或登录失效');
    }
    const userInfo = user.get({ plain: true });
    delete userInfo['userAccountId'];

    return userInfo;
  };

  fastify.decorate('UserService', {
    getUserInfo
  });
});
