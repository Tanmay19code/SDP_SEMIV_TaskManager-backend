const connectToMongoose = require("./database/db");
const morgan = require("morgan");
require("dotenv").config({ path: "./.env" });



const cors = require("cors");
const express = require("express");

connectToMongoose();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  // origin: `http://localhost:${PORT}`,
  origin: `https://my-task-manager-web-app.netlify.app/`,
};

app.use(cors(corsOptions));

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use(express.json());

app.use("/", express.Router().get("/", (req, res) => {
  res
    .status(200)
    .send("This is the Backend Server of Task Manager made by Tanmay Mutalik");}
));
app.use("/api/auth", require("./routes/auth.route.js"));
app.use("/api/task", require("./routes/task.route.js"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
