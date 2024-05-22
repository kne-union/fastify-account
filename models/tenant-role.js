module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tenantRole', {
    tenantId: {
      type: DataTypes.STRING, allowNull: false
    }, name: {
      type: DataTypes.STRING, allowNull: false
    }, status: {
      type: DataTypes.INTEGER, defaultValue: 0
    }
  });
};
