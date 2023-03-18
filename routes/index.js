const express = require("express");

const router = express.Router();

router.use("/auth", require("./auth"));
router.use("/users", require("./users"));
router.use("/products", require("./products"));
router.use("/cart", require("./cart"));
router.use("/orders", require("./order"));

module.exports = router;
