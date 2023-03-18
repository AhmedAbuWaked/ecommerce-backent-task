const { validationResult } = require("express-validator");

const validator = (req, res, next) => {
  const errors = validationResult(req).formatWith(({ msg, param }) => ({
    message: msg,
    param,
  }));

  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed, data entered is incorrect",
      errors: errors.array(),
    });
  }

  return next();
};

module.exports = validator;
