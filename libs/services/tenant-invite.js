const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.account;
  const getInviteList = async ({ tenantId, filter, currentPage, perPage }) => {
    const queryFilter = {};
    const { count, rows } = await models.tenantToken.findAndCountAll({
      where: Object.assign({}, queryFilter, { tenantId, type: 10 }),
      offset: currentPage * (currentPage - 1),
      limit: perPage
    });
    return { pageData: rows, totalCount: count };
  };

  const generateTenantToken = async ({ type, tenantId, info, tenantUserId }) => {
    await services.tenant.getTenant({ id: tenantId });
    const token = fastify.jwt.sign({ tenantId });
    return await models.tenantToken.create({
      token,
      tenantId,
      info,
      tenantUserId,
      type
    });
  };

  const decodeTenantToken = async ({ type, tenantId, token }) => {
    if (
      (await models.tenantToken.count({
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
    const token = await models.tenantToken.findByPk(id);
    if (!token) {
      throw new Error('数据不存在');
    }

    await token.destroy();
  };

  services.tenantInvite = {
    getInviteList,
    generateTenantToken,
    decodeTenantToken,
    addInviteToken,
    deleteInviteToken
  };
});
