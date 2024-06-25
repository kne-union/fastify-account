module.exports = ({ DataTypes }) => {
  return {
    model: {
      tenantId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      type: {
        type: DataTypes.INTEGER,
        defaultValue: 0 //0:用户自定义,1:系统默认
      },
      description: DataTypes.TEXT
    }
  };
};
