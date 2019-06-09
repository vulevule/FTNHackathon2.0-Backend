const moment = require("moment");
module.exports = (sequelize, DataTypes) => {
  let Model = sequelize.define(
    "Vehicle",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      type: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      status: {
        type: DataTypes.STRING(10),
        allowNull: true
      },
      battery: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      lat: {
        type: DataTypes.FLOAT(),
        allowNull: true
      },
      long: {
        type: DataTypes.FLOAT(),
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

  return Model;
};
