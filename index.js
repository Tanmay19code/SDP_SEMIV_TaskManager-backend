const connectToMongoose = require("./database/db");

// const cors = require("cors");
const express = require("express");

connectToMongoose();

const app = express();
const PORT = 5000;

// const corsOptions = {
//   origin: "http://localhost:3000",
// };

// app.use(cors(corsOptions));

app.use(express.json());

// app.use("/api/auth", require("./routes/auth.route.js"));

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
