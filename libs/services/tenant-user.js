const fp = require('fastify-plugin');
const transform = require('lodash/transform');
const groupBy = require('lodash/groupBy');
const { Unauthorized } = require('http-errors');
const pick = require('lodash/pick');
const isNil = require('lodash/isNil');
module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.account;
  const { Op } = fastify.sequelize.Sequelize;

  const getTenantUserPermissionList = async ({ tenantRoleIds }) => {
    const tenantRoleApplication = await models.tenantRoleApplication.findAll({
      attributes: ['applicationId'],
      where: {
        roleId: {
          [Op.in]: tenantRoleIds
        }
      }
    });

    const applications = await services.application.getApplicationListByIds({ ids: tenantRoleApplication.map(({ applicationId }) => applicationId) });
    const permissions = await services.tenantRole.getPermissionByTenantRoles({ tenantRoleIds });
    const permissionMapping = transform(
      await models.permission.findAll({
        where: {
          id: {
            [Op.in]: permissions.map(({ paths }) => paths).reduce((list, item) => [...list, ...(item || [])], [])
          }
        }
      }),
      (result, value) => {
        result[value.id] = { code: value.code, name: value.name };
      },
      {}
    );

    const applicationsMapping = transform(
      applications,
      (result, value) => {
        result[value.uuid] = value;
      },
      {}
    );

    const findEndChildren = permissions => {
      const output = [];
      const core = (list, node) => {
        const { children, other } = groupBy(list, item => (item.pid === node.id ? 'children' : 'other'));
        if (!(children && children.length > 0)) {
          node.id !== 0 && output.push(node);
          return;
        }
        children.forEach(node => {
          core(other || [], node);
        });
        return output;
      };
      core(permissions, { id: 0 });
      return output;
    };

    const userPermissionList = findEndChildren(permissions).map(({ code, applicationId, paths }) => {
      return `${applicationsMapping[applicationId].code}${
        paths && paths.length > 0
          ? `:${paths
              .map(id => {
                return permissionMapping[id].code;
              })
              .join(':')}`
          : ''
      }:${code}`;
    });

    return {
      applications: applications,
      permissions: permissions.map(item =>
        Object.assign(
          {},
          {
            code: item.code,
            name: item.name,
            isModule: item.isModule,
            paths: (item.paths || []).map(id => permissionMapping[id])
          }
        )
      ),
      userPermissionList
    };
  };

  const getUserTenant = async authenticatePayload => {
    const user = await services.user.getUser(authenticatePayload);
    const tenantUserList = await models.tenantUser.findAll({
      where: {
        userId: user.id
      }
    });

    const tenantList =
      tenantUserList.length > 0
        ? await models.tenant.findAll({
            where: {
              uuid: {
                [Op.in]: tenantUserList.map(({ tenantId }) => tenantId)
              },
              status: 0
            }
          })
        : [];

    const currentTenantUser = user.currentTenantId && tenantUserList.find(({ tenantId }) => tenantId === user.currentTenantId);
    const currentTenant = currentTenantUser && tenantList.find(({ uuid }) => uuid === currentTenantUser.tenantId);

    return {
      currentTenant: currentTenant && Object.assign({}, currentTenant.get({ plain: true }), { id: currentTenant.uuid }),
      currentTenantUser: currentTenantUser && Object.assign({}, currentTenantUser.get({ plain: true }), { id: currentTenantUser.uuid }),
      tenantList: tenantList.map(item => {
        return Object.assign({}, item.get({ plain: true }), { id: item.uuid });
      }),
      tenantUserList: tenantUserList.map(item => {
        return Object.assign({}, item.get({ plain: true }), { id: item.uuid });
      }),
      userInfo: user
    };
  };

  const getTenantUserInstance = async ({ id }) => {
    const currentTenantUser = await models.tenantUser.findOne({
      where: {
        uuid: id
      }
    });
    if (!currentTenantUser) {
      throw new Error('租户用户不存在');
    }

    return currentTenantUser;
  };

  const getTenantUserByUserId = async user => {
    if (!user.currentTenantId) {
      throw new Unauthorized('没有找到当前绑定租户');
    }
    const tenant = await services.tenant.getTenant({ id: user.currentTenantId });

    const tenantUser = await models.tenantUser.findOne({
      attributes: ['uuid', 'avatar', 'name', 'description', 'phone', 'email'],
      include: [
        {
          attributes: ['id', 'name'],
          model: models.tenantOrg
        },
        {
          attributes: ['id', 'name'],
          model: models.tenantRole
        }
      ],
      where: {
        tenantId: tenant.id,
        userId: user.id,
        status: 0
      }
    });

    if (!tenantUser) {
      throw Unauthorized('租户用户不存在');
    }

    // 获取当前租户默认角色
    const defaultTenant = await models.tenantRole.findOne({
      where: {
        type: 1,
        tenantId: tenant.id
      }
    });

    if (!defaultTenant) {
      throw new Error('租户默认角色未设置，请联系管理员');
    }

    const tenantRoleIds = tenantUser.tenantRoles.map(({ id }) => id);
    tenantRoleIds.push(defaultTenant.id);

    const { userPermissionList } = await getTenantUserPermissionList({ tenantRoleIds });
    if (!tenantUser) {
      throw new Error('当前租户用户不存在或者已经被关闭');
    }

    const outputTenantUser = Object.assign({}, tenantUser.get({ plain: true }), { id: tenantUser.uuid });
    outputTenantUser.tenantOrgs = outputTenantUser?.tenantOrgs.map(({ id, name }) => ({ id, name }));
    outputTenantUser.tenantRoles = outputTenantUser?.tenantRoles.map(({ id, name }) => ({ id, name }));
    return {
      tenant: pick(tenant, ['id', 'name', 'description']),
      tenantUser: Object.assign({}, outputTenantUser, {
        permissions: userPermissionList
      }),
      user
    };
  };

  const checkTenantRoleUsed = async ({ tenantRoleId }) => {
    if (
      (await models.tenantUserRole.count({
        where: {
          tenantRoleId
        }
      })) > 0
    ) {
      throw new Error('该角色已经被使用，请在租户用户种处理掉所有使用该角色的租户用户后重试');
    }
  };

  const checkTenantUserInfoValidate = async ({ tenantId, roleIds, orgIds, userId }) => {
    await services.tenant.getTenant({ id: tenantId });
    if (
      roleIds &&
      roleIds.length > 0 &&
      (await models.tenantRole.count({
        where: {
          id: {
            [Op.in]: roleIds
          }
        }
      })) < roleIds.length
    ) {
      throw new Error('包含租户不存在的角色');
    }
    if (orgIds && orgIds.length === 0) {
      const tenantOrg = await models.tenantOrg.findOne({
        where: {
          pid: 0,
          tenantId
        }
      });
      if (!tenantOrg) {
        throw new Error('租户根节点不存在');
      }
    }

    if (
      orgIds &&
      orgIds.length > 0 &&
      (await models.tenantOrg.count({
        where: {
          tenantId,
          id: {
            [Op.in]: orgIds
          }
        }
      })) < orgIds.length
    ) {
      throw new Error('包含租户不存在组织');
    }

    try {
      await services.user.getUserInstance({ id: userId });
    } catch (e) {
      throw new Error('用户不存在，应该先创建用户再创建租户用户');
    }
  };

  const addTenantUser = async ({ tenantId, roleIds, orgIds, userId, ...tenantUser }) => {
    const tenant = await services.tenant.getTenant({ id: tenantId });

    const currentAccountNumber = await models.tenantUser.count({
      where: { tenantId }
    });

    if (currentAccountNumber >= tenant.accountNumber) {
      throw new Error('租户用户数量已达上限');
    }

    await checkTenantUserInfoValidate({ tenantId, roleIds, orgIds, userId });

    const t = await fastify.sequelize.instance.transaction();

    if (
      (await models.tenantUser.count({
        where: {
          userId,
          tenantId
        }
      })) > 0
    ) {
      throw new Error('该用户已经属于该租户，不能重复添加');
    }

    try {
      const currentTenantUser = await models.tenantUser.create(
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
        (await models.tenantUserRole.bulkCreate(
          roleIds.map(roleId => {
            return {
              tenantRoleId: roleId,
              tenantId,
              tenantUserId: currentTenantUser.uuid
            };
          }),
          { transaction: t }
        ));

      await models.tenantUserOrg.bulkCreate(
        orgIds.map(orgId => {
          return {
            tenantOrgId: orgId,
            tenantId,
            tenantUserId: currentTenantUser.uuid
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
    const currentTenantUser = await getTenantUserInstance({ id });
    if (tenantId !== currentTenantUser.tenantId) {
      throw new Error('租户Id和当前租户用户的租户Id不一致');
    }
    await checkTenantUserInfoValidate({ tenantId, roleIds, orgIds, userId: currentTenantUser.userId });

    const tenantRoleIds = (
      await models.tenantUserRole.findAll({
        attributes: ['tenantRoleId'],
        where: {
          tenantId,
          tenantUserId: currentTenantUser.uuid
        }
      })
    ).map(({ tenantRoleId }) => tenantRoleId);

    const tenantOrgIds = (
      await models.tenantUserOrg.findAll({
        attributes: ['tenantOrgId'],
        where: {
          tenantId,
          tenantUserId: currentTenantUser.uuid
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
      if (roleIds) {
        const needDeleteTenantRole = tenantRoleIds.filter(targetId => roleIds.indexOf(targetId) === -1);
        const needAddTenantRole = roleIds.filter(targetId => tenantRoleIds.indexOf(targetId) === -1);
        await models.tenantUserRole.destroy({
          where: {
            tenantId,
            tenantUserId: currentTenantUser.uuid,
            tenantRoleId: {
              [Op.in]: needDeleteTenantRole
            }
          },
          transaction: t
        });
        await models.tenantUserRole.bulkCreate(
          needAddTenantRole.map(tenantRoleId => {
            return { tenantId, tenantUserId: currentTenantUser.uuid, tenantRoleId };
          }),
          { transaction: t }
        );
      }
      //修改组织
      if (orgIds) {
        const needDeleteTenantOrg = tenantOrgIds.filter(targetId => orgIds.indexOf(targetId) === -1);
        const needAddTenantOrg = orgIds.filter(targetId => tenantOrgIds.indexOf(targetId) === -1);
        await models.tenantUserOrg.destroy({
          where: {
            tenantId,
            tenantUserId: currentTenantUser.uuid,
            tenantOrgId: {
              [Op.in]: needDeleteTenantOrg
            }
          },
          transaction: t
        });
        await models.tenantUserOrg.bulkCreate(
          needAddTenantOrg.map(tenantOrgId => {
            return { tenantId, tenantUserId: currentTenantUser.uuid, tenantOrgId };
          }),
          { transaction: t }
        );
      }
      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  };

  const deleteTenantUser = async ({ tenantId, tenantUserId }) => {
    await services.tenant.getTenant({ id: tenantId });
    const tenantUser = await getTenantUserInstance({ id: tenantUserId });

    const t = await fastify.sequelize.instance.transaction();

    try {
      await models.tenantUserOrg.destroy({
        where: {
          tenantId,
          tenantUserId: tenantUser.uuid
        },
        transaction: t
      });
      await models.tenantUserRole.destroy({
        where: {
          tenantId,
          tenantUserId: tenantUser.uuid
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
    await services.tenant.getTenant({ id: tenantId });
    const tenantUser = await getTenantUserInstance({ id: tenantUserId });
    tenantUser.status = 12;
    await tenantUser.save();
  };

  const openTenantUser = async ({ tenantId, tenantUserId }) => {
    await services.tenant.getTenant({ id: tenantId });
    const tenantUser = await getTenantUserInstance({ id: tenantUserId });
    tenantUser.status = 0;
    await tenantUser.save();
  };

  const getTenantUserList = async ({ tenantId }) => {
    await services.tenant.getTenant({ id: tenantId });

    const { count, rows } = await fastify.account.models.tenantUser.findAndCountAll({
      include: [fastify.account.models.tenantRole, fastify.account.models.tenantOrg, fastify.account.models.user],
      where: { tenantId }
    });

    return {
      pageData: rows.map(item => {
        return Object.assign({}, item.get({ pain: true }), { id: item.uuid });
      }),
      totalCount: count
    };
  };

  const includeTenantUserBatch = async ({ tenantId, list }) => {
    await services.tenant.getTenant({ id: tenantId });
    const errors = [],
      successes = [];
    for (let current of list) {
      if (!(current.phone || current.email)) {
        errors.push({ item: current, msg: '电话和邮箱不能同时为空' });
        continue;
      }
      const currentQuery = [];
      if (current.phone) {
        currentQuery.push({ phone: current.phone });
      }
      if (current.email) {
        currentQuery.push({ email: current.email });
      }

      if (
        (await models.tenantUser.count({
          where: {
            [Op.or]: currentQuery
          }
        })) > 0
      ) {
        errors.push({ item: current, msg: '租户用户已经存在，或手机邮箱和已有租户用户重复' });
        continue;
      }

      if (await services.user.accountIsExists(current, {})) {
        errors.push({ item: current, msg: '用户已经存在，已发送加入租户邀请等待对方同意' });
        continue;
      }

      try {
        const user = await services.user.addUser({
          nickname: current.name,
          phone: current.phone,
          email: current.email,
          password: services.account.md5(current.password || options.defaultPassword),
          status: 1
        });
        const rootOrg = await services.tenantOrg.getTenantOrgRoot({ tenantId });
        await services.tenantUser.addTenantUser(
          Object.assign(
            {},
            {
              orgIds: [rootOrg.id],
              roleIds: []
            },
            {
              tenantId,
              userId: user.id,
              ...current
            }
          )
        );
        successes.push({ item: current });
      } catch (e) {
        errors.push({ item: current, msg: e.message });
        throw e;
      }
    }

    return { errors, successes };
  };

  services.tenantUser = {
    getUserTenant,
    getTenantUserPermissionList,
    getTenantUserByUserId,
    checkTenantRoleUsed,
    checkTenantUserInfoValidate,
    addTenantUser,
    saveTenantUser,
    deleteTenantUser,
    closeTenantUser,
    openTenantUser,
    getTenantUserList,
    includeTenantUserBatch
  };
});
