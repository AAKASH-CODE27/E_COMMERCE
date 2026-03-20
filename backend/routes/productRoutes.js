import express from "express";
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getSingleProduct,
  getAdminProducts,
  productReview,
  getProductReviews,
  deleteProductReviews,
} from "../controller/productController.js";

import { roleBasedAccess, verifyUserAuth } from "../middleware/userAuth.js";
const router = express.Router();
// Authentication at  5.25.00 verifyUserAuth , roleBased

router.route("/products").get(getAllProducts);
router.route("/admin/products").get(verifyUserAuth, roleBasedAccess("admin"),getAdminProducts);
router
  .route("/admin/product/create")
  .post(verifyUserAuth, roleBasedAccess("admin"), createProduct);
// router.route("/product").get(getSingleProduct);

router
  .route("/product/:id")
  .put(verifyUserAuth, roleBasedAccess("admin"), updateProduct)
  .delete(verifyUserAuth, roleBasedAccess("admin"), deleteProduct);

router.route("/product/:id").get(getSingleProduct);
router.route("/review").put(verifyUserAuth,productReview);
router.route("/reviews").get(getProductReviews).delete(verifyUserAuth,deleteProductReviews)
export default router;
