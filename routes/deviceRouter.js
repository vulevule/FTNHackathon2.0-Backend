let express = require('express');
let router = express.Router();
const deviceController = require('../controllers/deviceController');
const userMiddleware = require('../middlewares/userMiddleware').auth;

router.use(userMiddleware)

// POST LOCATION
router.post("/location", deviceController.setNewLocation);

module.exports = router;
