module.exports = ({ DataTypes }) => {
  return {
    model: {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      tenantId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phone: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      avatar: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.TEXT
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0 //0:正常,11:已禁用,12:已关闭,
      }
    },
    options: {
      indexes: [
        {
          unique: true,
          fields: ['uuid', 'deleted_at']
        },
        {
          unique: true,
          fields: ['tenant_id', 'user_id', 'deleted_at']
        }
      ]
    },
    associate: ({ user, tenantRole, tenantUser, tenantUserRole, tenantOrg, tenantUserOrg }) => {
      tenantUser.belongsToMany(tenantRole, {
        through: tenantUserRole,
        foreignKey: 'tenantUserId',
        otherKey: 'tenantRoleId',
        sourceKey: 'uuid',
        constraints: false
      });
      tenantUser.belongsToMany(tenantOrg, {
        through: tenantUserOrg,
        foreignKey: 'tenantUserId',
        otherKey: 'tenantOrgId',
        sourceKey: 'uuid',
        constraints: false
      });
      tenantUser.belongsTo(user, {
        targetKey: 'uuid',
        constraints: false
      });
    }
  };
};
