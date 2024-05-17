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
    const user = await fastify.models.User.findOne({
      where: Object.assign({}, isEmail ? {
        email: username
      } : {
        phone: username
      }, {
        status: {
          [fastify.models.Sequelize.Op.or]: [0, 1]
        }
      })
    });

    if (!user) {
      throw new Error('用户名或密码错误');
    }
    const userAccount = await fastify.models.UserAccount.findByPk(user.userAccountId);
    const generatedHash = await bcrypt.hash(password + userAccount.salt, userAccount.salt);
    if (userAccount.password !== generatedHash) {
      throw new Error('用户名或密码错误');
    }

    await fastify.models.LoginLog.create({
      userId: user.id, ip
    });

    return fastify.jwt.sign({ payload: { id: user.id } });
  };

  const register = async ({
                            avatar,
                            nickname,
                            gender,
                            birthday,
                            description,
                            phone,
                            email,
                            code,
                            password,
                            status,
                            invitationCode
                          }) => {
    const type = phone ? 0 : 1;
    const verificationCode = await fastify.models.VerificationCode.findOne({
      where: {
        name: type === 0 ? phone : email, type, code, status: 1
      }
    });
    if (!verificationCode) {
      throw new Error('验证码不正确或者已经过期');
    }

    verificationCode.status = 2;
    await verificationCode.save();

    if (await accountIsExists({ username: type === 0 ? phone : email }) > 0) {
      throw new Error('用户已经存在不能重复注册');
    }

    const salt = await bcrypt.genSalt(10);
    const combinedString = password + salt;
    const hash = await bcrypt.hash(combinedString, salt);


    const account = await fastify.models.UserAccount.create({ password: hash, salt });
    const user = await fastify.models.User.create({
      avatar, nickname, gender, birthday, description, phone, email, status, userAccountId: account.id
    });

    return user;
  };

  const accountIsExists = async ({ username }) => {
    const isEmail = userNameIsEmail(username);
    return await fastify.models.User.count({
      where: isEmail ? {
        email: username
      } : {
        phone: username
      }
    }) > 0;
  };

  const sendEmailCode = async ({ email }) => {
    const code = generateRandom6DigitNumber();

    // 这里写发送逻辑

    await fastify.models.VerificationCode.update({
      status: 2
    }, {
      where: {
        name: email, type: 1, status: 0
      }
    });

    await fastify.models.VerificationCode.create({
      name: email, type: 1, code
    });

    return code;
  };

  const verificationCodeValidate = async ({ name, type, code }) => {
    const verificationCode = await fastify.models.VerificationCode.findOne({
      where: {
        name, type, code, status: {
          [fastify.models.Sequelize.Op.or]: [0, 1]
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

    await fastify.models.VerificationCode.update({
      status: 2
    }, {
      where: {
        name: phone, type: 0, status: 0
      }
    });

    await fastify.models.VerificationCode.create({
      name: phone, type: 0, code
    });

    return code;
  };


  fastify.decorate('AccountService', {
    login, register, sendEmailCode, sendSMSCode, verificationCodeValidate, accountIsExists
  });
});
