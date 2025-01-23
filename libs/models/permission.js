module.exports = ({ DataTypes }) => {
  return {
    model: {
      applicationId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      isModule: {
        type: DataTypes.INTEGER,
        defaultValue: 0 //0:操作项，1:模块
      },
      isMust: {
        type: DataTypes.INTEGER,
        defaultValue: 0 //0:非必须，1:必须
      },
      type: {
        type: DataTypes.INTEGER,
        defaultValue: 0 //0:基础模块,1:扩展模块
      },
      pid: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      paths: {
        type: DataTypes.JSON,
        defaultValue: []
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
          name:'code_key',
          unique: true,
          fields: ['code', 'application_id', 'pid', 'deleted_at']
        }
      ]
    }
  };
};
