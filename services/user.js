const fp = require('fastify-plugin');
const { UserInfoError } = require('../errors');
const get = require('lodash/get');
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

  const accountIsExists = async ({ email, phone }, currentUser) => {
    const query = [];
    if (email && email !== get(currentUser, 'email')) {
      query.push({ email });
    }
    if (phone && phone !== get(currentUser, 'phone')) {
      query.push({ phone });
    }

    return await fastify.models.user.count({
      where: {
        [fastify.Sequelize.Op.or]: query
      }
    }) > 0;
  };

  const addUser = async ({
                           avatar, nickname, gender, birthday, description, phone, email, password, status
                         }) => {
    if (await accountIsExists({ phone, email }) > 0) {
      throw new Error('手机号或者邮箱都不能重复');
    }
    if (!password) {
      throw new Error('密码不能为空');
    }
    const account = await fastify.models.userAccount.create(await fastify.accountServices.account.passwordEncryption(password));
    const user = await fastify.models.user.create({
      avatar, nickname, gender, birthday, description, phone, email, status, userAccountId: account.id
    });
    await account.update({ belongToUserId: user.id });
    return user;
  };

  const saveUser = async ({ id, ...otherInfo }) => {
    const user = await fastify.models.user.findByPk(id);

    if (!user) {
      throw new Error('用户不存在');
    }

    if (await accountIsExists({ phone: otherInfo.phone, email: otherInfo.email }, user) > 0) {
      throw new Error('手机号或者邮箱都不能重复');
    }

    ['nickname', 'avatar', 'phone', 'email', 'description'].forEach((fieldName) => {
      if (otherInfo[fieldName]) {
        user[fieldName] = otherInfo[fieldName];
      }
    });

    await user.save();
  };

  fastify.accountServices.user = {
    getUserInfo, saveUser, accountIsExists, addUser
  };
});
