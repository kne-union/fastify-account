module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'tenantUserOrg',
    {
      tenantId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tenantUserId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      tenantOrgId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      paranoid: true
    }
  );
};
