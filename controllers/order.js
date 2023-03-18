const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const ApiError = require("../utils/apiError");
const { getAll, getOne } = require("./handlerFactory");

const { Cart, Product, Order } = require("../config/db");

// @desc create cash for orders
// @route POST /api/v1/orders/:cartId
// @access Private
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;

  const cart = await Cart.doc(cartId).get();

  if (!cart.exists) {
    return next(new ApiError("Cart not found", 404));
  }

  const cartData = cart.data();

  const products = await Promise.all(
    cartData.products.map(async (prod) => {
      const product = await Product.doc(prod.id).get();

      return {
        id: product.id,
        title: product.data().title,
        price: product.data().price,
        quantity: prod.quantity,
      };
    })
  );

  const newId = uuidv4();

  const newOrder = {
    id: newId,
    user: req.user.id,
    products,
    amount: req.body.amount,
    status: "Cash on delivery",
  };

  await Order.doc(newId).set(newOrder);

  await Cart.doc(cartId).delete();

  res.status(201).json({
    status: "success",
    data: newOrder,
  });
});

// @desc get all orders
// @route GET /api/v1/orders
// @access Private
exports.getAllOrders = getAll(Order);

// @desc get specific orders
// @route GET /api/v1/orders/:id
// @access Private
exports.getOrder = getOne(Order);
