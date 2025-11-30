require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const { logStream } = require("./utils/logger");

// Connect DB
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// --------------------------------------------------
// Setup Morgan for logging
// Show logs in console
app.use(morgan("dev"));

// Morgan logs + API logs → SAME FILE
app.use(morgan("combined", { stream: logStream }));
// --------------------------------------------------

// Routes
app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/serviceRoutes"));

// Root Endpoint for testing
app.get("/", (req, res) => {
  console.log("✓ Server is running");
  res.send("Hello World!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`✓ Server running at http://localhost:${port}`);
});
