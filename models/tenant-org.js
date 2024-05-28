module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tenantOrg', {
    id: {
      type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true
    }, tenantId: {
      type: DataTypes.STRING, allowNull: false
    }, name: {
      type: DataTypes.STRING, allowNull: false
    }, enName: {
      type: DataTypes.STRING
    }, pid: {
      type: DataTypes.INTEGER, defaultValue: 0, allowNull: false //0:为根节点
    }, status: {
      type: DataTypes.INTEGER, defaultValue: 0
    }
  }, {
    paranoid: true
  });
};
