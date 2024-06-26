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
    options: {
      indexes: [
        {
          unique: true,
          fields: ['code', 'deleted_at']
        },
        {
          unique: true,
          fields: ['uuid', 'deleted_at']
        }
      ]
    }
  };
};
