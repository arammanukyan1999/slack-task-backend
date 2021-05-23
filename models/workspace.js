'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class workspace extends Model {
    static associate(models) {
    }
  };
  workspace.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: {
          args: [2, 100],
          msg: "the length must be between 2 100"
        }
      },
    },

    subDomain: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      len: {
        args: [2, 100],
        msg: "the length must be between 2 100"
      }

    }
  }, {
    sequelize,
    modelName: 'workspace',
  });

  workspace.associate = models => {
    workspace.belongsTo(models.User, {
      foreignKey: 'Created_by',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    workspace.belongsToMany(models.User, {
      as: 'userId',
      through: 'workspace_user',
      foreignKey: 'workspaceId',
      onDelete: 'CASCADE'
    })
  }
  return workspace;
};

