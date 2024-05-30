module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'application',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      avatar: DataTypes.STRING,
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      url: DataTypes.STRING,
      code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: DataTypes.TEXT,
      status: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ['code', 'deletedAt']
        }
      ]
    }
  );
};
