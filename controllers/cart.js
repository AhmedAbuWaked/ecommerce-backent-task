const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const ApiError = require("../utils/apiError");
const { Cart, Product } = require("../config/db");

// @desc Add product to Cart
// @route POST /api/v1/cart
// @access Private
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  const product = await Product.doc(productId).get();

  if (!product.exists) {
    return next(new ApiError("Product not found", 404));
  }

  const cart = await Cart.where("user", "==", req.user.id).get();

  if (cart.empty) {
    const newId = uuidv4();

    const newCart = {
      id: newId,
      user: req.user.id,
      products: [
        {
          id: product.id,
          quantity: 1,
        },
      ],
    };

    await Cart.doc(newId).set(newCart);

    return res.status(201).json({
      status: "success",
      data: newCart,
    });
  }

  const cartData = cart.docs[0].data();

  const productIndex = cartData.products.findIndex(
    (prod) => prod.id === productId
  );

  if (productIndex === -1) {
    cartData.products.push({
      id: product.id,
      quantity: 1,
    });
  } else {
    cartData.products[productIndex].quantity += 1;
  }

  await Cart.doc(cart.docs[0].id).update({
    products: cartData.products,
  });

  res.status(200).json({
    status: "success",
    data: cartData,
  });
});

// @desc Get Logged In User Cart
// @route GET /api/v1/cart
// @access Private
exports.getCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.where("user", "==", req.user.id).get();

  if (cart.empty) {
    res.status(200).json({
      status: "success",
      data: [],
    });
  }

  const cartData = cart.docs[0].data();

  const products = await Promise.all(
    cartData.products.map(async (prod) => {
      const product = await Product.doc(prod.id).get();

      return {
        id: product.id,
        title: product.data().title,
        price: product.data().price,
        imageCover: product.data().imageCover,
        quantity: prod.quantity,
        description: product.data().description,
      };
    })
  );

  cartData.products = products;

  res.status(200).json({
    status: "success",
    data: cartData,
  });
});

// @desc Delete Specific Cart Item
// @route DELETE /api/v1/cart/:id
// @access Private
exports.deleteCartItem = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const cart = await Cart.where("user", "==", req.user.id).get();

  if (cart.empty) {
    return next(new ApiError("Cart is empty", 404));
  }

  const cartData = cart.docs[0].data();

  const productIndex = cartData.products.findIndex((prod) => prod.id === id);

  if (productIndex === -1) {
    return next(new ApiError("Product not found", 404));
  }

  cartData.products.splice(productIndex, 1);

  await Cart.doc(cart.docs[0].id).update({
    products: cartData.products,
  });

  res.status(200).json({
    status: "success",
    data: cartData,
  });
});

// @desc Update Cart Item Quantity
// @route PUT /api/v1/cart/:id
// @access Private
exports.updateCartItem = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.where("user", "==", req.user.id).get();

  if (cart.empty) {
    return next(new ApiError("Cart is empty", 404));
  }

  const cartData = cart.docs[0].data();

  const productIndex = cartData.products.findIndex((prod) => prod.id === id);

  if (productIndex === -1) {
    return next(new ApiError("Product not found", 404));
  }

  cartData.products[productIndex].quantity = quantity;

  await Cart.doc(cart.docs[0].id).update({
    products: cartData.products,
  });

  res.status(200).json({
    status: "success",
    data: cartData,
  });
});

// @desc Clear Cart
// @route DELETE /api/v1/cart
// @access Private
exports.clearCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.where("user", "==", req.user.id).get();

  if (cart.empty) {
    return next(new ApiError("Cart is empty", 404));
  }

  await Cart.doc(cart.docs[0].id).delete();

  res.status(200).json({
    status: "success",
    data: null,
  });
});
