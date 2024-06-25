module.exports = ({ DataTypes }) => {
  return {
    model: {
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      ip: DataTypes.STRING
    }
  };
};
