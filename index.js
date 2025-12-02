require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const { stream } = require("./utils/logger");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const errorMiddleware = require("./middleware/errorMiddleware");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");



const app = express();

connectDB();
app.use(cors());
app.use(express.json());
app.use(morgan("combined", { stream }));

// Add after routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/services", serviceRoutes);

app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("Hello World! Field Service Management API is running.");
});


// after other app.use(...)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.listen(process.env.PORT || 3000, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

