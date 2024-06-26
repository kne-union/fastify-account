module.exports = ({ DataTypes }) => {
  return {
    model: {
      tenantId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      applicationId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0 //0:开启  11:关闭
      }
    },
    options: {
      indexes: [
        {
          unique: true,
          fields: ['tenant_id', 'application_id', 'deleted_at']
        }
      ]
    }
  };
};
