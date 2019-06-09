const models = require("../models");
const { to, ReS, ReE } = require("../helpers/utils");
const bcrypt = require("bcrypt");
const moment = require("moment");
var mqtt = require("mqtt");
var client = mqtt.connect("mqtt://broker.hivemq.com");

client.on("connect", function() {
  console.log("MQTT Connected!");
});

// GET DEVICES
exports.getVehicles = async function(req, res) {
  let userID = req.userID;
  let [err, dbVehicles] = await to(
    models.Vehicle.findAll({
      where: {
        status: "free"
      }
    })
  );

  if (err) {
    console.log(err);
    return ReE(res, err.message);
  }

  return ReS(res, {
    data: dbVehicles
  });
};

exports.getRides = async function(req, res) {
  let userID = req.userID;
  let [err, dbRides] = await to(
    models.Ride.findAll({
      where: {
        UserId: userID
      }
    })
  );

  if (err) {
    console.log(err);
    return ReE(res, err.message);
  }

  return ReS(res, {
    data: dbRides
  });
};

exports.startRide = async function(req, res) {
  let userID = req.userID;
  let vehicleID = req.body.vehicleID;

  let [err, dbVehicle] = await to(
    models.Vehicle.findOne({
      where: {
        id: vehicleID
      }
    })
  );
  if (err) {
    console.log(err);
    return ReE(res, err);
  }

  let [err2, dbRide] = await to(
    models.Ride.create({
      UserId: userID,
      VehicleId: vehicleID,
      status: "busy",
      startLat: dbVehicle.dataValues.lat,
      startLong: dbVehicle.dataValues.long
    })
  );

  if (err2) {
    console.log(err2);
    return ReE(res, err2);
  }

  client.publish("/greens/power", "on");

  return ReS(res, {
    data: dbRide
  });
};

exports.stopRide = async function(req, res) {
  let userID = req.userID;
  let rideID = req.body.rideID;

  let [err, dbRide] = await to(
    models.Ride.findOne({
      where: {
        id: rideID
      }
    })
  );

  if (err) {
    return ReE(res, err);
  }

  var dbStartedTime = moment(
    dbRide.dataValues.started,
    "YYYY-MM-DD HH:MM:SS"
  ).unix();

  var currentTime = moment().unix();

  var timediff = currentTime - dbStartedTime;
  var cost = Math.ceil(timediff / 60) * 20;

  let [err2, dbUpdated] = await to(
    models.Ride.update(
      {
        status: "finished",
        endLat: null,
        endLong: null,
        cost: cost,
        time: timediff,
        finished: models.sequelize.literal("CURRENT_TIMESTAMP")
      },
      {
        where: {
          UserId: userID,
          id: rideID,
          status: "busy"
        }
      }
    )
  );
  if (err2) {
    return ReE(res, err2);
  }

  client.publish("/greens/power", "off");
  return ReS(res, {
    cost: cost,
    time: Math.ceil(timediff / 60)
  });
};
