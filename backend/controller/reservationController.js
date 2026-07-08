import Reservation from "../models/reservationModel.js";
import Product from "../models/productModel.js";
import handleAsyncError from "../middleware/handleAsyncError.js";
import HandleError from "../utils/handleError.js";

// Helper to get available stock of a product (subtracting other users' active reservations)
export const getAvailableStockForUser = async (productId, userId) => {
  const product = await Product.findById(productId);
  if (!product) return 0;

  // Find all active, pending reservations by OTHER users
  const activeReservations = await Reservation.find({
    productId,
    user: { $ne: userId },
    status: "pending",
    expiresAt: { $gt: new Date() },
  });

  const totalReserved = activeReservations.reduce((sum, res) => sum + res.quantity, 0);
  return Math.max(0, product.stock - totalReserved);
};

// RESERVE STOCK FOR CHECKOUT
// POST /api/v1/reserve-stock
// Body: { items: [ { product: "productId", quantity: 2 } ] }
export const reserveStock = handleAsyncError(async (req, res, next) => {
  const { items } = req.body;
  const userId = req.user.id;

  if (!items || items.length === 0) {
    return next(new HandleError("No items provided for reservation", 400));
  }

  // 1. Verify availability for all items first
  for (const item of items) {
    const available = await getAvailableStockForUser(item.product, userId);
    if (available < item.quantity) {
      const product = await Product.findById(item.product);
      const name = product ? product.name : "Product";
      return next(
        new HandleError(
          `Insufficient stock for "${name}". Only ${available} available (some units are temporarily reserved by other customers checking out).`,
          400
        )
      );
    }
  }

  // 2. Delete any existing pending reservations for this user (clearing previous checkout locks)
  await Reservation.deleteMany({ user: userId, status: "pending" });

  // 3. Create new reservations
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Lock for 10 minutes
  const reservations = [];

  for (const item of items) {
    const reservation = await Reservation.create({
      user: userId,
      productId: item.product,
      quantity: item.quantity,
      expiresAt,
      status: "pending",
    });
    reservations.push(reservation);
  }

  res.status(200).json({
    success: true,
    message: "Stock successfully blocked for 10 minutes.",
    expiresAt,
  });
});

// RELEASE RESERVATIONS MANUALLY (Optional/Fallback)
// POST /api/v1/release-stock
export const releaseStock = handleAsyncError(async (req, res, next) => {
  const userId = req.user.id;

  await Reservation.deleteMany({ user: userId, status: "pending" });

  res.status(200).json({
    success: true,
    message: "Stock reservation released successfully.",
  });
});
