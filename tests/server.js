const fastify = require('fastify')({
  logger: true
});


const path = require('path');
const packageJson = require('../package.json');
const { promises: fs } = require('fs');

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

fastify.register(require('@fastify/swagger'), {
  routePrefix: `/api/v${packageJson.version.split('.')[0]}/account`, openapi: {
    info: {
      title: packageJson.name, description: packageJson.description, version: packageJson.version
    }, components: {}
  }
});

fastify.register(require('../index'), { isTest: true });

fastify.register(require('fastify-plugin')(async (fastify) => {
  await fastify.sequelize.sync();
}));

fastify.addHook('onSend', async (request, reply, payload) => {
  const contentType = reply.getHeader('content-type');
  if (contentType && contentType.indexOf('application/json') > -1) {
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

fastify.ready().then(async () => {
  const api = fastify.swagger();
  const converter = require('widdershins');
  const fs = require('fs').promises;
  const md = await converter.convert(api, {});
  await fs.writeFile(path.resolve(__dirname, '../doc/api.md'), md);
});
