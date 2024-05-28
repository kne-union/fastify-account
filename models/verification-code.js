module.exports = (sequelize, DataTypes) => {
  return sequelize.define('verificationCode', {
    name: {
      type: DataTypes.STRING, allowNull: false
    }, type: {
      type: DataTypes.INTEGER, allowNull: false //0:手机注册,1:邮箱注册,2:手机登录,3:邮箱登录,4:验证租户管理员
    }, code: {
      type: DataTypes.STRING, allowNull: false
    }, status: {
      type: DataTypes.INTEGER, defaultValue: 0//0:未验证,1:已验证,2:已过期
    }
  }, {
    paranoid: true
  });
};
