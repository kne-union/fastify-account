const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  const getUserInfo = () => {
  };

  const getTenantList = () => {
  };

  fastify.decorate('UserService', {
    getUserInfo, getTenantList
  });
});
