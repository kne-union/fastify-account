module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tenantUserShareGroup', {
    tenantId: {
      type: DataTypes.STRING, allowNull: false
    }, tenantUserId: {
      type: DataTypes.STRING, allowNull: false
    }, tenantShareGroupId: {
      type: DataTypes.INTEGER, allowNull: false
    }
  }, {
    paranoid: true
  });
};
