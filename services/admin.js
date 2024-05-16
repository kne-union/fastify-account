const fp = require('fastify-plugin');

const ROLE = {
  'SuperAdmin': 'SuperAdmin', 'TenantAdmin': 'TenantAdmin'
};

module.exports = fp(async (fastify, options) => {
  const initSuperAdmin = async (user) => {
    if (await fastify.models.AdminRole.count() > 0) {
      throw new Error('系统已经初始化完成，不能执行该操作');
    }
    await fastify.models.AdminRole.create({
      userId: user.id, role: ROLE['SuperAdmin']
    });
  };

  const superAdminAuthenticate = async (user) => {
    if (await fastify.models.AdminRole.count({
      where: {
        userId: user.id, role: ROLE['SuperAdmin']
      }
    }) === 0) {
      throw new Error('不能执行该操作，需要超级管理员权限');
    }
  };

  const addSuperAdmin = async ({ username, nickname, password }) => {
    const user = await fastify.UserService.register({ username, nickname, password, status: 1 });
    await fastify.models.AdminRole.create({
      userId: user.id, role: ROLE['SuperAdmin']
    });
  };

  const setSuperAdmin = async (targetUser) => {
    const user = await fastify.UserService.getUserInfo(targetUser);
    if (await fastify.models.AdminRole.count({
      where: {
        userId: user.id, role: ROLE['SuperAdmin']
      }
    }) > 0) {
      throw new Error('当前用户已经是超级管理员');
    }
    await fastify.models.AdminRole.create({
      userId: user.id, role: ROLE['SuperAdmin']
    });
  };

  const addTenant = async () => {

  };

  const generateTenantAdminVerifyCode = async () => {

  };

  const verifyTenantAdmin = async () => {

  };

  fastify.decorate('AdminService', {
    initSuperAdmin,
    setSuperAdmin,
    addSuperAdmin,
    superAdminAuthenticate,
    generateTenantAdminVerifyCode,
    verifyTenantAdmin
  });
});
