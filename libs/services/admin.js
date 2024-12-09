const fp = require('fastify-plugin');

const ROLE = {
  SuperAdmin: 'SuperAdmin',
  Common: 'Common'
};

module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.account;
  const initSuperAdmin = async user => {
    if ((await models.adminRole.count()) > 0) {
      throw new Error('系统已经初始化完成，不能执行该操作');
    }
    await models.adminRole.create({
      userId: user.id,
      role: ROLE['SuperAdmin']
    });
  };

  const checkIsSuperAdmin = async user => {
    return (
      (await models.adminRole.count({
        where: {
          userId: user.id,
          role: ROLE['SuperAdmin']
        }
      })) > 0
    );
  };

  const addUser = async ({ avatar, nickname, phone, email, password, description }) => {
    if (!email && !phone) {
      throw new Error('请输入邮箱或手机号');
    }
    return await services.user.addUser({
      avatar,
      nickname,
      phone,
      email,
      password,
      description,
      status: 1
    });
  };

  const setSuperAdmin = async targetUser => {
    const user = await services.user.getUser(targetUser);
    if (
      (await models.adminRole.count({
        where: {
          userId: user.id,
          role: ROLE['SuperAdmin']
        }
      })) > 0
    ) {
      throw new Error('当前用户已经是超级管理员');
    }

    await models.adminRole.create({
      userId: user.id,
      role: ROLE['SuperAdmin']
    });
  };

  const cancelSuperAdmin = async targetUser => {
    const user = await services.user.getUser(targetUser);
    if (
      !(await models.adminRole.count({
        where: {
          userId: user.id,
          role: ROLE['SuperAdmin']
        }
      })) > 0
    ) {
      throw new Error('当前用户不是超级管理员');
    }

    await models.adminRole.update(
      {
        role: ROLE['Common']
      },
      {
        where: {
          userId: user.id
        }
      }
    );
  };

  const resetUserPassword = async ({ userId, password }) => {
    await services.account.resetPassword({ userId, password });
  };

  services.admin = {
    initSuperAdmin,
    setSuperAdmin,
    cancelSuperAdmin,
    checkIsSuperAdmin,
    addUser,
    resetUserPassword
  };
});
