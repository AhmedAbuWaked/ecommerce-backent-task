const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

const ApiError = require("../utils/apiError");
const { User } = require("../config/db");

// @desc check if user is logged in
exports.protect = asyncHandler(async (req, _res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ApiError("Not authorized to access this route", 401));
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.where("id", "==", decoded.id).get();

  if (currentUser.empty) {
    return next(
      new ApiError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = currentUser.docs[0].data();

  next();
});

// @desc Authorize users based on their role (admin, user, etc)
exports.authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          `${req.user.role} role is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
