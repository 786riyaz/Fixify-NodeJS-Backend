// Load Environment Variables
require("dotenv").config();

// Core Modules & Packages
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

// Internal Imports
const connectDB = require("./config/db");
const { stream } = require("./utils/logger");

const logRoutes = require("./routes/logRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

// App Initialization
const app = express();

app.use("/uploads", express.static("public/uploads"));

// Database Connection
connectDB();

// Middlewares
const allowedOrigins = JSON.parse(process.env.Allowed_Origins);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// Logging Middleware
app.use(morgan("combined", { stream }));

// Swagger Docs
const swaggerDocument = YAML.load("./swagger/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/services", serviceRoutes);
app.use("/bookings", bookingRoutes);   // ✔ CORRECT PREFIX (no /api)

// Log Routes
app.use("/logs", logRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Field Service Management API is Running...");
});

// Error Handler
app.use(errorMiddleware);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  // console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Server running...`);
});
