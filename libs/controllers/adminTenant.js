const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { authenticate, services } = fastify.account;
  fastify.get(
    `${options.prefix}/admin/getAllTenantList`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      return await services.tenant.getAllTenantList({
        filter: { name },
        perPage,
        currentPage
      });
    }
  );

  fastify.get(
    `${options.prefix}/admin/getTenantInfo`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      return await services.tenant.getTenant({ id });
    }
  );

  fastify.post(
    `${options.prefix}/admin/addTenant`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.tenant.addTenant(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/saveTenant`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.tenant.saveTenant(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/tenant/addOrg`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      required: ['name', 'tenantId', 'pid'],
      properties: {
        name: { type: 'string' },
        tenantId: { type: 'string' },
        pid: { type: 'number' }
      }
    },
    async request => {
      return await services.tenantOrg.addTenantOrg(request.body);
    }
  );

  fastify.get(
    `${options.prefix}/admin/tenant/orgList`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      return await services.tenantOrg.getTenantOrgList({ tenantId });
    }
  );

  fastify.post(
    `${options.prefix}/admin/tenant/editOrg`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      required: ['name', 'tenantId', 'pid'],
      properties: {
        name: { type: 'string' },
        tenantId: { type: 'string' },
        pid: { type: 'number' }
      }
    },
    async request => {
      await services.tenantOrg.saveTenantOrg(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/tenant/removeOrg`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      required: ['tenantId', 'id'],
      properties: {
        tenantId: { type: 'string' },
        id: { type: 'number' }
      }
    },
    async request => {
      await services.tenantOrg.deleteTenantOrg(request.body);
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/getTenantUserList`,
    {
      onRequest: [authenticate.user, authenticate.admin],
      schema: {
        query: {
          type: 'object',
          properties: {
            tenantId: { type: 'string' },
            filter: {
              type: 'object',
              properties: {
                name: { type: 'string' }
              }
            },
            currentPage: { type: 'number' },
            perPage: { type: 'number' }
          }
        }
      }
    },
    async request => {
      const { filter, tenantId, currentPage, perPage } = Object.assign(
        {},
        {
          filter: {},
          currentPage: 1,
          perPage: 20
        },
        request.query
      );
      return await services.tenantUser.getTenantUserList({ tenantId, filter, currentPage, perPage });
    }
  );

  fastify.post(
    `${options.prefix}/admin/addTenantUser`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.tenantUser.addTenantUser(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/saveTenantUser`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.tenantUser.saveTenantUser(request.body);
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/deleteTenantUser`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.tenantUser.deleteTenantUser({ tenantId, tenantUserId });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/closeTenant`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.tenant.closeTenant({ tenantId });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/openTenant`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.tenant.openTenant({ tenantId });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/closeTenantUser`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.tenantUser.closeTenantUser({ tenantId, tenantUserId });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/openTenantUser`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.tenantUser.openTenantUser({ tenantId, tenantUserId });
      return {};
    }
  );

  fastify.get(
    `${options.prefix}/admin/getInviteList`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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

      return await services.tenantInvite.getInviteList({ filter, perPage, currentPage, tenantId });
    }
  );

  fastify.post(
    `${options.prefix}/admin/addInviteToken`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.tenantInvite.addInviteToken({ tenantId, info });
      return {};
    }
  );

  fastify.post(
    `${options.prefix}/admin/deleteInviteToken`,
    {
      onRequest: [authenticate.user, authenticate.admin],
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
      await services.tenantInvite.deleteInviteToken({ id: request.body.id });
      return {};
    }
  );
});
