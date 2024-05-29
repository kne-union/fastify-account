module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      nickname: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      userAccountId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0 //0:正常,10:初始化未激活，需要用户设置密码后使用,11:已禁用,12:已关闭,
      },
      currentTenantId: {
        type: DataTypes.UUID
      },
      avatar: DataTypes.STRING,
      gender: DataTypes.STRING, //F:女,M男
      birthday: DataTypes.DATE,
      description: DataTypes.TEXT
    },
    {
      paranoid: true
    }
  );

  user.associate = ({ adminRole, user, tenant, tenantUser }) => {
    user.hasOne(adminRole, { foreignKey: 'userId' });
    user.belongsToMany(tenant, { through: tenantUser, foreignKey: 'userId', otherKey: 'tenantId' });
  };

  return user;
};
