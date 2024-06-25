module.exports = ({ DataTypes }) => {
  return {
    model: {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      tenantId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      tenantUserId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      tenantRoleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }
  };
};
