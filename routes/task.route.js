const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const {
  createtask,
  getmytask,
  getmyalltasks,
  getmyalltaskswithdate,
  getmyalltaskswithdateandstatus,
  updatemytask,
  deletemytask
} = require("../controllers/task.controller");

const fetchuser = require("../middlewares/fetchuser.middleware.js");

//Route 1: Create an task using : POST "/api/task/createtask" . Require authentication
router.post(
  "/createtask",
  [body("title", "Enter valid name").isLength({ min: 3 })],
  fetchuser,
  createtask
);

//Route 2: Get an task using : POST "/api/task/getmytask/6252f6fb7ab38ffa04289a85" . Require authentication
router.post("/getmytask/:id", fetchuser, getmytask);

//Route 3: Get an task using : POST "/api/task/getmyalltasks" . Require authentication
router.post("/getmyalltasks/", fetchuser, getmyalltasks);

//Route 4: Get an task using : POST "/api/task/getmyalltaskswithdate" . Require authentication
router.post("/getmyalltaskswithdate/", fetchuser, getmyalltaskswithdate);

//Route 5: Get an task using : POST "/api/task/getmyalltaskswithdateandstatus" . Require authentication
router.post(
  "/getmyalltaskswithdateandstatus/",
  fetchuser,
  getmyalltaskswithdateandstatus
);

//Route 6: Get an task using : POST "/api/task/updatemytask/6252f6fb7ab38ffa04289a85" . Require authentication
router.put("/updatemytask/:id", fetchuser, updatemytask);
  
//Route 7: Get an task using : POST "/api/task/deletemytask/6252f6fb7ab38ffa04289a85" . Require authentication
router.post("/deletemytask/:id", fetchuser, deletemytask);

module.exports = router;
