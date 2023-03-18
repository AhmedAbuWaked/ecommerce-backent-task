const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const ApiError = require("../utils/apiError");

exports.deleteOne = ({ Model }) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.doc(req.params.id).get();

    if (!document.exists) {
      return next(
        new ApiError(`No Document Found in this id: ${req.params.id}`, 404)
      );
    }

    await Model.doc(req.params.id).delete();

    res.status(204).send();
  });

exports.updateOne = ({ Model }) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.doc(req.params.id).get();

    if (!document.exists) {
      return next(
        new ApiError(`No Document Found in this id: ${req.params.id}`, 404)
      );
    }

    await Model.doc(req.params.id).update(req.body);

    res.status(200).json({
      status: "success",
      data: {
        ...req.body,
        id: req.params.id,
      },
    });
  });

exports.createOne = ({ Model }) =>
  asyncHandler(async (req, res) => {
    const newId = uuidv4();

    const newDocument = {
      ...req.body,
      id: newId,
    };

    console.log(
      "🚀 ~ file: handlerFactory.js:47 ~ asyncHandler ~ newDocument:",
      newDocument
    );

    await Model.doc(newId).set(newDocument);

    res.status(201).json({
      status: "success",
      data: newDocument,
    });
  });

exports.getOne = ({ Model }) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.doc(req.params.id).get();

    if (!document.exists) {
      return next(
        new ApiError(`No Document Found in this id: ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      data: document.data(),
    });
  });

exports.getAll = ({ Model }) =>
  asyncHandler(async (_req, res) => {
    const documents = await Model.get();

    res.status(200).json({
      status: "success",
      data: documents.docs.map((doc) => doc.data()),
    });
  });
