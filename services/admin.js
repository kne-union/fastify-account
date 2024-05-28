const fp = require('fastify-plugin');

const ROLE = {
  'SuperAdmin': 'SuperAdmin', 'TenantAdmin': 'TenantAdmin'
};

module.exports = fp(async (fastify, options) => {
  const initSuperAdmin = async (user) => {
    if (await fastify.models.adminRole.count() > 0) {
      throw new Error('系统已经初始化完成，不能执行该操作');
    }
    await fastify.models.adminRole.create({
      userId: user.id, role: ROLE['SuperAdmin']
    });
  };

  const superAdminAuthenticate = async (user) => {
    if (await fastify.models.adminRole.count({
      where: {
        userId: user.id, role: ROLE['SuperAdmin']
      }
    }) === 0) {
      throw new Error('不能执行该操作，需要超级管理员权限');
    }
  };

  const addUser = async ({ avatar, nickname, phone, email, password, description }) => {
    return await fastify.accountServices.user.addUser({
      avatar, nickname, phone, email, password, description, status: 1
    });
  };

  const setSuperAdmin = async (targetUser) => {
    const user = await fastify.accountServices.user.getUserInfo(targetUser);
    if (await fastify.models.adminRole.count({
      where: {
        userId: user.id, role: ROLE['SuperAdmin']
      }
    }) > 0) {
      throw new Error('当前用户已经是超级管理员');
    }

    await fastify.models.adminRole.create({
      userId: user.id, role: ROLE['SuperAdmin']
    });
  };

  const getAllUserList = async ({ filter, perPage, currentPage }) => {
    const { count, rows } = await fastify.models.user.findAndCountAll({
      include: [{
        attributes: ['role'], model: fastify.models.adminRole
      }, {
        model: fastify.models.tenant
      }]
    });
    return {
      pageData: rows, totalCount: count
    };
  };

  const getAllTenantList = async ({ filter, perPage, currentPage }) => {
    const queryFilter = {};
    if (filter?.name) {
      queryFilter.name = {
        [fastify.Sequelize.Op.like]: `%${filter.name}%`
      };
    }

    if (filter?.serviceStartTime) {
      queryFilter.serviceStartTime = {
        [fastify.Sequelize.Op.gt]: filter.serviceStartTime
      };
    }

    if (filter?.serviceEndTime) {
      queryFilter.serviceEndTime = {
        [fastify.Sequelize.Op.lt]: filter.serviceEndTime
      };
    }

    const { count, rows } = await fastify.models.tenant.findAndCountAll({
      where: queryFilter, offset: currentPage * (currentPage - 1), limit: perPage
    });

    const res = await fastify.models.tenantUser.findAll({
      attributes: ['tenantId', fastify.sequelize.fn('count', fastify.sequelize.col('tenantId'))], where: {
        tenantId: {
          [fastify.Sequelize.Op.in]: rows.map(({ id }) => id)
        }
      }, group: 'tenantId'
    });

    return {
      pageData: rows, totalCount: count
    };
  };

  const addTenant = async (tenant) => {
    if (await fastify.models.tenant.count({ where: { name: tenant.name } })) {
      throw new Error('租户名称不能重复');
    }

    const t = await fastify.sequelize.transaction();
    try {
      const currentTenant = await fastify.models.tenant.create(tenant);
      await fastify.models.tenantRole.create({
        name: '系统默认角色',
        tenantId: currentTenant.id,
        description: '创建租户时自动生成，可以设置权限，不可更改删除，所有租户用户默认拥有该角色',
        type: 1
      });
      await fastify.models.tenantOrg.create({
        name: tenant.name,
        tenantId: currentTenant.id,
      });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const saveTenant = async (tenant) => {
    const currentTenant = await fastify.models.tenant.findByPk(tenant.id);
    if (!currentTenant) {
      throw new Error('租户不存在，请刷新以后重试');
    }
    await currentTenant.update(tenant);
  };

  const generateTenantAdminVerifyCode = async () => {

  };

  const verifyTenantAdmin = async () => {

  };

  const resetUserPassword = async ({ userId, password }) => {
    await fastify.accountServices.account.resetPassword({ userId, password });
  };

  fastify.accountServices.admin = {
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
