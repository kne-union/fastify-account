module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'tenantToken',
    {
      tenantId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      info: DataTypes.JSON,
      type: {
        type: DataTypes.INTEGER,
        allowNull: false //10:邀请用户加入租户
      },
      createTenantUserId: {
        type: DataTypes.UUID
      }
    },
    {
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['tenantId', 'token', 'type', 'deletedAt']
        }
      ]
    }
  );
};
