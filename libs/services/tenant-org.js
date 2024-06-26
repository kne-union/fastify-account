const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.account;

  const getTenantOrgInstance = async ({ id }) => {
    const tenantOrg = await models.tenantOrg.findByPk(id, {
      where: {
        type: 0
      }
    });

    if (!tenantOrg) {
      throw new Error('该组织不存在');
    }

    return tenantOrg;
  };

  const addTenantOrg = async org => {
    if (await models.tenantOrg.count({ where: { name: org.name } })) {
      throw new Error('组织名称不能重复');
    }

    return await models.tenantOrg.create({
      name: org.name,
      enName: org.enName,
      tenantId: org.tenantId,
      pid: org.pid
    });
  };

  const saveTenantOrg = async ({ id, ...otherInfo }) => {
    const tenantOrg = await getTenantOrgInstance({ id });
    if (
      await models.tenantOrg.count({
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
    const tenantOrg = await getTenantOrgInstance({ id });

    const { rows } = await models.tenantOrg.findAndCountAll({
      where: { tenantId, pid: id }
    });

    if (rows?.length) {
      throw new Error('组织下有用户或子组织无法删除');
    }

    await tenantOrg.destroy();
  };

  const getTenantOrgList = async ({ tenantId }) => {
    const data = await models.tenantOrg.findAll({
      where: { tenantId }
    });

    return data.map(item => item.get({ plain: true }));
  };

  services.tenantOrg = {
    getTenantOrgInstance,
    addTenantOrg,
    saveTenantOrg,
    deleteTenantOrg,
    getTenantOrgList
  };
});
