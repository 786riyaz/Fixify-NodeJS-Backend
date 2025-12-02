//  Load Environment Variables
require("dotenv").config();

//  Core Modules & Packages
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

//  Internal Imports
const connectDB = require("./config/db");
const { stream } = require("./utils/logger");
const logRoutes = require("./routes/logRoutes");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");

const errorMiddleware = require("./middleware/errorMiddleware");

//  App Initialization
const app = express();
// app.use("/public", express.static("public"));
app.use("/uploads", express.static("public/uploads"));


//  Database Connection
connectDB();

//  Middlewares
const allowedOrigins = [
  "http://localhost:5000",
  "https://pfx9d576-5000.inc1.devtunnels.ms",
];
// app.use(cors({ origin: "*" }));
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

// Logging Middleware (Morgan)
app.use(morgan("combined", { stream }));

//  Swagger API Documentation
const swaggerDocument = YAML.load("./swagger/swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//  Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/services", serviceRoutes);

// Log Routes
app.use("/logs", logRoutes);

// Default Route
app.get("/", (req, res) => {
  res.send("Field Service Management API is Running...");
});

//  Error Handler (should be last route)
app.use(errorMiddleware);

//  Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✓ Server running at http://localhost:${PORT}`);
});
