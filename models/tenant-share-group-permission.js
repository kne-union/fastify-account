module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tenantShareGroup', {
    tenantId: {
      type: DataTypes.STRING, allowNull: false
    }, tenantShareGroupId: {
      type: DataTypes.INTEGER, allowNull: false
    }, tenantPermissionId: {
      type: DataTypes.INTEGER, allowNull: false
    }
  });
};
