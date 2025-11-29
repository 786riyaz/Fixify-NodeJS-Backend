require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const morgan = require("morgan");
const connectDB = require("./config/db");

// Connect DB
connectDB();

const app = express();
app.use(express.json());

// ---------------- MORGAN LOGGING ----------------

// Create logs folder if not exists
const logsPath = path.join(__dirname, "logs");
if (!fs.existsSync(logsPath)) {
  fs.mkdirSync(logsPath);
}

// Create write stream for access.log
const accessLogStream = fs.createWriteStream(
  path.join(logsPath, "access.log"),
  { flags: "a" }
);

// Morgan formats:
// "dev"  → quick colored logs in console
// "combined" → Apache-style logs saved into file

// Show logs in console
app.use(morgan("dev"));

// Save logs to access.log file
app.use(morgan("combined", { stream: accessLogStream }));

// --------------------------------------------------

// Routes
app.use("/", require("./routes/userRoutes"));
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/serviceRoutes"));

// Root
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`✓ Server running at http://localhost:${port}`);
});
