const express = require("express");

const {
  createProduct,
  deleteProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  uploadImages,
  uploadImagesToFirebase,
} = require("../controllers/products");

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(uploadImages, uploadImagesToFirebase, createProduct);

router
  .route("/:id")
  .get(getSingleProduct)
  .put(uploadImages, uploadImagesToFirebase, updateProduct)
  .delete(deleteProduct);

module.exports = router;
