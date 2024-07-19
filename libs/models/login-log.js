module.exports = ({ DataTypes }) => {
  return {
    model: {
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      ip: DataTypes.STRING,
      currentTenantId: {
        type: DataTypes.UUID
      },
      applicationId: {
        type: DataTypes.UUID
      }
    }
  };
};
