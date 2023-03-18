const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

const ApiError = require("../utils/apiError");
const createToken = require("../utils/createToken");
const { User } = require("../config/db");

// @desc Login User
// @route POST /api/v1/auth/login
// @access Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError("Please provide email and password", 400));
  }

  const user = await User.where("email", "==", email).get();

  if (user.empty) {
    return next(new ApiError("Invalid Email Or Password", 401));
  }

  const userData = user.docs[0].data();

  const isMatch = await bcrypt.compare(password, userData.password);

  if (!isMatch) {
    return next(new ApiError("Invalid Email Or Password", 401));
  }

  const token = createToken({
    id: userData.id,
    role: userData.role || "user",
  });

  // Delete password from output
  delete userData.password;

  res.status(200).json({
    status: "success",
    data: {
      ...userData,
      token,
    },
  });
});

// @desc Register User
// @route POST /api/v1/auth/register
// @access Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ApiError("Please provide name, email and password", 400));
  }

  const user = await User.where("email", "==", email).get();

  if (!user.empty) {
    return next(new ApiError("User already exists", 400));
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newId = uuidv4();

  const newUser = {
    name,
    email,
    password: hashedPassword,
    id: newId,
  };

  await User.doc(newId).set(newUser);

  const token = createToken({
    id: newUser.id,
    role: newUser.role || "user",
  });

  // Delete password from output
  delete newUser.password;

  res.status(201).json({
    status: "success",
    data: {
      ...newUser,
      token,
    },
  });
});
