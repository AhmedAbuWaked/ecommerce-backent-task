const { User } = require("../config/db");

const {
  deleteOne,
  updateOne,
  getOne,
  getAll,
  createOne,
} = require("./handlerFactory");

// @desc Create User
// @route POST /api/v1/users
// @access Private
exports.createUser = createOne({ Model: User });

// @desc Get All Users
// @route GET /api/v1/users
// @access Private
exports.getAllUsers = getAll({
  Model: User,
});

// @desc Get Single User
// @route GET /api/v1/users/:id
// @access Private
exports.getSingleUser = getOne({ Model: User });

// @desc Update User
// @route PUT /api/v1/users/:id
// @access Private
exports.updateUser = updateOne({
  Model: User,
});

// @desc Delete User
// @route DELETE /api/v1/users/:id
// @access Private
exports.deleteUser = deleteOne({ Model: User });
