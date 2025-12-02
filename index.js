require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

const { logger, stream } = require("./utils/logger");

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

// Morgan → Winston log file
app.use(morgan("combined", { stream }));

// Morgan → Console (dev mode)
app.use(morgan("dev"));

// Routes
app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/serviceRoutes"));

app.get("/", (req, res) => {
  logger.info("Root API requested");
  res.send("Hello World! Fixify Server is running.");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  // logger.info(`Server running at http://localhost:${port}`);
  // console.log(`✓ Server running at http://localhost:${port}`);
  console.log("Server is running...")
  logger.info("Server is running...");
});
