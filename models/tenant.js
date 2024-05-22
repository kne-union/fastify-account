module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tenant', {
    id: {
      type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true
    }, name: {
      type: DataTypes.STRING, allowNull: false
    }, accountNumber: {
      type: DataTypes.INTEGER, defaultValue: 0, allowNull: false
    }, serviceStartTime: {
      type: DataTypes.DATE, defaultValue: new Date(), allowNull: false
    }, serviceEndTime: {
      type: DataTypes.DATE, allowNull: false
    }
  });
};
