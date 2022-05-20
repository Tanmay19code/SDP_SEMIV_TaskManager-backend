const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  createuser,
  login,
  logout,
  getuser,
  updateuser,
  deleteuser,
} = require("../controllers/auth.controller");
const fetchuser = require("../middlewares/fetchuser.middleware.js");
const logoutuser = require("../middlewares/logoutuser.middleware.js");

//Route 1: Create an user using : POST "/api/auth/createuser" . Doesn't require authentication
router.post(
  "/createuser",
  [
    body("name", "Enter valid name").isLength({ min: 3 }),
    body("email", "Enter valid email").isEmail(),
    body("password", "Password must be atleast of 5 characters").isLength({
      min: 5,
    }),
  ],
  createuser
);

//Route 2: User login using : POST "/api/auth/login" . Doesn't require authentication
router.post(
  "/login",
  [
    body("email", "Enter valid email").isEmail(),
    body("password", "Password must be atleast of 5 characters").exists(),
  ],
  login
);

//Route 3: Get logged in user details : POST "/api/auth/getuser" . login required
router.post("/getuser", fetchuser, getuser);

//Route 4: Update user: PUT "/api/auth/getuser" . login required
router.put(
  "/updateuser/:id",
  [
    body("name", "Enter valid name").isLength({ min: 3 }),
  ],
  fetchuser,
  updateuser
);

//Route 5: Delete user: DELETE "/api/auth/getuser" . login required
router.delete("/deleteuser/:id", fetchuser, deleteuser);

//Route 6: Logout user: POST "api/auth/logout". Login required
router.post("/logout", logoutuser, logout);

module.exports = router;