const { body, validationResult } = require("express-validator");
const Task = require("../models/task.model.js");

const response = {
  success: true,
  message: "",
};

const createtask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, description, deadline } = req.body;
  const createdBy = req.user.id;
  const dateStr = Date.now();
  if (createdBy) {
    Task.create({
      title: title,
      createdBy: createdBy,
      description: description ? description : "",
      deadline: deadline ? deadline : null,
    })
      .then((result) => {
        // To be written
        if (result) {
          response.success = true;
          response.message = "Task added succesfully";
          console.log(response);
          return res.status(200).send({ task: result, response: response });
        } else {
          response.success = false;
          response.message = "Task not added";
          console.log(response);
          return res.status(500).send("Some error occured");
        }
      })
      .catch((err) => {
        console.log(err.message);
        res.status(500).send("Some Internal Server Error occured");
      });
  } else {
    response.success = false;
    response.message = "Please login first";
    console.log(response);
    return res.status(401).send("No Authentication found");
  }
};

const getmytask = async (req, res) => {
  const userId = req.user.id;
  const taskId = req.params.id;
  await Task.findOne({ _id: taskId })
    // .populate("createdBy")
    // if populate is used, uncomment the if statement
    .then(async (result) => {
      if (result) {
        //To be used if populate is used
        // if (result.createdBy._id != userId) {
        if (result.createdBy != userId) {
          response.success = false;
          response.message = "User not allowed to access anyone else's task";
          console.log(response);
          return res.status(404).send("Action not allowed");
        }

        response.success = true;
        response.message = "Task found";
        console.log(response);
        return res.status(200).send(result);
      } else {
        response.success = false;
        response.message = "No task found";
        console.log(response);
        return res.status(404).send("No such task exist");
      }
    })
    .catch((err) => {
      response.success = false;
      response.message = "Some error occured";
      console.log(response);
      return res.status(500).send(err.message);
    });
};

const getmyalltasks = async (req, res) => {
  const userId = req.user.id;
  await Task.find({ createdBy: userId })
    .then((result) => {
      if (result) {
        response.success = true;
        response.message = "Tasks found successfully";
        console.log(response);
        return res.status(200).send({
          noOfTasksFound: result.length,
          tasks: result,
        });
      } else {
        response.success = false;
        response.message = "No task found";
        console.log(response);
        return res.status(404).send("No tasks found");
      }
    })
    .catch((err) => {
      response.success = false;
      response.message = "Some error occured";
      console.log(response);
      return res.status(500).send(err.message);
    });
};

const getmyalltaskswithdate = async (req, res) => {
  const userId = req.user.id;
  const { date } = req.body;
  let dateStr;
  if (!date) {
    response.success = false;
    response.message = "No date provided";
    console.log(response);
    return res.status(404).send("No date provided");
  }
  await Task.find({ createdBy: userId })
    .then((result) => {
      if (result) {
        const filteredResult = result.filter((item) => {
          dateStr = JSON.stringify(item.createdAt).slice(1, 11);
          if (dateStr == date) {
            return item;
          }
        });
        if (filteredResult) {
          response.success = true;
          response.message = "Tasks found successfully";
          console.log(response);
          return res.status(200).send({
            noOfTasksFound: filteredResult.length,
            tasks: filteredResult,
          });
        } else {
          response.success = false;
          response.message = "No task found";
          console.log(response);
          return res.status(404).send("No tasks found");
        }
      } else {
        response.success = false;
        response.message = "No task found";
        console.log(response);
        return res.status(404).send("No tasks found");
      }
    })
    .catch((err) => {
      response.success = false;
      response.message = "Some error occured";
      console.log(response);
      return res.status(500).send(err.message);
    });
};

const getmyalltaskswithdateandstatus = async (req, res) => {
  const userId = req.user.id;
  const { date, isCompleted } = req.body;
  let dateStr;
  if (!date) {
    response.success = false;
    response.message = "No date provided";
    console.log(response);
    return res.status(404).send("No date provided");
  }
  if (isCompleted == null) {
    response.success = false;
    response.message = "No status provided";
    console.log(response);
    return res.status(404).send("No status provided");
  }
  await Task.find({ createdBy: userId, isCompleted: isCompleted })
    .then((result) => {
      if (result) {
        const filteredResult = result.filter((item) => {
          dateStr = JSON.stringify(item.createdAt).slice(1, 11);
          if (dateStr == date) {
            return item;
          }
        });
        if (filteredResult) {
          response.success = true;
          response.message = "Tasks found successfully";
          console.log(response);
          return res.status(200).send({
            noOfTasksFound: filteredResult.length,
            tasks: filteredResult,
          });
        } else {
          response.success = false;
          response.message = "No task found";
          console.log(response);
          return res.status(404).send("No tasks found");
        }
      } else {
        response.success = false;
        response.message = "No task found";
        console.log(response);
        return res.status(404).send("No tasks found");
      }
    })
    .catch((err) => {
      response.success = false;
      response.message = "Some error occured";
      console.log(response);
      return res.status(500).send(err.message);
    });
};

const updatemytask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const createdBy = req.user.id;
  const taskId = req.params.id;
  const { title, description, isCompleted } = req.body;
  await Task.findById(taskId).then(async (element) => {
    if (element) {
      if (element.createdBy != createdBy) {
        response.success = false;
        response.message = "User cannot change another user's data";
        console.log(response);
        return res.status(404).send("Action not allowed");
      }
      const updatedTask = {
        title: title,
        description: description,
        isCompleted: isCompleted,
      };
      await Task.findOneAndUpdate(
        { _id: taskId },
        { $set: updatedTask },
        { new: true }
      )
        .then((result) => {
          if (result) {
            res.status(200).send({
              updatedTask: updatedTask,
              message: "Task updated successfully",
            });
            response.success = true;
            response.message = "Task updated succesfully";
            console.log(response);
          } else {
            response.success = false;
            response.message = "No task updated";
            console.log(response);
            return res.status(404).send("No task updated");
          }
        })
        .catch((err) => {
          response.success = false;
          response.message = "Some error occured";
          console.log(response);
          return res.status(500).send(err.message);
        });
    } else {
      response.success = false;
      response.message = "No task found";
      console.log(response);
      return res.status(404).send("No such task exist");
    }
  });
};

const deletemytask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const createdBy = req.user.id;
  const taskId = req.params.id;
  await Task.findById(taskId).then(async (element) => {
    if (element) {
      if (element.createdBy != createdBy) {
        response.success = false;
        response.message = "User cannot delete another user's data";
        console.log(response);
        return res.status(404).send("Action not allowed");
      }
      await Task.findOneAndDelete({ _id: taskId })
        .then((result) => {
          if (result) {
            res.status(200).send({
              deletedTask: result,
              message: "Task deleted successfully",
            });
            response.success = true;
            response.message = "Task deleted succesfully";
            console.log(response);
          } else {
            response.success = false;
            response.message = "No task found";
            console.log(response);
            return res.status(404).send("No such task exist");
          }
        })
        .catch((err) => {
          response.success = false;
          response.message = "Some error occured";
          console.log(response);
          return res.status(500).send(err.message);
        });
    }
    else {
      response.success = false;
      response.message = "No task found";
      console.log(response);
      return res.status(404).send("No such task exist");
    }
  });
};

module.exports = {
  createtask,
  getmytask,
  getmyalltasks,
  getmyalltaskswithdate,
  getmyalltaskswithdateandstatus,
  updatemytask,
  deletemytask,
};
