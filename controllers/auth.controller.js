const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const User = require("../models/user.model.js");
require("dotenv").config({ path: "../.env" });
const JWT_SECRET = process.env.JWT_SECRET;

const response = {
  success: true,
  message: "",
};

// Create new user
const createuser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, email, password } = req.body;
  let user = await User.findOne({ email: email });

  if (user) {
    response.success = false;
    response.message = "Email already exists";
    console.log(response);
    return res
      .status(400)
      .json({ error: "A user with this email already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const securedPassword = await bcrypt.hash(password, salt);

  user = await User.create({
    name: name,
    email: email,
    password: securedPassword,
  })
    .then((result) => {
      if (result) {
        response.success = true;
        response.message = "User added succesfully";
        const data = {
          user: {
            id: result.id,
          },
        };
        const authtoken = jwt.sign(data, JWT_SECRET);
        response.success = true;
        response.message = "User registered successfully";
        console.log(response);
        res.send({ authtoken });
      }
    })
    .catch((error) => {
      response.success = false;
      response.message = "Some error has occured";
      console.log(response);
      res.send(error.message);
    });
};

// Get the user through header authtoken
const getuser = async (req, res) => {
  try {
    const userId = req.user.id;
    // console.log("HEADER CHECK=>", userId);
    await User.findById(userId)
      .select("-password")
      .then((result) => {
        if (result) {
          res.send(result);
          response.success = true;
          response.message = "User found";
          console.log(response);
        } else {
          response.success = false;
          response.message = "No user found";
          console.log(response);
          return res.status(404).send("No such user exist");
        }
      })
      .catch((err) => {
        response.success = false;
        response.message = "Some error occured";
        console.log(response);
        return res.status(500).send(err.message);
      });
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Error occured");
  }
};

// user login
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      response.success = false;
      response.message = "User not found";
      console.log(response);
      return res
        .status(400)
        .json({ error: "Please try to login with correct credentials" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      response.success = false;
      response.message = "Password incorrect";
      console.log(response);
      return res
        .status(400)
        .json({ error: "Please try to login with correct credentials" });
    }
    const data = {
      user: {
        id: user.id,
      },
    };
    const authtoken = jwt.sign(data, JWT_SECRET);
    res.send({ authtoken });
    response.success = true;
    response.message = "Login successfull";
    console.log(response);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Some Internal Server Error occured");
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user;
    if (!userId) {
      response.success = false;
      response.message = "User not logged in!!";
      console.log(response);
      return res.status(400).json({ error: "User has not logged in !!" });
    }
//     console.log("line148")
// jwt.destroy(authtoken);
//     console.log("line150")
    // console.log(isLoggedOut);
    // if (isLoggedOut) {
    //   console.log("Logged out succefully");
    // } else {
    //   console.log("Logout unsuccessful");
    // }
  } catch (err) {
    console.log("line150")
    console.log(err.message);
    res.status(500).send("Some Internal Server Error occured");
  }
};

// update user
const updateuser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const createdBy = req.user.id;
  const userId = req.params.id;
  const { name } = req.body;
  if (createdBy != userId) {
    response.success = false;
    response.message = "User cannot change another user's data";
    console.log(response);
    return res.status(404).send("Action not allowed");
  }
  const updatedUser = {
    name: name,
  };
  await User.findOneAndUpdate(
    { _id: createdBy },
    { $set: updatedUser },
    { new: true }
  )
    .then((result) => {
      if (result) {
        res.status(200).send({
          updatedUser: updatedUser,
          message: "User updated successfully",
        });
        response.success = true;
        response.message = "Product updated succesfully";
        console.log(response);
      } else {
        response.success = false;
        response.message = "No user found";
        console.log(response);
        return res.status(404).send("No such user exist");
      }
    })
    .catch((err) => {
      response.success = false;
      response.message = "Some error occured";
      console.log(response);
      return res.status(500).send(err.message);
    });
};

// delete user
const deleteuser = async (req, res) => {
  const createdBy = req.user.id;
  const userId = req.params.id;
  if (createdBy != userId) {
    response.success = false;
    response.message = "User cannot delete another user's data";
    console.log(response);
    return res.status(404).send("Action not allowed");
  }
  await User.findOneAndDelete({ _id: userId })
    .then((result) => {
      if (result) {
        res.status(200).send({
          deletedUser: result,
          message: "User deleted successfully",
        });
        response.success = true;
        response.message = "User deleted succesfully";
        console.log(response);
      } else {
        response.success = false;
        response.message = "No user found";
        console.log(response);
        return res.status(404).send("No such user exist");
      }
    })
    .catch((err) => {
      response.success = false;
      response.message = "Some error occured";
      console.log(response);
      return res.status(500).send(err.message);
    });
};

module.exports = { createuser, getuser, login, logout, updateuser, deleteuser };
