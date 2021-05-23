'use strict';
const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
    }
  };
  User.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: {
          args: [2, 100],
          msg: "fullName's length must be between 2 - 100"
        }
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isEmail:true,
      unique:true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5, 50],
          msg: "password's length must be between 5 50"
        }

      }
    },
  }, {
    sequelize,
    modelName: 'User',



  });
  User.beforeCreate(async (user) => {
    user.password = await bcrypt.hashSync(user.password, 10);
  });
  return User;
};