const bcrypt = require("bcrypt");
const { to } = require("../helpers/utils");
module.exports = (sequelize, DataTypes) => {
  let Model = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING(150),
        allowNull: true
      },
      password: {
        type: DataTypes.STRING(256),
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      cardNum: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      cvc: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      created: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("NOW")
      }
    },
    {
      timestamps: false
    }
  );

  Model.associate = function(models) {
    Model.hasMany(models.Ride);
  };

  Model.beforeSave(async (user, options) => {
    let err;
    if (user.changed("password")) {
      let hash;

      [err, hash] = await to(bcrypt.hash(user.password, 10));
      if (err) TE(err.message, true);
      user.password = hash;
    }
  });

  return Model;
};
