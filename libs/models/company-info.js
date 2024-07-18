module.exports = ({ DataTypes }) => {
  return {
    model: {
      tenantId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING
      },
      shortName: {
        type: DataTypes.STRING
      },
      themeColor: {
        type: DataTypes.STRING
      },
      logo: {
        type: DataTypes.STRING
      },
      description: {
        type: DataTypes.TEXT
      }
    }
  };
};
