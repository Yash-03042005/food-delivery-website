import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const placeOrder = async (req, res) => {
  const frontend_url = process.env.VITE_FRONTEND_URL;

  try {
    const { userId, items, amount, address, discount,appliedCoupon } = req.body;

    if (!userId || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // ✅ Calculate final total after discount
    const finalAmount = amount;
    if (finalAmount < 0) finalAmount = 0;

    // ✅ Save order in DB
    const newOrder = new orderModel({
      userId,
      items,
      amount: finalAmount,
      discount,
      appliedCoupon,
      address
    });
    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // ✅ Single line item for Stripe
    const line_items = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Order Total"
          },
          unit_amount: finalAmount * 100, // Stripe expects paise
        },
        quantity: 1,
      }
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.status(200).json({ success: true, session_url: session.url });

  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




const verifyOrder = async (req,res)=>{

    const {orderId,success} = req.body;
    try{

        if(success=="true"){

            await orderModel.findByIdAndUpdate(orderId,{payment:true})
            res.status(200).json({ success: true, message: "Payment successful" });

        }
        else{

            await orderModel.findByIdAndDelete(orderId);
            res.status(200).json({ success: false, message: "Payment failed, order deleted" });
        }
    }catch(error){

        console.error("Error verifying order:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });

    }

}

//user orders for frontend
const userOrders = async (req,res)=>{

    try{
        const {userId} = req.body;

        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const orders = await orderModel.find({userId})

        res.status(200).json({ success: true, data: orders });
    }
    catch(err)
    {
        console.error("Error fetching user orders:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}

//listing orders for admin panel

const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find();

        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


//api for updateing order status

const updateStatus = async (req,res)=>{

    try{
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({ success: false, message: "Order ID and status are required" });
        }

        const orderExists = await orderModel.findById(orderId);
        if (!orderExists) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        await orderModel.findByIdAndUpdate(orderId,{status})

        res.status(200).json({success:true,message:"Status Updated"})

    }catch(err){

        console.error("Error updating status:", err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }

}

export {placeOrder ,verifyOrder,userOrders,listOrders,updateStatus}
