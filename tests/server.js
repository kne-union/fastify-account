const fastify = require('fastify')({
  logger: true
});

const path = require('path');

const sqliteStorage = path.resolve('./tests/database.sqlite');

fastify.register(require('@kne/fastify-sequelize'), {
  db: {
    storage: sqliteStorage
  }, modelsGlobOptions: {
    syncOptions: {}
  }
});

fastify.register(require('@kne/fastify-file-manager'), {
  root: path.resolve('./tests/static')
});

fastify.register(require('../index'), { isTest: true });

fastify.addHook('onSend', async (request, reply, payload) => {
  if (reply.getHeader('content-type').indexOf('application/json') > -1) {
    const responseData = JSON.parse(payload);
    if (responseData.statusCode && (responseData.message || responseData.error)) {
      return JSON.stringify({
        code: responseData.statusCode, msg: responseData.message || responseData.error
      });
    }
    return JSON.stringify({
      code: 0, data: JSON.parse(payload)
    });
  }
  return payload;
});

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});
