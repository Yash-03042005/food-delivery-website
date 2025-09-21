import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, trim: true },
    discount: { type: Number, required: true },
    minAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});


const couponModel = mongoose.models.coupon || mongoose.model("coupon", couponSchema);

export default couponModel;
