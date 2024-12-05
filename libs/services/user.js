const fp = require('fastify-plugin');
const { Unauthorized } = require('http-errors');
const get = require('lodash/get');
const pick = require('lodash/pick');
const isNil = require('lodash/isNil');
const isEmpty = require('lodash/isEmpty');

function userNameIsEmail(username) {
  return /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(username);
}

module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.account;
  const { Op } = fastify.sequelize.Sequelize;

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

  const getUserInstanceByName = async ({ name, status }) => {
    const isEmail = userNameIsEmail(name);
    const query = {};
    if (!isNil(status)) {
      query['status'] = Array.isArray(status)
        ? {
            [fastify.sequelize.Sequelize.Op.or]: status
          }
        : status;
    }
    const user = await models.user.findOne({
      where: Object.assign({}, isEmail ? { email: name } : { phone: name }, query)
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
    if (!otherInfo.email && !otherInfo.phone) {
      throw new Error('请输入邮箱或手机号');
    }
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
    const queryFilter = {},
      roleQueryFilter = {};

    ['nickname', 'email', 'phone'].forEach(key => {
      if (filter && filter[key]) {
        queryFilter[key] = {
          [Op.like]: `%${filter[key]}%`
        };
      }
    });
    if (filter && !isEmpty(filter.status)) {
      queryFilter['status'] = {
        [Op.eq]: filter.status
      };
    }
    if (!isEmpty(filter?.isSuperAdmin)) {
      roleQueryFilter['role'] = {
        [Op.eq]: filter.isSuperAdmin === 'false' ? 'Common' : 'SuperAdmin'
      };
    }
    const { count, rows } = await models.user.findAndCountAll({
      include: [
        {
          attributes: ['role'],
          model: models.adminRole,
          where: roleQueryFilter,
          required: !!roleQueryFilter.role
        },
        {
          model: models.tenant
        }
      ],
      where: queryFilter,
      offset: perPage * (currentPage - 1),
      limit: perPage
    });
    return {
      pageData: rows.map(item => {
        return Object.assign({}, item.get({ pain: true }), {
          id: item.uuid,
          tenants: item.tenants.map(({ uuid, name }) => {
            return { id: uuid, name };
          })
        });
      }),
      totalCount: count
    };
  };

  services.user = {
    getUser,
    getUserInstance,
    getUserInstanceByName,
    saveUser,
    accountIsExists,
    addUser,
    closeUser,
    openUser,
    setCurrentTenantId,
    getAllUserList
  };
});
