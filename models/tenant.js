module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tenant', {
    id: {
      type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true
    }, name: {
      type: DataTypes.STRING, allowNull: false
    }, accountNumber: {
      type: DataTypes.INTEGER, defaultValue: 0, allowNull: false
    }, serviceStartTime: {
      type: DataTypes.DATE, defaultValue: new Date(), allowNull: false
    }, serviceEndTime: {
      type: DataTypes.DATE, allowNull: false
    }, status: {
      type: DataTypes.INTEGER, defaultValue: 0// 0:正常,10:过期被关闭,11:已禁用,12:已关闭,
    }
  }, {
    paranoid: true
  });
};
