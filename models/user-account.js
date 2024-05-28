module.exports = (sequelize, DataTypes) => {
  return sequelize.define('userAccount', {
    id: {
      type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true
    }, password: {
      type: DataTypes.STRING, allowNull: false
    }, salt: {
      type: DataTypes.STRING, allowNull: false
    }, belongToUserId: {
      type: DataTypes.UUID //用户修改密码时重新生成一条数据，该字段用于记录这个账号之前是属于哪个账号的
    }
  }, {
    paranoid: true
  });
};
