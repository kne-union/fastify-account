const fp = require('fastify-plugin');

const ROLE = {
  SuperAdmin: 'SuperAdmin',
  TenantAdmin: 'TenantAdmin'
};

module.exports = fp(async (fastify, options) => {
  const initSuperAdmin = async user => {
    if ((await fastify.account.models.adminRole.count()) > 0) {
      throw new Error('系统已经初始化完成，不能执行该操作');
    }
    await fastify.account.models.adminRole.create({
      userId: user.id,
      role: ROLE['SuperAdmin']
    });
  };

  const superAdminAuthenticate = async user => {
    if (
      (await fastify.account.models.adminRole.count({
        where: {
          userId: user.id,
          role: ROLE['SuperAdmin']
        }
      })) === 0
    ) {
      throw new Error('不能执行该操作，需要超级管理员权限');
    }
  };

  const addUser = async ({ avatar, nickname, phone, email, password, description }) => {
    return await fastify.account.services.user.addUser({
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
    const user = await fastify.account.services.user.getUserInfo(targetUser);
    if (
      (await fastify.account.models.adminRole.count({
        where: {
          userId: user.id,
          role: ROLE['SuperAdmin']
        }
      })) > 0
    ) {
      throw new Error('当前用户已经是超级管理员');
    }

    await fastify.account.models.adminRole.create({
      userId: user.id,
      role: ROLE['SuperAdmin']
    });
  };

  const getAllUserList = async ({ filter, perPage, currentPage }) => {
    const { count, rows } = await fastify.account.models.user.findAndCountAll({
      include: [
        {
          attributes: ['role'],
          model: fastify.account.models.adminRole
        },
        {
          model: fastify.account.models.tenant
        }
      ]
    });
    return {
      pageData: rows,
      totalCount: count
    };
  };

  const getAllTenantList = async ({ filter, perPage, currentPage }) => {
    const queryFilter = {};
    if (filter?.name) {
      queryFilter.name = {
        [fastify.sequelize.Sequelize.Op.like]: `%${filter.name}%`
      };
    }

    if (filter?.serviceStartTime) {
      queryFilter.serviceStartTime = {
        [fastify.sequelize.Sequelize.Op.gt]: filter.serviceStartTime
      };
    }

    if (filter?.serviceEndTime) {
      queryFilter.serviceEndTime = {
        [fastify.sequelize.Sequelize.Op.lt]: filter.serviceEndTime
      };
    }

    const { count, rows } = await fastify.account.models.tenant.findAndCountAll({
      where: queryFilter,
      offset: currentPage * (currentPage - 1),
      limit: perPage
    });

    const res = await fastify.account.models.tenantUser.findAll({
      attributes: ['tenantId', fastify.sequelize.instance.fn('count', fastify.sequelize.instance.col('tenantId'))],
      where: {
        tenantId: {
          [fastify.sequelize.Sequelize.Op.in]: rows.map(({ id }) => id)
        }
      },
      group: 'tenantId'
    });

    return {
      pageData: rows,
      totalCount: count
    };
  };

  const addTenant = async tenant => {
    if (await fastify.account.models.tenant.count({ where: { name: tenant.name } })) {
      throw new Error('租户名称不能重复');
    }

    const t = await fastify.sequelize.instance.transaction();
    try {
      const currentTenant = await fastify.account.models.tenant.create(tenant);
      await fastify.account.models.tenantRole.create({
        name: '系统默认角色',
        tenantId: currentTenant.id,
        description: '创建租户时自动生成，可以设置权限，不可更改删除，所有租户用户默认拥有该角色',
        type: 1
      });
      await fastify.account.models.tenantOrg.create({
        name: tenant.name,
        tenantId: currentTenant.id
      });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const saveTenant = async tenant => {
    const currentTenant = await fastify.account.models.tenant.findByPk(tenant.id);
    if (!currentTenant) {
      throw new Error('租户不存在，请刷新以后重试');
    }
    await currentTenant.update(tenant);
  };

  const generateTenantAdminVerifyCode = async () => {};

  const verifyTenantAdmin = async () => {};

  const resetUserPassword = async ({ userId, password }) => {
    await fastify.account.services.account.resetPassword({ userId, password });
  };

  fastify.account.services.admin = {
    initSuperAdmin,
    setSuperAdmin,
    getAllUserList,
    getAllTenantList,
    addTenant,
    saveTenant,
    superAdminAuthenticate,
    generateTenantAdminVerifyCode,
    verifyTenantAdmin,
    resetUserPassword,
    addUser
  };
});
