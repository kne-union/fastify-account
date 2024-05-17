module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenantUserShareGroup', {
    tenantId: {
      type: DataTypes.STRING, allowNull: false
    }, tenantUserId: {
      type: DataTypes.STRING, allowNull: false
    }, tenantShareGroupId: {
      type: DataTypes.INTEGER, allowNull: false
    }
  });
};
