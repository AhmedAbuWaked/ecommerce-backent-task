const ApiError = require("./apiError");

exports.addCategories = async ({ categories, model, next }) => {
  // Adding Book's Categories
  if (categories && categories.length > 1) {
    categories.split(",").map(async (category) => {
      try {
        await model.addCategory(+category);
      } catch (error) {
        return next(new ApiError(error.message, 400));
      }
    });
  } else if (categories && categories.length === 1) {
    await model.setCategories(categories);
  }
};

exports.addInsights = async ({ insights, model, next }) => {
  // Adding User Insights
  if (insights && insights.length > 1) {
    insights.split(",").map(async (category) => {
      try {
        await model.addInsight(+category);
      } catch (error) {
        return next(new ApiError(error.message, 400));
      }
    });
  } else if (insights && insights.length === 1) {
    await model.setInsights(insights);
  }
};

exports.removeInsight = async ({ insights, model, next }) => {
  // Removing User Insights
  if (insights && insights.length > 1) {
    insights.split(",").map(async (category) => {
      try {
        await model.removeInsight(+category);
      } catch (error) {
        return next(new ApiError(error.message, 400));
      }
    });
  } else if (insights && insights.length === 1) {
    await model.removeInsight(insights);
  }
};
