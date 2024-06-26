const fp = require('fastify-plugin');
const { Unauthorized } = require('http-errors');
const get = require('lodash/get');
const pick = require('lodash/pick');
module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.account;

  const getUserInstance = async ({ id }) => {
    const user = await models.user.findOne({
      where: {
        uuid: id
      }
    });

    if (!user) {
      throw new Error('用户不存在');
    }

    return user;
  };

  const getUser = async authenticatePayload => {
    if (!(authenticatePayload && authenticatePayload.id)) {
      throw new Unauthorized();
    }
    const user = await models.user.findOne({
      where: {
        uuid: authenticatePayload.id
      }
    });
    if (!user) {
      throw new Unauthorized();
    }
    return Object.assign({}, pick(user, ['avatar', 'nickname', 'phone', 'email', 'gender', 'status', 'birthday', 'description', 'currentTenantId']), {
      id: user.uuid
    });
  };

  const accountIsExists = async ({ email, phone }, currentUser) => {
    const query = [];
    if (email && email !== get(currentUser, 'email')) {
      query.push({ email });
    }
    if (phone && phone !== get(currentUser, 'phone')) {
      query.push({ phone });
    }

    return (
      (await models.user.count({
        where: {
          [fastify.sequelize.Sequelize.Op.or]: query
        }
      })) > 0
    );
  };

  const addUser = async ({ avatar, nickname, gender, birthday, description, phone, email, password, status }) => {
    if ((await accountIsExists({ phone, email })) > 0) {
      throw new Error('手机号或者邮箱都不能重复');
    }
    if (!password) {
      throw new Error('密码不能为空');
    }
    const account = await models.userAccount.create(await services.account.passwordEncryption(password));
    const user = await models.user.create({
      avatar,
      nickname,
      gender,
      birthday,
      description,
      phone,
      email,
      status,
      userAccountId: account.uuid
    });
    await account.update({ belongToUserId: user.uuid });

    return Object.assign({}, user.get({ pain: true }), { id: user.uuid });
  };

  const saveUser = async ({ id, ...otherInfo }) => {
    const user = await getUserInstance({ id });

    if ((await accountIsExists({ phone: otherInfo.phone, email: otherInfo.email }, user)) > 0) {
      throw new Error('手机号或者邮箱都不能重复');
    }

    ['nickname', 'avatar', 'phone', 'email', 'description'].forEach(fieldName => {
      if (otherInfo[fieldName]) {
        user[fieldName] = otherInfo[fieldName];
      }
    });

    await user.save();
  };

  const closeUser = async ({ id }) => {
    const user = await getUserInstance({ id });
    user.status = 12;
    await user.save();
  };

  const openUser = async ({ id }) => {
    const user = await getUserInstance({ id });
    user.status = 0;
    await user.save();
  };

  const setCurrentTenantId = async ({ id, tenantId }) => {
    await services.tenant.getTenant({ id: tenantId });
    const user = await getUserInstance({ id });
    user.currentTenantId = tenantId;
    await user.save();
  };

  const getAllUserList = async ({ filter, perPage, currentPage }) => {
    const { count, rows } = await models.user.findAndCountAll({
      include: [
        {
          attributes: ['role'],
          model: models.adminRole
        },
        {
          model: models.tenant
        }
      ]
    });
    return {
      pageData: rows.map(item => {
        return Object.assign({}, item.get({ pain: true }), { id: item.uuid });
      }),
      totalCount: count
    };
  };

  services.user = {
    getUser,
    getUserInstance,
    saveUser,
    accountIsExists,
    addUser,
    closeUser,
    openUser,
    setCurrentTenantId,
    getAllUserList
  };
});
