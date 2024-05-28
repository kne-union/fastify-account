module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tenantPermission', {
    tenantId: {
      type: DataTypes.STRING, allowNull: false
    }, code: {
      type: DataTypes.STRING, allowNull: false
    }, name: {
      type: DataTypes.STRING, allowNull: false
    }, role: {
      type: DataTypes.INTEGER, allowNull: false
    }, status: {
      type: DataTypes.INTEGER, defaultValue: 0
    }
  }, {
    paranoid: true
  });
};
