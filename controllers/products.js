const { v4: uuidv4 } = require("uuid");
const sharp = require("sharp");

const { Product, uploadImage } = require("../config/db");

const { uploadMixImages } = require("../middlewares/uploadImage");
const {
  deleteOne,
  updateOne,
  getOne,
  getAll,
  createOne,
} = require("./handlerFactory");

exports.uploadImages = uploadMixImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  {
    name: "images",
    maxCount: 5,
  },
]);

exports.uploadImagesToFirebase = async (req, res, next) => {
  // Image Cover Processing
  if (req.files.imageCover) {
    const imageCover = await uploadImage({
      file: req.files.imageCover[0],
      path: "products",
    });

    req.body.imageCover = imageCover;
  }

  // Product Images Processing
  if (req.files.images) {
    const images = await Promise.all(
      req.files.images.map(async (image) => {
        const newImage = await uploadImage({
          file: image,
          path: "products",
        });

        return newImage;
      })
    );

    req.body.images = images;
  }

  next();
};

// @desc Create Product
// @route POST /api/v1/products
// @access Private
exports.createProduct = createOne({ Model: Product });

// @desc Get All Products
// @route GET /api/v1/products
// @access Public
exports.getAllProducts = getAll({
  Model: Product,
});

// @desc Get Single Product
// @route GET /api/v1/products/:id
// @access Public
exports.getSingleProduct = getOne({ Model: Product });

// @desc Update Product
// @route PUT /api/v1/products/:id
// @access Private
exports.updateProduct = updateOne({
  Model: Product,
});

// @desc Delete Product
// @route DELETE /api/v1/products/:id
// @access Private
exports.deleteProduct = deleteOne({ Model: Product });
