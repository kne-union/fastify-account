module.exports = ({ DataTypes }) => {
  return {
    model: {
      userId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      tenantId: {
        type: DataTypes.UUID
      },
      type: {
        type: DataTypes.STRING,
        comment: 'user,tenant,admin'
      },
      applicationId: {
        type: DataTypes.UUID
      },
      action: {
        type: DataTypes.TEXT
      },
      summary: {
        type: DataTypes.TEXT
      }
    },
    options: {
      indexes: [
        {
          fields: ['user_id', 'type']
        },
        {
          fields: ['tenant_id', 'type']
        },
        {
          fields: ['action', 'type']
        }
      ]
    },
    associate: ({ requestLog, application, user }) => {
      requestLog.belongsTo(application, { targetKey: 'uuid', constraints: false });
      requestLog.belongsTo(user, { targetKey: 'uuid', constraints: false });
    }
  };
};
