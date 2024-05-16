module.exports = (sequelize, DataTypes) => {
  return sequelize.define('UserTenantRelation', {
    userId: {
      type: DataTypes.UUID, allowNull: false
    }, tenantId: {
      type: DataTypes.UUID, allowNull: false
    }
  });
};
