const fp = require('fastify-plugin');
const dayjs = require('dayjs');
const bcrypt = require('bcryptjs');

function generateRandom6DigitNumber() {
  const randomNumber = Math.random() * 1000000;
  return Math.floor(randomNumber).toString().padStart(6, '0');
}

function userNameIsEmail(username) {
  return /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(username);
}

module.exports = fp(async (fastify, options) => {
  const login = async ({ username, password, ip }) => {
    const isEmail = userNameIsEmail(username);
    const user = await fastify.account.models.user.findOne({
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

    await fastify.account.models.loginLog.create({
      userId: user.id,
      ip
    });

    return fastify.jwt.sign({ payload: { id: user.id } });
  };

  const passwordAuthentication = async ({ accountId, password }) => {
    const userAccount = await fastify.account.models.userAccount.findByPk(accountId);
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

  const resetPassword = async ({ userId, password }) => {
    const userInfo = await fastify.account.models.user.findByPk(userId);
    if (!userInfo) {
      throw new Error('用户不存在');
    }
    const account = await fastify.account.models.userAccount.create(
      Object.assign({}, await passwordEncryption(password), {
        belongToUserId: userId
      })
    );

    await userInfo.update({ userAccountId: account.id });
  };

  const register = async ({ avatar, nickname, gender, birthday, description, phone, email, code, password, status, invitationCode }) => {
    const type = phone ? 0 : 1;
    const verificationCode = await fastify.account.models.verificationCode.findOne({
      where: {
        name: type === 0 ? phone : email,
        type,
        code,
        status: 1
      }
    });
    if (!verificationCode) {
      throw new Error('验证码不正确或者已经过期');
    }

    verificationCode.status = 2;
    await verificationCode.save();

    return await fastify.account.services.user.addUser({
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

  const sendEmailCode = async ({ email }) => {
    const code = generateRandom6DigitNumber();

    // 这里写发送逻辑

    await fastify.account.models.verificationCode.update(
      {
        status: 2
      },
      {
        where: {
          name: email,
          type: 1,
          status: 0
        }
      }
    );

    await fastify.account.models.verificationCode.create({
      name: email,
      type: 1,
      code
    });

    return code;
  };

  const verificationCodeValidate = async ({ name, type, code }) => {
    const verificationCode = await fastify.account.models.verificationCode.findOne({
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

  const sendSMSCode = async ({ phone }) => {
    const code = generateRandom6DigitNumber();

    // 这里写发送逻辑

    await fastify.account.models.verificationCode.update(
      {
        status: 2
      },
      {
        where: {
          name: phone,
          type: 0,
          status: 0
        }
      }
    );

    await fastify.account.models.verificationCode.create({
      name: phone,
      type: 0,
      code
    });

    return code;
  };

  fastify.account.services.account = {
    login,
    register,
    sendEmailCode,
    sendSMSCode,
    verificationCodeValidate,
    passwordEncryption,
    passwordAuthentication,
    resetPassword
  };
});
