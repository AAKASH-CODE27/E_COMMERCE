import express from "express";
import {
  createNewOrder,
  getAllOrder,
  getAllOrderByUser,
  getSingleOrder,
  updateOrder,
  deleteOrder
} from "../controller/orderController.js";
import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";

// import router from "./userRoutes.js";

const router = express.Router();
router.route("/new/order").post(verifyUserAuth, createNewOrder);
router
  .route("/admin/order/:id")
  .get(verifyUserAuth, roleBasedAccess("admin"), getSingleOrder)
  .put(verifyUserAuth, roleBasedAccess("admin"), updateOrder)
  .delete(verifyUserAuth, roleBasedAccess("admin"), deleteOrder);
router.route("/orders/user").get(verifyUserAuth, getAllOrderByUser);
router
  .route("/admin/orders")
  .get(verifyUserAuth, roleBasedAccess("admin"), getAllOrder);
export default router;
