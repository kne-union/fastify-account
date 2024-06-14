module.exports = (sequelize, DataTypes) => {
  const tenantUser = sequelize.define(
    'tenantUser',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
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
    {
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['tenantId', 'userId', 'deletedAt']
        }
      ]
    }
  );

  tenantUser.associate = ({ user, tenantRole, tenantUser, tenantUserRole, tenantOrg, tenantUserOrg }) => {
    tenantUser.belongsToMany(tenantRole, { through: tenantUserRole });
    tenantUser.belongsToMany(tenantOrg, { through: tenantUserOrg });
    tenantUser.belongsTo(user);
  };
  return tenantUser;
};
