const models = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { to, ReS, ReE } = require("../helpers/utils");

// REGISTER USER
exports.registerUser = async function(req, res) {
  let email = req.body.email;
  let password = req.body.password;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let address = req.body.address;
  let city = req.body.city;
  let phone = req.body.phone;
  let website = req.body.webiste;
};

// LOGIN USER
exports.loginUser = async function(req, res) {
  let email = req.body.email;
  let password = req.body.password;

  if (!email || !password) return ReE(res, "Invalid Params!");

  let [err, dbUser] = await to(
    models.User.findOne({
      where: {
        email: email
      }
    })
  );

  if (err) return ReE(res, err.message);

  if (dbUser == null) return ReE(res, "Wrong email or password!!");
  let result;
  [err, result] = await to(bcrypt.compare(password, dbUser.password));

  if (err) return ReE(res, err.message);

  if (result) {
    let token = jwt.sign(
      {
        id: dbUser.id
      },
      process.env.USER_SECRET
    );
    return ReS(res, {
      msg: "You have been successfully logged in",
      token: token
    });
  } else return ReE(res, "Wrong email or password!!!");
};
