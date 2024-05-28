module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tenantUser', {
    id: {
      type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true
    }, userId: {
      type: DataTypes.UUID, allowNull: false
    }, tenantId: {
      type: DataTypes.UUID, allowNull: false
    }, name: {
      type: DataTypes.STRING, allowNull: false
    }, phone: {
      type: DataTypes.STRING
    }, email: {
      type: DataTypes.STRING
    }, avatar: {
      type: DataTypes.STRING
    }, description: {
      type: DataTypes.TEXT
    }, status: {
      type: DataTypes.INTEGER, defaultValue: 0
    }
  }, {
    paranoid: true
  });
};
