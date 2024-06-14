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

  const getRoleList = async ({ tenantId, currentPage, perPage, filter }) => {
    const queryFilter = {};
    if (!isNil(filter?.type)) {
      queryFilter.type = filter.type;
    }
    const { count, rows } = await fastify.account.models.tenantRole.findAndCountAll({
      where: Object.assign({}, queryFilter, { tenantId }),
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

  const closeTenant = async ({ tenantId }) => {
    const tenant = await getTenantInfo({ id: tenantId });
    tenant.status = 12;
    await tenant.save();
  };

  const openTenant = async ({ tenantId }) => {
    const tenant = await getTenantInfo({ id: tenantId });
    tenant.status = 0;
    await tenant.save();
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

  const saveTenantOrg = async ({ id, ...otherInfo }) => {
    const tenantOrg = await fastify.account.models.tenantOrg.findByPk(id, {
      where: {
        type: 0
      }
    });

    if (!tenantOrg) {
      throw new Error('该组织不存在');
    }
    if (
      await fastify.account.models.tenantOrg.count({
        where: {
          name: otherInfo.name,
          pid: otherInfo.pid,
          tenantId: otherInfo.tenantId
        }
      })
    ) {
      throw new Error('组织名称在同一父组织下有重复');
    }

    ['name', 'enName', 'tenantId', 'pid'].forEach(name => {
      if (otherInfo[name]) {
        tenantOrg[name] = otherInfo[name];
      }
    });

    await tenantOrg.save();
  };

  const deleteTenantOrg = async ({ id, tenantId }) => {
    const tenantOrg = await fastify.account.models.tenantOrg.findByPk(id, {
      where: {
        type: 0
      }
    });

    if (!tenantOrg) {
      throw new Error('该组织不存在');
    }

    const { rows } = await fastify.account.models.tenantOrg.findAndCountAll({
      where: { tenantId, pid: id }
    });

    if (rows?.length) {
      throw new Error('组织下有用户或子组织无法删除');
    }

    await tenantOrg.destroy();
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
      include: [fastify.account.models.tenantRole, fastify.account.models.tenantOrg, fastify.account.models.user],
      where: { tenantId }
    });

    return { pageData: rows, totalCount: count };
  };

  const saveTenantUserInfoValidate = async ({ tenantId, roleIds, orgIds, userId }) => {
    await getTenantInfo({ id: tenantId });
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
      const tenantOrg = await fastify.account.models.tenantOrg.findOne({
        where: {
          pid: 0,
          tenantId
        }
      });
      if (!tenantOrg) {
        throw new Error('租户根节点不存在');
      }
      orgIds = [tenantOrg.id];
    }

    if (
      (await fastify.account.models.tenantOrg.count({
        where: {
          tenantId,
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
    const tenant = await getTenantInfo({ id: tenantId });

    const currentAccountNumber = await fastify.account.models.tenantUser.count({
      where: { tenantId }
    });

    if (currentAccountNumber >= tenant.accountNumber) {
      throw new Error('租户用户数量已达上限');
    }

    await saveTenantUserInfoValidate({ tenantId, roleIds, orgIds, userId });

    const t = await fastify.sequelize.instance.transaction();

    if (
      (await fastify.account.models.tenantUser.count({
        where: {
          userId,
          tenantId
        }
      })) > 0
    ) {
      throw new Error('该用户已经属于该租户，不能重复添加');
    }

    try {
      const currentTenantUser = await fastify.account.models.tenantUser.create(
        {
          name: tenantUser.name,
          avatar: tenantUser.avatar,
          phone: tenantUser.phone,
          email: tenantUser.email,
          description: tenantUser.description,
          tenantId,
          userId
        },
        { transaction: t }
      );
      roleIds.length > 0 &&
        (await fastify.account.models.tenantUserRole.bulkCreate(
          roleIds.map(roleId => {
            return {
              tenantRoleId: roleId,
              tenantId,
              tenantUserId: currentTenantUser.id
            };
          }),
          { transaction: t }
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
    const currentTenantUser = await fastify.account.models.tenantUser.findByPk(id);
    if (!currentTenantUser) {
      throw new Error('租户用户不存在');
    }
    if (tenantId !== currentTenantUser.tenantId) {
      throw new Error('租户Id和当前租户用户的租户Id不一致');
    }
    await saveTenantUserInfoValidate({ tenantId, roleIds, orgIds, userId: currentTenantUser.userId });

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
      const needDeleteTenantRole = tenantRoleIds.filter(targetId => roleIds.indexOf(targetId) === -1);
      const needAddTenantRole = roleIds.filter(targetId => tenantRoleIds.indexOf(targetId) === -1);
      await fastify.account.models.tenantUserRole.destroy({
        where: {
          tenantId,
          tenantUserId: currentTenantUser.id,
          tenantRoleId: {
            [fastify.sequelize.Sequelize.Op.in]: needDeleteTenantRole
          }
        },
        transaction: t
      });
      await fastify.account.models.tenantUserRole.bulkCreate(
        needAddTenantRole.map(tenantRoleId => {
          return { tenantId, tenantUserId: currentTenantUser.id, tenantRoleId };
        }),
        { transaction: t }
      );
      //修改组织
      const needDeleteTenantOrg = tenantOrgIds.filter(targetId => orgIds.indexOf(targetId) === -1);
      const needAddTenantOrg = orgIds.filter(targetId => tenantOrgIds.indexOf(targetId) === -1);
      await fastify.account.models.tenantUserOrg.destroy({
        where: {
          tenantId,
          tenantUserId: currentTenantUser.id,
          tenantOrgId: {
            [fastify.sequelize.Sequelize.Op.in]: needDeleteTenantOrg
          }
        },
        transaction: t
      });
      await fastify.account.models.tenantUserOrg.bulkCreate(
        needAddTenantOrg.map(tenantOrgId => {
          return { tenantId, tenantUserId: currentTenantUser.id, tenantOrgId };
        }),
        { transaction: t }
      );
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const deleteTenantUser = async ({ tenantId, tenantUserId }) => {
    await getTenantInfo({ id: tenantId });
    const tenantUser = await fastify.account.models.tenantUser.findByPk(tenantUserId);
    if (!tenantUser) {
      throw new Error('租户用户不存在');
    }

    const t = await fastify.sequelize.instance.transaction();

    try {
      await fastify.account.models.tenantUserOrg.destroy({
        where: {
          tenantId,
          tenantUserId: tenantUser.id
        },
        transaction: t
      });
      await fastify.account.models.tenantUserRole.destroy({
        where: {
          tenantId,
          tenantUserId: tenantUser.id
        },
        transaction: t
      });
      await tenantUser.destroy({ transaction: t });
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const closeTenantUser = async ({ tenantId, tenantUserId }) => {
    await getTenantInfo({ id: tenantId });
    const tenantUser = await fastify.account.models.tenantUser.findByPk(tenantUserId);
    if (!tenantUser) {
      throw new Error('租户用户不存在');
    }
    tenantUser.status = 12;

    await tenantUser.save();
  };

  const openTenantUser = async ({ tenantId, tenantUserId }) => {
    await getTenantInfo({ id: tenantId });
    const tenantUser = await fastify.account.models.tenantUser.findByPk(tenantUserId);
    if (!tenantUser) {
      throw new Error('租户用户不存在');
    }
    tenantUser.status = 0;

    await tenantUser.save();
  };

  const getInviteList = async ({ tenantId, filter, currentPage, perPage }) => {
    const queryFilter = {};
    const { count, rows } = await fastify.account.models.tenantToken.findAndCountAll({
      where: Object.assign({}, queryFilter, { tenantId, type: 10 }),
      offset: currentPage * (currentPage - 1),
      limit: perPage
    });
    return { pageData: rows, totalCount: count };
  };

  const generateTenantToken = async ({ type, tenantId, info, tenantUserId }) => {
    await getTenantInfo({ id: tenantId });
    const token = fastify.jwt.sign({ tenantId });
    return await fastify.account.models.tenantToken.create({
      token,
      tenantId,
      info,
      tenantUserId,
      type
    });
  };

  const decodeTenantToken = async ({ type, tenantId, token }) => {
    if (
      (await fastify.account.models.tenantToken.count({
        where: {
          type,
          tenantId,
          token
        }
      })) === 0
    ) {
      throw new Error('token已过期');
    }

    return fastify.jwt.decode(token);
  };

  const addInviteToken = async ({ info, tenantId, tenantUserId }) => {
    return await generateTenantToken({ info, tenantId, tenantUserId, type: 10 });
  };

  const deleteInviteToken = async ({ id }) => {
    const token = await fastify.account.models.tenantToken.findByPk(id);
    if (!token) {
      throw new Error('数据不存在');
    }

    await token.destroy();
  };

  fastify.account.services.tenant = {
    getUserTenant,
    closeTenant,
    openTenant,
    tenantUserAuthenticate,
    getTenantInfo,
    getRoleList,
    addRole,
    saveRole,
    removeRole,
    addTenantOrg,
    deleteTenantOrg,
    saveTenantOrg,
    getTenantOrgList,
    getTenantUserList,
    addTenantUser,
    saveTenantUser,
    deleteTenantUser,
    closeTenantUser,
    openTenantUser,
    getInviteList,
    generateTenantToken,
    decodeTenantToken,
    addInviteToken,
    deleteInviteToken
  };
});
