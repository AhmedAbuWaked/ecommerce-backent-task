const express = require("express");
const {
  addToCart,
  getCart,
  clearCart,
  updateCartItem,
  deleteCartItem,
} = require("../controllers/cart");
const { protect } = require("../middlewares/auth");

const router = express.Router();

router.use(protect);

router.route("/").get(getCart).post(addToCart).delete(clearCart);

router.route("/:id").put(updateCartItem).delete(deleteCartItem);

module.exports = router;
