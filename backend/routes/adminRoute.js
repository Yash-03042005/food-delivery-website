import express from "express"
import { createCoupon, deleteCoupon, getAllCoupons } from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post('/add-coupon',createCoupon);
adminRouter.get('/list-coupons',getAllCoupons)
adminRouter.post('/del-coupon',deleteCoupon)

export default adminRouter;