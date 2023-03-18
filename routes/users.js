const express = require("express");

const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getSingleUser,
} = require("../controllers/user");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

router.route("/").get(getAllUsers).post(createUser);

router.route("/:id").get(getSingleUser).put(updateUser).delete(deleteUser);

module.exports = router;
