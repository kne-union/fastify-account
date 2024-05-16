module.exports = (sequelize, DataTypes) => {
  return sequelize.define('UserAccount', {
    id: {
      type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true
    }, password: {
      type: DataTypes.STRING, allowNull: false
    }, salt: {
      type: DataTypes.STRING, allowNull: false
    }
  });
};
