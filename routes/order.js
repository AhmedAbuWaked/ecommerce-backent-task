const express = require("express");
const {
  createCashOrder,
  getAllOrders,
  getOrder,
} = require("../controllers/order");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

router.get("/", getAllOrders);

router.get("/:id", getOrder);

router.post("/:cartId", createCashOrder);

module.exports = router;
