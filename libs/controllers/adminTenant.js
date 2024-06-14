const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  fastify.get(
    `${options.prefix}/admin/getAllTenantList`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        query: {
          type: 'object',
          properties: {
            name: {
              type: 'string'
            },
            serviceStartTime: {
              type: 'string',
              format: 'date-time'
            },
            serviceEndTime: {
              type: 'string',
              format: 'date-time'
            },
            perPage: {
              type: 'number'
            },
            currentPage: {
              type: 'number'
            }
          }
        }
      }
    },
    async request => {
      const { name, perPage, currentPage } = Object.assign(
        {
          perPage: 20,
          currentPage: 1
        },
        request.query
      );
      return await fastify.account.services.admin.getAllTenantList({
        filter: { name },
        perPage,
        currentPage
      });
    }
  );

  fastify.get(
    `${options.prefix}/admin/getTenantInfo`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        query: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { id } = request.query;
      return await fastify.account.services.tenant.getTenantInfo({ id });
    }
  );

  fastify.post(
    `${options.prefix}/admin/addTenant`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['name', 'accountNumber', 'serviceStartTime', 'serviceEndTime'],
          properties: {
            name: { type: 'string' },
            accountNumber: { type: 'number' },
            serviceStartTime: {
              type: 'string',
              format: 'date-time'
            },
            serviceEndTime: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    async request => {
      await fastify.account.services.admin.addTenant(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/saveTenant`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['id', 'name', 'accountNumber', 'serviceStartTime', 'serviceEndTime'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            accountNumber: { type: 'number' },
            serviceStartTime: {
              type: 'string',
              format: 'date-time'
            },
            serviceEndTime: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      }
    },
    async request => {
      await fastify.account.services.admin.saveTenant(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/tenant/addOrg`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      required: ['name', 'tenantId', 'pid'],
      properties: {
        name: { type: 'string' },
        tenantId: { type: 'string' },
        pid: { type: 'number' }
      }
    },
    async request => {
      return await fastify.account.services.tenant.addTenantOrg(request.body);
    }
  );

  fastify.get(
    `${options.prefix}/admin/tenant/orgList`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        query: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId } = request.query;
      return await fastify.account.services.tenant.getTenantOrgList({ tenantId });
    }
  );

  fastify.post(
    `${options.prefix}/admin/tenant/editOrg`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      required: ['name', 'tenantId', 'pid'],
      properties: {
        name: { type: 'string' },
        tenantId: { type: 'string' },
        pid: { type: 'number' }
      }
    },
    async request => {
      await fastify.account.services.tenant.saveTenantOrg(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/tenant/removeOrg`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      required: ['tenantId', 'id'],
      properties: {
        tenantId: { type: 'string' },
        id: { type: 'number' }
      }
    },
    async request => {
      await fastify.account.services.tenant.deleteTenantOrg(request.body);
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/getTenantUserList`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        query: {
          type: 'object',
          properties: {
            tenantId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId } = request.query;
      return await fastify.account.services.tenant.getTenantUserList({ tenantId });
    }
  );

  fastify.post(
    `${options.prefix}/admin/addTenantUser`,
    {
      schema: {
        body: {
          type: 'object',
          required: ['tenantId', 'userId', 'name'],
          properties: {
            tenantId: { type: 'string' },
            roleIds: { type: 'array', items: { type: 'number' }, default: [] },
            orgIds: {
              type: 'array',
              items: { type: 'number' },
              default: []
            },
            userId: { type: 'string' },
            name: { type: 'string' },
            avatar: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    },
    async request => {
      await fastify.account.services.tenant.addTenantUser(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/saveTenantUser`,
    {
      schema: {
        body: {
          type: 'object',
          required: ['tenantId', 'name'],
          properties: {
            tenantId: { type: 'string' },
            roleIds: { type: 'array', items: { type: 'number' }, default: [] },
            orgIds: {
              type: 'array',
              items: { type: 'number' },
              default: []
            },
            name: { type: 'string' },
            avatar: { type: 'string' },
            phone: { type: 'string' },
            email: { type: 'string' },
            description: { type: 'string' }
          }
        }
      }
    },
    async request => {
      await fastify.account.services.tenant.saveTenantUser(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/deleteTenantUser`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId', 'tenantUserId'],
          properties: {
            tenantId: { type: 'string' },
            tenantUserId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId, tenantUserId } = request.body;
      await fastify.account.services.tenant.deleteTenantUser({ tenantId, tenantUserId });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/closeTenant`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId'],
          properties: {
            tenantId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId } = request.body;
      await fastify.account.services.tenant.closeTenant({ tenantId });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/openTenant`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId'],
          properties: {
            tenantId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId } = request.body;
      await fastify.account.services.tenant.openTenant({ tenantId });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/closeTenantUser`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId', 'tenantUserId'],
          properties: {
            tenantId: { type: 'string' },
            tenantUserId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId, tenantUserId } = request.body;
      await fastify.account.services.tenant.closeTenantUser({ tenantId, tenantUserId });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/openTenantUser`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId', 'tenantUserId'],
          properties: {
            tenantId: { type: 'string' },
            tenantUserId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { tenantId, tenantUserId } = request.body;
      await fastify.account.services.tenant.openTenantUser({ tenantId, tenantUserId });
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/getInviteList`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        query: {
          type: 'object',
          required: ['tenantId'],
          properties: {
            tenantId: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { filter, perPage, currentPage, tenantId } = Object.assign(
        {
          perPage: 20,
          currentPage: 1
        },
        request.query
      );

      return await fastify.account.services.tenant.getInviteList({ filter, perPage, currentPage, tenantId });
    }
  );

  fastify.post(
    `${options.prefix}/admin/addInviteToken`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['tenantId'],
          properties: {
            tenantId: { type: 'string' },
            info: {
              type: 'object',
              properties: {
                roleIds: { type: 'array', items: { type: 'number' }, default: [] },
                orgIds: {
                  type: 'array',
                  items: { type: 'number' },
                  default: []
                }
              }
            }
          }
        }
      }
    },
    async request => {
      const { tenantId, info } = request.body;
      await fastify.account.services.tenant.addInviteToken({ tenantId, info });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/deleteInviteToken`,
    {
      onRequest: [fastify.account.authenticate.user, fastify.account.authenticate.admin],
      schema: {
        body: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'number' }
          }
        }
      }
    },
    async request => {
      await fastify.account.services.tenant.deleteInviteToken({ id: request.body.id });
      return {};
    }
  );
});
