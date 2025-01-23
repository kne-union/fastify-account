module.exports = ({ DataTypes }) => {
  return {
    model: {
      tenantId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      permissionId: {
        type: DataTypes.INTEGER,
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
          name:'tenant_permission_key',
          unique: true,
          fields: ['tenant_id', 'permission_id', 'deleted_at']
        }
      ]
    }
  };
};
