module.exports = ({ DataTypes }) => {
  return {
    model: {
      tenantId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false
      },
      info: DataTypes.JSON,
      type: {
        type: DataTypes.INTEGER,
        allowNull: false //10:邀请用户加入租户
      },
      createdTenantUserId: {
        type: DataTypes.UUID
      }
    },
    options: {
      indexes: [
        {
          name:'tenant_token_key',
          unique: true,
          fields: ['tenant_id', 'token', 'type', 'deleted_at']
        }
      ]
    }
  };
};
