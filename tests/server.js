const fastify = require('fastify')({
  logger: true, querystringParser: str => require('qs').parse(str)
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
  }, prefix: 't_account_'
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

fastify.register(require('../index'), {
  isTest: true, sendMessage: async ({name, type, messageType, props}) => {
    console.log('send message:', name, type, messageType, props);
  }, jwt: { expires: 1000 * 60 * 60 * 24 }
});

fastify.register(require('fastify-plugin')(async (fastify) => {
  await fastify.sequelize.sync();
}));

fastify.register(require('@kne/fastify-response-data-format'));

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
