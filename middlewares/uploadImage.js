const multer = require("multer");
const ApiError = require("../utils/apiError");

const multerOptions = () => {
  const multerStorage = multer.memoryStorage();

  const multerFilter = (_req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      return cb(null, true);
    }
    return cb(new ApiError("Only Images Allowed", 400), false);
  };

  const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
  });

  return upload;
};

exports.uploadMixImages = (fields) => multerOptions().fields(fields);
