import express from "express";
import { reserveStock, releaseStock } from "../controller/reservationController.js";
import { verifyUserAuth } from "../middleware/userAuth.js";

const router = express.Router();

router.route("/reserve-stock").post(verifyUserAuth, reserveStock);
router.route("/release-stock").post(verifyUserAuth, releaseStock);

export default router;
