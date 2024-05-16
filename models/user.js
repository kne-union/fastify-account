module.exports = (sequelize, DataTypes) => {
  return sequelize.define('User', {
    id: {
      type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true
    },
    nickname: DataTypes.STRING,
    email: DataTypes.STRING,
    phoneCode: DataTypes.STRING,
    phone: DataTypes.STRING,
    userAccountId: {
      type: DataTypes.UUID, allowNull: false
    },
    currentTenantId: {
      type: DataTypes.UUID
    },
    avatar: DataTypes.STRING,
    gender: DataTypes.STRING,//F:女,M男
    birthday: DataTypes.DATE,
    description: DataTypes.TEXT
  });
};
