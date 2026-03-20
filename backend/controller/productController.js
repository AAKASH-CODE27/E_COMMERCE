import Product from "../models/productModel.js";
import APIFunctionality from "../utils/apiFunctionality.js";
import HandleError from "../utils/handleError.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import { response } from "express";

//CREATING PRODUCT
export const createProduct = handleAsyncError(async (req, res, next) => {
  req.body.user = req.user.id;
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    const message = error.message || "Validation Error";
    return next(new HandleError(message, 400));
  }
});

//GET ALL PRODUCT
export const getAllProducts = handleAsyncError(async (req, res, next) => {
  //return next(new HandleError("No Product Found",404))

  try {
    const resultsPerPage = 5;
    const apiFeatures = new APIFunctionality(Product.find(), req.query)
      .search()
      .filter();

    //Getting filtered query before pagination
    const filteredQuery = apiFeatures.query.clone();
    const productCount = await filteredQuery.countDocuments();

    const totalPages = Math.ceil(productCount / resultsPerPage);
    const page = Number(req.query.page) || 1;

    if (page > totalPages && productCount > 0) {
      return next(new HandleError("This page doesn't exist", 404));
    }

    // Apply Pagination
    apiFeatures.pagination(resultsPerPage);
    const products = await apiFeatures.query;

    if (!products || products.length === 0) {
      return next(new HandleError("No Product Found", 404));
    }

    res.status(200).json({
      success: true,
      products,
      productCount,
      resultsPerPage,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    return next(new HandleError(error.message, 500));
  }
});

// UPDATE PRODUCT
export const updateProduct = handleAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return next(new HandleError("Product Not Found", 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new HandleError(error.message, 400));
  }
});

// DELETING PRODUCT
export const deleteProduct = handleAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return next(new HandleError("Product not found", 404));
    }
    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } catch (error) {
    return next(new HandleError(error.message, 400));
  }
});

// ACCESSING SINGLE PRODUCT
export const getSingleProduct = handleAsyncError(async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    return next(new HandleError(error.message, 400));
  }
});

//ADMIN GET ALL PRODUCT
export const getAdminProducts = handleAsyncError(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

//CREATE AND UPDATE REVIEW 7.40
export const productReview = handleAsyncError(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const reviewsExists = product.reviews.find(
    (review) =>
      review.user && review.user.toString() === req.user._id.toString(),
  );
  if (reviewsExists) {
    product.reviews.forEach((review) => {
      if (review.user && review.user.toString() === req.user._id.toString()) {
        ((review.rating = Number(rating)), (review.comment = comment));
      }
    });
  } else {
    product.reviews.push(review);
  }
  product.numOfReviews = product.reviews.length;
  let sum = 0;

  product.reviews.forEach((review) => (sum += review.rating));
  product.ratings =
    product.reviews.length > 0 ? sum / product.reviews.length : 0;
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    product,
  });
});

// PRODUCT REVIEW - 8.06
export const getProductReviews = handleAsyncError(async (req, res, next) => {
  const id = req.query.id;
  const product = await Product.findById(id);

  if (!product) {
    return next(new HandleError(`Product with ${id} does not Exist`, 400));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//DELETING REVIEWS  8.10
export const deleteProductReviews = handleAsyncError(async (req, res, next) => {
  const { prodId, id } = req.query;
  console.log(req.params);
  const product = await Product.findById(req.query.prodId);

  if (!product) {
    return next(new HandleError(`Product with ${prodId} does not Exist`, 400));
  }
  if (!prodId || !id) {
    return next(new HandleError("Product ID and Review ID required", 400));
  }

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== id.toString(),
  );
  let sum = 0;

  reviews.forEach((review) => (sum += review.rating));
  const rating = reviews.length > 0 ? sum / reviews.length : 0;

  const numOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    prodId,
    {
      reviews,
      rating,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
    },
  );
  res.status(200).json({
    success: true,
    message: `Review Deleted Successfully`,
  });
});
