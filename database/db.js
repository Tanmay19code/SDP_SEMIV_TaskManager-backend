const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

// const mongoURI = process.env.CONNECTION_STRING;
const mongoURI = "mongodb+srv://tanmay:tanmay@cluster0.48guw.mongodb.net/test";

const connectToMongoose = () => {
  mongoose.connect(mongoURI, () => {
    console.log("Connected to MongoDB successfully");
  });
};

module.exports = connectToMongoose;