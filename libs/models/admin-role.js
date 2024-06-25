module.exports = ({ DataTypes }) => {
  return {
    model: {
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false
      },
      target: DataTypes.STRING
    }
  };
};
