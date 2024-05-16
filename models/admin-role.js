module.exports = (sequelize, DataTypes) => {
  return sequelize.define('AdminRole', {
    userId: {
      type: DataTypes.UUID, allowNull: false
    }, role: {
      type: DataTypes.STRING, allowNull: false
    }, target: DataTypes.STRING
  });
};
