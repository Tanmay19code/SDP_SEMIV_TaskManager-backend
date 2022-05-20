var jwt = require("jsonwebtoken");
require("dotenv").config({ path: "../.env" });
const JWT_SECRET = process.env.JWT_SECRET;

const logoutuser = (req, res, next) => {

  //Get the user from the jwt token and add id to req object
  const token = req.header("authtoken");
  console.log(token)
  if (!token) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
  try {
    // const data = jwt.verify(token, JWT_SECRET);
    // const isLoggedOut = jwt.destroy(token)
    // req.user = data.user;
    next();
  } catch (error) {
    res
      .status(401)
      .send({
        message: "Please authenticate using a valid token",
        error: error.message,
      });
  }
};

module.exports = logoutuser;