let express = require("express");
let router = express.Router();
const userController = require("../controllers/userController");
const userMiddleware = require("../middlewares/userMiddleware").auth;

router.use(userMiddleware);

// get vehicles
router.get("/vehicles", userController.getVehicles);

router.get("/rides", userController.getRides);

router.post("/ride/start", userController.startRide);

router.post("/ride/stop", userController.stopRide);

module.exports = router;
