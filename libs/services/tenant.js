const fp = require('fastify-plugin');
const isNil = require('lodash/isNil');
module.exports = fp(async (fastify, options) => {
  const getUserTenant = async authenticatePayload => {
    const user = await fastify.account.services.user.getUserInfo(authenticatePayload);
    const tenantUserList = await fastify.account.models.tenantUser.findAll({
      where: {
        userId: user.id
      }
    });

    const tenantList =
      tenantUserList.length > 0
        ? await fastify.account.models.tenant.findAll({
            where: {
              id: {
                [fastify.sequelize.Sequelize.Op.in]: tenantUserList.map(({ tenantId }) => tenantId)
              },
              status: 0
            }
          })
        : [];

    const currentTenantUser = user.currentTenantId && tenantUserList.find(({ tenantId }) => tenantId === user.currentTenantId);
    const currentTenant = currentTenantUser && tenantList.find(({ id }) => id === currentTenantUser.tenantId);

    return {
      currentTenant,
      currentTenantUser,
      tenantList,
      tenantUserList,
      userInfo: user
    };
  };

  const getTenantInfo = async ({ id }) => {
    const tenant = await fastify.account.models.tenant.findByPk(id);
    if (!tenant) {
      throw new Error('租户不存在');
    }
    return tenant;
  };

  const getRoleList = async ({ tenantId, currentPage, perPage }) => {
    const { count, rows } = await fastify.account.models.tenantRole.findAndCountAll({
      where: { tenantId },
      offset: currentPage * (currentPage - 1),
      limit: perPage
    });

    return { pageData: rows, totalCount: count };
  };

  const addRole = async ({ tenantId, name, description }) => {
    if (!(await fastify.account.models.tenant.findByPk(tenantId))) {
      throw new Error('租户不存在');
    }

    return await fastify.account.models.tenantRole.create({
      tenantId,
      name,
      description
    });
  };

  const saveRole = async ({ id, ...otherInfo }) => {
    const tenantRole = await fastify.account.models.tenantRole.findByPk(id, {
      where: {
        type: 0
      }
    });

    if (!tenantRole) {
      throw new Error('角色不存在');
    }

    ['name', 'description'].forEach(name => {
      if (otherInfo[name]) {
        tenantRole[name] = otherInfo[name];
      }
    });

    await tenantRole.save();
  };

  const removeRole = async ({ id }) => {
    const tenantRole = await fastify.account.models.tenantRole.findByPk(id, {
      where: {
        type: 0
      }
    });

    if (!tenantRole) {
      throw new Error('角色不存在');
    }

    if (
      (await fastify.account.models.tenantUserRole.count({
        where: {
          tenantRoleId: tenantRole.id
        }
      })) > 0
    ) {
      throw new Error('该角色已经被使用，请在租户用户种处理掉所有使用该角色的租户用户后重试');
    }

    if (tenantRole.type === 1) {
      throw new Error('该角色为系统默认角色，不能删除');
    }

    await tenantRole.destroy();
  };

  const tenantUserAuthenticate = async user => {
    if (!user.currentTenantId) {
      throw new Error('没有找到当前绑定租户');
    }
    const tenant = await fastify.account.models.tenant.findByPk(user.currentTenantId, {
      where: {
        status: 0
      }
    });
    if (!tenant) {
      throw new Error('当前绑定租户不存在或者已经被关闭');
    }

    const tenantUser = await fastify.account.models.tenantUser.findOne({
      where: {
        tenantId: tenant.id,
        userId: user.id,
        status: 0
      }
    });

    if (!tenantUser) {
      throw new Error('当前租户用户不存在或者已经被关闭');
    }

    return {
      tenant,
      tenantUser
    };
  };

  const addTenantOrg = async org => {
    if (await fastify.account.models.tenantOrg.count({ where: { name: org.name } })) {
      throw new Error('组织名称不能重复');
    }

    return await fastify.account.models.tenantOrg.create({
      name: org.name,
      enName: org.enName,
      tenantId: org.tenantId,
      pid: org.pid
    });
  };

  const getTenantOrgList = async ({ tenantId }) => {
    const { count, rows } = await fastify.account.models.tenantOrg.findAndCountAll({
      where: { tenantId }
    });

    return { pageData: rows, totalCount: count };
  };

  const getTenantUserList = async ({ tenantId }) => {
    if (!(await fastify.account.models.tenant.findByPk(tenantId))) {
      throw new Error('租户不存在');
    }
    const { count, rows } = await fastify.account.models.tenantUser.findAndCountAll({
      where: { tenantId }
    });

    return { pageData: rows, totalCount: count };
  };

  const saveTenantUserInfoValidate = async ({ tenantId, roleIds, orgIds, userId }) => {
    if (!(await fastify.account.models.tenant.findByPk(tenantId))) {
      throw new Error('租户不存在');
    }
    if (
      roleIds.length > 0 &&
      (await fastify.account.models.tenantRole.count({
        where: {
          id: {
            [fastify.sequelize.Sequelize.Op.in]: roleIds
          }
        }
      })) < roleIds.length
    ) {
      throw new Error('包含租户不存在的角色');
    }
    if (orgIds.length === 0) {
      throw new Error('租户用户所属组织不能为空');
    }
    if (
      !(await fastify.account.models.tenantOrg.count({
        where: {
          id: {
            [fastify.sequelize.Sequelize.Op.in]: orgIds
          }
        }
      })) < orgIds.length
    ) {
      throw new Error('包含租户不存在组织');
    }

    if (!(await fastify.account.models.user.findByPk(userId))) {
      throw new Error('用户不存在，应该先创建用户再创建租户用户');
    }
  };

  const addTenantUser = async ({ tenantId, roleIds, orgIds, userId, ...tenantUser }) => {
    await saveTenantUserInfoValidate({ tenantId, roleIds, orgIds, userId });

    const t = await fastify.sequelize.instance.transaction();

    try {
      const currentTenantUser = await fastify.account.models.tenantUser.create(
        {
          name: tenantUser.name,
          avatar: tenantUser.avatar,
          phone: tenantUser.phone,
          email: tenantUser.email,
          description: tenantUser.description
        },
        { transaction: t }
      );
      roleIds.length > 0 &&
        (await fastify.account.models.tenantUserRole.bulkCreate(
          roleIds.map(
            roleId => {
              return {
                tenantRoleId: roleId,
                tenantId,
                tenantUserId: currentTenantUser.id
              };
            },
            { transaction: t }
          )
        ));

      await fastify.account.models.tenantUserOrg.bulkCreate(
        orgIds.map(orgId => {
          return {
            tenantOrgId: orgId,
            tenantId,
            tenantUserId: currentTenantUser.id
          };
        }),
        { transaction: t }
      );

      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const saveTenantUser = async ({ id, tenantId, roleIds, orgIds, userId, ...tenantUser }) => {
    await saveTenantUserInfoValidate({ tenantId, roleIds, orgIds, userId });

    const currentTenantUser = await fastify.account.models.tenantUser.findByPk(id);
    if (!currentTenantUser) {
      throw new Error('租户用户不存在');
    }

    const tenantRoleIds = (
      await fastify.account.models.tenantUserRole.findAll({
        attributes: ['tenantRoleId'],
        where: {
          tenantId,
          tenantUserId: currentTenantUser.id
        }
      })
    ).map(({ tenantRoleId }) => tenantRoleId);

    const tenantOrgIds = (
      await fastify.account.models.tenantUserOrg.findAll({
        attributes: ['tenantOrgId'],
        where: {
          tenantId,
          tenantUserId: currentTenantUser.id
        }
      })
    ).map(({ tenantOrgId }) => tenantOrgId);

    const t = await fastify.sequelize.instance.transaction();

    try {
      ['name', 'avatar', 'phone', 'email', 'description'].forEach(name => {
        if (!isNil(tenantUser[name])) {
          currentTenantUser[name] = tenantUser[name];
        }
      });
      await currentTenantUser.save({ transaction: t });

      // 修改角色

      //修改组织

      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  fastify.account.services.tenant = {
    getUserTenant,
    tenantUserAuthenticate,
    getTenantInfo,
    getRoleList,
    addRole,
    saveRole,
    removeRole,
    addTenantOrg,
    getTenantOrgList,
    getTenantUserList,
    addTenantUser
  };
});
