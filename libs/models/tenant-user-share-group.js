module.exports = ({ DataTypes }) => {
  return {
    model: {
      tenantId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      tenantUserId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      tenantShareGroupId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }
  };
};
