import couponModel from "../models/couponModel.js";

// ✅ Create a new coupon
 const createCoupon = async (req, res) => {
    try {
        const { code, discount, minAmount} = req.body;

        console.log(code);

        // Check if coupon already exists
        const existingCoupon = await couponModel.findOne({ code });
        if (existingCoupon) {
            return res.status(400).json({ success: false, message: 'Coupon code already exists' });
        }

        const coupon = new couponModel({ code, discount, minAmount });
        await coupon.save();

        res.status(201).json({ success: true, message: 'Coupon Added Successfully', coupon });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};




// ✅ Delete Coupon by ID
 const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedCoupon = await couponModel.findByIdAndDelete(id);

    if (!deletedCoupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" });
    }

    res.status(200).json({ success: true, message: "Coupon deleted successfully" });
  } catch (error) {
    console.error("Error deleting coupon:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export {getAllCoupons, createCoupon ,deleteCoupon}