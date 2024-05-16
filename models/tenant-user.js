module.exports = (sequelize, DataTypes) => {
  return sequelize.define('TenantUser', {
    id: {
      type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true
    }
  });
};
