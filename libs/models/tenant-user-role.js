module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'tenantUserRole',
    {
      tenantId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tenantUserId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tenantRoleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      paranoid: true
    }
  );
};
