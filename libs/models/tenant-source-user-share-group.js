module.exports = ({ DataTypes }) => {
  return {
    model: {
      tenantId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      tenantUserId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tenantShareGroupId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }
  };
};
