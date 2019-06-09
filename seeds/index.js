const { sequelize, User, Vehicle } = require("../models");

const Promise = require("bluebird");
const users = require("./users.json");
const vehicles = require("./vehicles.json");

sequelize
  .query("SET FOREIGN_KEY_CHECKS = 0", {
    raw: true
  })
  .then(function(results) {
    sequelize
      .sync({
        force: true
      })
      .then(async function() {
        await Promise.all(
          users.map(async e => {
            await User.create(e);
          })
        );
        await Promise.all(
          vehicles.map(async e => {
            await Vehicle.create(e);
          })
        );
      })
      .then(async function() {
        console.log("Seed successfully finished!");
      });
  });
