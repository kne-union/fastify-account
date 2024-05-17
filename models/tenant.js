module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Tenant', {
    id: {
      type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true
    }, name: {
      type: DataTypes.STRING, allowNull: false
    }, logo: DataTypes.STRING, status: {
      type: DataTypes.INTEGER, defaultValue: 0
    }, deadline: {
      type: DataTypes.DATE
    }
  });
};
