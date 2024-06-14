module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'loginLog',
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      ip: DataTypes.STRING
    },
    {
      paranoid: true
    }
  );
};
