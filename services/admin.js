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

  const addSuperAdmin = async ({ username, nickname, password }) => {
    const user = await fastify.UserService.register({ username, nickname, password, status: 1 });
    await fastify.models.adminRole.create({
      userId: user.id, role: ROLE['SuperAdmin']
    });
  };

  const setSuperAdmin = async (targetUser) => {
    const user = await fastify.UserService.getUserInfo(targetUser);
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
    const { count, rows } = await fastify.models.tenant.findAndCountAll({});
    return {
      pageData: rows, totalCount: count
    };
  };

  const addTenant = async (tenant) => {
    if (await fastify.models.tenant.count({ where: { name: tenant.name } })) {
      throw new Error('租户名称不能重复');
    }
    await fastify.models.tenant.create(tenant);
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

  fastify.decorate('AdminService', {
    initSuperAdmin,
    setSuperAdmin,
    getAllUserList,
    getAllTenantList,
    addTenant,
    saveTenant,
    addSuperAdmin,
    superAdminAuthenticate,
    generateTenantAdminVerifyCode,
    verifyTenantAdmin
  });
});
