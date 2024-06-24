module.exports = (sequelize, DataTypes) => {
  const tenantRolePermission = sequelize.define(
    'tenantRolePermission',
    {
      tenantId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      permissionId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0 //0:开启  11:关闭
      }
    },
    {
      paranoid: true,
      indexes: [
        {
          name: 'permission_key',
          unique: true,
          fields: ['tenantId', 'permissionId', 'roleId', 'deletedAt']
        }
      ]
    }
  );

  tenantRolePermission.associate = ({ tenantRolePermission, permission }) => {
    tenantRolePermission.belongsTo(permission);
  };

  return tenantRolePermission;
};
