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

  services.requestLog = { addRequestLog };
});
