import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import Reservation from "../models/reservationModel.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import HandleError from "../utils/handleError.js";

// CREATE NEW ORDER 
export const createNewOrder = handleAsyncError(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Create the Order
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt: Date.now(),
    user: req.user.id,
  });

  // Deduct stock permanently and mark reservations as completed
  await Promise.all(
    orderItems.map(async (item) => {
      // Deduct stock
      const product = await Product.findById(item.product);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
        await product.save({ validateBeforeSave: false });
      }

      // Mark the user's pending reservation as completed
      await Reservation.findOneAndUpdate(
        { user: req.user.id, productId: item.product, status: "pending" },
        { status: "completed" },
        { new: true }
      );
    })
  );

  res.status(200).json({
    success: true,
    order,
  });
});

// GETTING SINGLE ORDER 
export const getSingleOrder = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!order) {
    return next(new HandleError("No Order Found", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// GETTING ALL ORDER OF A USER 
export const getAllOrderByUser = handleAsyncError(async (req, res, next) => {
  const order = await Order.find({ user: req.user.id });
  if (!order) {
    return next(new HandleError("No Order Found", 404));
  }
  res.status(200).json({
    success: true,
    order,
  });
});

// GETTING ALL ORDER
export const getAllOrder = handleAsyncError(async (req, res, next) => {
  const order = await Order.find();
  if (!order) {
    return next(new HandleError("No Order Found", 404));
  }
  let amount = 0;
  order.forEach((order) => {
    amount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    order,
    amount,
  });
});

//UPDATE ORDER STATUS 
export const updateOrder = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new HandleError("No Order Found", 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(new HandleError("Order Already Delivered", 404));
  }

  // If order is updated to Cancelled, return stock back to inventory
  if (req.body.status === "Cancelled" && order.orderStatus !== "Cancelled") {
    await Promise.all(
      order.orderItems.map(async (item) => {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save({ validateBeforeSave: false });
        }
      })
    );
  }

  order.orderStatus = req.body.status;

  if (order.orderStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    order,
  });
});

// DELETE A ORDER 
export const deleteOrder = handleAsyncError(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new HandleError("No order found", 404));
  }

  if (order.orderStatus !== "Delivered") {
    return next(new HandleError("Order is still yet Delivered", 404));
  }
  await Order.deleteOne({ _id: req.params.id });
  res.status(200).json({
    success: true,
    message: "Order Deleted successfully",
  });
});