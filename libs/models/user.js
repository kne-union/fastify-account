module.exports = ({ DataTypes }) => {
  return {
    model: {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
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
    options: {
      indexes: [
        {
          unique: true,
          fields: ['uuid', 'deleted_at']
        },
        {
          unique: true,
          fields: ['email', 'deleted_at']
        },
        {
          unique: true,
          fields: ['phone', 'deleted_at']
        }
      ]
    },
    associate: ({ adminRole, user, tenant, tenantUser }) => {
      user.hasOne(adminRole, { foreignKey: 'userId', sourceKey: 'uuid', constraints: false });
      user.belongsToMany(tenant, {
        through: { model: tenantUser, unique: false },
        otherKey: 'tenantId',
        foreignKey: 'userId',
        targetKey: 'uuid',
        sourceKey: 'uuid',
        constraints: false
      });
    }
  };
};
