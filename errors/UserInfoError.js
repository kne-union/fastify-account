class UserInfoError extends Error {
  statusCode = 401;

  constructor(message) {
    super(message || '用户不存在或登录失效');
  }
}

module.exports = UserInfoError;
