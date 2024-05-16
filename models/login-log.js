module.exports = (sequelize, DataTypes) => {
  return sequelize.define('LoginLog', {
    userId: {
      type: DataTypes.UUID, allowNull: false
    }, ip: DataTypes.STRING
  });
};
