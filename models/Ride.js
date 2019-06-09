const bcrypt = require("bcrypt");
const { to } = require("../helpers/utils");
module.exports = (sequelize, DataTypes) => {
  let Model = sequelize.define(
    "Ride",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      status: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      distance: {
        type: DataTypes.FLOAT(),
        allowNull: true
      },
      startLat: {
        type: DataTypes.FLOAT(),
        allowNull: false
      },
      startLong: {
        type: DataTypes.FLOAT(),
        allowNull: true
      },
      endLat: {
        type: DataTypes.FLOAT(),
        allowNull: true
      },
      endLong: {
        type: DataTypes.FLOAT(),
        allowNull: true
      },
      started: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("NOW")
      },
      finished: {
        type: DataTypes.DATE,
        allowNull: true
      },
      cost: {
        type: DataTypes.FLOAT(),
        allowNull: true
      }
    },
    {
      timestamps: false
    }
  );

  Model.associate = function(models) {
    Model.belongsTo(models.User);
  };
  Model.associate = function(models) {
    Model.belongsTo(models.Vehicle);
  };

  return Model;
};
