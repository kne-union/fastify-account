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
      enName: {
        type: DataTypes.STRING
      },
      pid: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false //0:为根节点
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    }
  };
};
