const fp = require('fastify-plugin');
const dayjs = require('dayjs');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

function generateRandom6DigitNumber() {
  const randomNumber = Math.random() * 1000000;
  return Math.floor(randomNumber).toString().padStart(6, '0');
}

function userNameIsEmail(username) {
  return /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(username);
}

module.exports = fp(async (fastify, options) => {
  const { models, services } = fastify.account;
  const login = async ({ username, password, ip, appName }) => {
    const isEmail = userNameIsEmail(username);
    const user = await models.user.findOne({
      where: Object.assign(
        {},
        isEmail
          ? {
              email: username
            }
          : {
              phone: username
            },
        {
          status: {
            [fastify.sequelize.Sequelize.Op.or]: [0, 1]
          }
        }
      )
    });

    if (!user) {
      throw new Error('用户名或密码错误');
    }

    await passwordAuthentication({ accountId: user.userAccountId, password });

    const application = appName && (await services.application.getApplicationByCode({ code: appName }));

    await models.loginLog.create({
      userId: user.uuid,
      ip,
      currentTenantId: user.currentTenantId,
      applicationId: application?.id
    });

    return {
      token: fastify.jwt.sign({ payload: { id: user.uuid } }),
      user: Object.assign({}, user.get({ plain: true }), { id: user.uuid })
    };
  };

  const resetPassword = async ({ password, userId }) => {
    const userInfo = await services.user.getUserInstance({ id: userId });
    const account = await models.userAccount.create(
      Object.assign({}, await passwordEncryption(password), {
        belongToUserId: userInfo.uuid
      })
    );

    await userInfo.update({ userAccountId: account.uuid });
  };

  const resetPasswordByToken = async ({ password, token }) => {
    const { name } = await verificationJWTCodeValidate({ token });
    const user = await services.user.getUserInstanceByName({ name, status: [0, 1] });
    await resetPassword({ password, userId: user.uuid });
  };

  const modifyPassword = async ({ email, phone, oldPwd, newPwd }) => {
    const user = await services.user.getUserInstanceByName({ name: email || phone, status: 1 });
    if (!user) {
      throw new Error('新用户密码只能初始化一次');
    }
    if (oldPwd === newPwd) {
      throw new Error('重置密码不能和初始化密码相同');
    }
    await passwordAuthentication({ accountId: user.userAccountId, password: oldPwd });
    await resetPassword({ userId: user.uuid, password: newPwd });
    user.status = 0;
    await user.save();
  };

  const passwordAuthentication = async ({ accountId, password }) => {
    const userAccount = await models.userAccount.findOne({
      where: {
        uuid: accountId
      }
    });
    if (!userAccount) {
      throw new Error('账号不存在');
    }
    const generatedHash = await bcrypt.hash(password + userAccount.salt, userAccount.salt);
    if (userAccount.password !== generatedHash) {
      throw new Error('用户名或密码错误');
    }
  };

  const passwordEncryption = async password => {
    const salt = await bcrypt.genSalt(10);
    const combinedString = password + salt;
    const hash = await bcrypt.hash(combinedString, salt);

    return {
      password: hash,
      salt
    };
  };

  const md5 = value => {
    const hash = crypto.createHash('md5');
    hash.update(value);
    return hash.digest('hex');
  };

  const register = async ({ avatar, nickname, gender, birthday, description, phone, email, code, password, status, invitationCode }) => {
    const type = phone ? 0 : 1;
    if (!(await verificationCodeValidate({ name: type === 0 ? phone : email, type: 0, code }))) {
      throw new Error('验证码不正确或者已经过期');
    }

    return await services.user.addUser({
      avatar,
      nickname,
      gender,
      birthday,
      description,
      phone,
      email,
      password,
      status
    });
  };

  const generateVerificationCode = async ({ name, type }) => {
    const code = generateRandom6DigitNumber();
    await models.verificationCode.update(
      {
        status: 2
      },
      {
        where: {
          name,
          type,
          status: 0
        }
      }
    );
    await models.verificationCode.create({
      name,
      type,
      code
    });
    return code;
  };

  const sendVerificationCode = async ({ name, type }) => {
    // messageType: 0:短信验证码，1:邮件验证码 type: 0:注册,2:登录,4:验证租户管理员,5:忘记密码
    const code = await generateVerificationCode({ name, type });
    const isEmail = userNameIsEmail(name);
    // 这里写发送逻辑
    await options.sendMessage({ name, type, messageType: isEmail ? 1 : 0, props: { code } });
    return code;
  };

  const verificationCodeValidate = async ({ name, type, code }) => {
    const verificationCode = await models.verificationCode.findOne({
      where: {
        name,
        type,
        code,
        status: {
          [fastify.sequelize.Sequelize.Op.or]: [0, 1]
        }
      }
    });
    const isPass = !!(verificationCode && dayjs().isBefore(dayjs(verificationCode.createdAt).add(10, 'minute')));

    if (verificationCode) {
      verificationCode.status = isPass ? 1 : 2;
      await verificationCode.save();
    }

    return isPass;
  };

  const sendJWTVerificationCode = async ({ name, type }) => {
    const code = await generateVerificationCode({ name, type });
    const token = fastify.jwt.sign({ name, type, code });
    const isEmail = userNameIsEmail(name);
    // 这里写发送逻辑
    await options.sendMessage({ name, type, messageType: isEmail ? 1 : 0, props: { token } });
    return token;
  };

  const verificationJWTCodeValidate = async ({ token }) => {
    const { iat, name, type, code } = fastify.jwt.decode(token);
    if (!(await verificationCodeValidate({ name, type, code }))) {
      throw new Error('验证码不正确或者已经过期');
    }
    return { name, type, code };
  };

  services.account = {
    md5,
    login,
    modifyPassword,
    register,
    generateVerificationCode,
    sendVerificationCode,
    verificationCodeValidate,
    sendJWTVerificationCode,
    verificationJWTCodeValidate,
    passwordEncryption,
    passwordAuthentication,
    resetPassword,
    resetPasswordByToken
  };
});
