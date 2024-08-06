const fp = require('fastify-plugin');
const isNil = require('lodash/isNil');

module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.account;

  const addCompanyInfo = async companyInfo => {
    const currentCompanyInfo = await models.companyInfo.create(companyInfo);
    return Object.assign({}, currentCompanyInfo.get({ plain: true }), {
      id: currentCompanyInfo.uuid
    });
  };

  const getTenantCompanyInfoInstance = async ({ tenantId }) => {
    const currentTenantCompanyInfo = await models.companyInfo.findOne({
      where: {
        tenantId
      }
    });
    if (!currentTenantCompanyInfo) {
      return await addCompanyInfo({ tenantId });
    }

    return currentTenantCompanyInfo;
  };

  const getTenantCompanyInfo = async ({ tenantId }) => {
    return await getTenantCompanyInfoInstance({ tenantId });
  };

  const saveTenantCompanyInfo = async ({ tenantId, id, ...others }) => {
    const tenantCompanyInfo = await models.companyInfo.findOne({
      where: {
        id
      }
    });
    if (tenantId !== tenantCompanyInfo.tenantId) {
      throw new Error('租户Id和当前租户用户的租户Id不一致');
    }
    ['name', 'shortName', 'themeColor', 'logo', 'description'].forEach(name => {
      if (!isNil(others[name])) {
        tenantCompanyInfo[name] = others[name];
      }
    });

    await tenantCompanyInfo.save();
    return tenantCompanyInfo;
  };

  services.tenantCompany = {
    getTenantCompanyInfo,
    saveTenantCompanyInfo
  };
});
