const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.account;

  const addRequestLog = async ({ userInfo, type, tenantId, appName, action, summary }) => {
    const application = appName && (await services.application.getApplicationByCode({ code: appName }));
    await models.requestLog.create({
      userId: userInfo.id,
      tenantId,
      applicationId: application?.id,
      type,
      action,
      summary
    });
    return {};
  };

  const getRequestLogList = async ({ filter, type, perPage, currentPage }) => {
    const { count, rows } = await models.requestLog.findAndCountAll({
      include: [models.application, models.user],
      order: [['createdAt', 'DESC']],
      where: Object.assign({}, filter, { type }),
      offset: perPage * (currentPage - 1),
      limit: perPage
    });
    return {
      pageData: rows,
      totalCount: count
    };
  };

  services.requestLog = {
    addRequestLog,
    getRequestLogList
  };
});
