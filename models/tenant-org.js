module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenantOrg', {
    tenantId: {
      type: DataTypes.STRING, allowNull: false
    }, name: {
      type: DataTypes.STRING, allowNull: false
    }, pid: {
      type: DataTypes.INTEGER, allowNull: false
    }, status: {
      type: DataTypes.INTEGER, defaultValue: 0
    }
  });
};
