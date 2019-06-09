let express = require("express");
let router = express.Router();
const authController = require("../controllers/authController");

router.post("/user/login", authController.loginUser);

router.post("/user/register", authController.registerUser);

module.exports = router;
