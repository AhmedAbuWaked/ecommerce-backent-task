const express = require("express");

const dotenv = require("dotenv");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cors = require("cors");
const compression = require("compression");

dotenv.config({ path: `${__dirname}/.env` });

const db = require("./config/db");

const routes = require("./routes");
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/error");

// Database Connection

// Express app
const app = express();

// Enable CORS for all requests
app.use(cors());
app.options("*", cors());

// Compress all responses
app.use(compression());

// Middleware
app.use(
  express.json({
    limit: "10kb",
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit Requests From Same IP Address To 100 Per 15 Minutes (100 Requests Per 15 Minutes)
const limiter = rateLimit({
  max: 100,
  windowMs: 15 * 60 * 1000, // 15 Minutes
  message: "Too many requests from this IP, please try again in 15 minutes",
});

app.use("/api", limiter);

// Prevent Parameter Pollution (Duplicate Query Parameters)
app.use(hpp());

// Routes
app.use("/api/v1", routes);

app.all("*", (req, res, next) => {
  next(new ApiError(`Can't find this route: ${req.originalUrl}`, 400));
});

// Global Error Handling Middleware
app.use(globalError);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`App Running on Port ${PORT}`);
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.error(`unhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log(`Shutting down...`);
    process.exit(1);
  });
});
