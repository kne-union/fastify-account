const fp = require('fastify-plugin');
const {UserInfoError} = require('../errors');
module.exports = fp(async (fastify, options) => {
  const getUserInfo = async (authenticatePayload) => {
    if (!(authenticatePayload && authenticatePayload.id)) {
      throw new UserInfoError();
    }
    const user = await fastify.models.user.findByPk(authenticatePayload.id);
    if (!user) {
      throw new UserInfoError();
    }
    const userInfo = user.get({ plain: true });
    delete userInfo['userAccountId'];

    return userInfo;
  };

  fastify.decorate('UserService', {
    getUserInfo
  });
});
