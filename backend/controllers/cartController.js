import couponModel from "../models/couponModel.js";
import userModel from "../models/userModel.js"

//add items to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;

        // Find user by ID
        const userData = await userModel.findById(userId);

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Initialize cartData if it doesn't exist
        let cartData = userData.cartData;

        // Update item quantity
        if (!cartData[itemId]) {
            cartData[itemId] = 1;
        } else {
            cartData[itemId] += 1;
        }

        // Update user document in MongoDB
        await userModel.findByIdAndUpdate(userId, {cartData});

        res.status(200).json({ success: true, message: "Added To Cart" });
    } catch (err) {
        console.error("Error adding to cart:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



//remove items to user cart
const removeFromCart = async (req,res)=>{

    try{
        
        const { userId, itemId } = req.body;

        let userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData =  userData.cartData;

        if(cartData[itemId]>0){
            cartData[itemId]-=1;
        }

        if (cartData[itemId] === 1) {
            delete cartData[itemId];  // Remove item if quantity is 1
        }
        

        await userModel.findByIdAndUpdate(userId,{cartData})
        res.status(200).json({success:true,message:"Removed from Cart"})

    }catch(err)
    {
        console.error("Error removing from cart:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
    
}


//fetchUser  user cart data
const getCart = async (req,res)=>{
    
    try{
        const { userId } = req.body;

        let userData = await userModel.findById(userId)

        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        let cartData =  userData.cartData;

        res.status(200).json({success:true,cartData})

    }catch(err)
    {
        console.error("Error fetching cart data:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const getAllCoupons = async (req, res) => {

  try {

    const {userId} = req.body;

    console.log(userId)

    const userData = await userModel.findById(userId) // no need to fetch full user

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const coupons = await couponModel.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, coupons });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export {addToCart,removeFromCart,getCart, getAllCoupons}