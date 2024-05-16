module.exports = (sequelize, DataTypes) => {
  return sequelize.define('VerificationCode', {
    name: {
      type: DataTypes.STRING, allowNull: false
    }, type: {
      type: DataTypes.INTEGER, allowNull: false //0:手机,1:邮箱
    }, code: {
      type: DataTypes.STRING, allowNull: false
    }, status: {
      type: DataTypes.INTEGER, defaultValue: 0//0:未验证,1:已验证,2:已过期
    }
  });
};
