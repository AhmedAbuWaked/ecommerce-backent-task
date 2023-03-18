const ApiError = require("../utils/apiError");

const sendErrorForDev = (err, res) =>
  res.status(err.statusCode).json({
    error: err,
    status: err.status,
    message: err.message,
    stack: err.stack,
  });

const globalError = (err, _req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // Handle JWT Error
  if (err.name === "JsonWebTokenError") {
    err = next(new ApiError("Invalid Token, please login again", 401));
  }

  // Handle JWT Expired Error
  if (err.name === "TokenExpiredError") {
    err = next(new ApiError("Token Expired, please login again", 401));
  }

  // Development Mode Error
  if (process.env.NODE_ENV === "development") {
    return sendErrorForDev(err, res);
  }

  // Main Production Error Json
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = globalError;
