module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'tenantPermission',
    {
      tenantId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0 //0:开启  11:关闭
      }
    },
    {
      paranoid: true
    }
  );
};
