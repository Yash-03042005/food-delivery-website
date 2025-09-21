import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import cookieParser from "cookie-parser"
import adminRouter from "./routes/adminRoute.js"


// app config
const app= express()
const port =process.env.PORT || 4002;


//middleware
app.use(express.json()) 
app.use(cors({
    origin: ["http://localhost:5173","http://localhost:5174","https://food-del-frontend-ooso.onrender.com","https://food-del-admin-xdc4.onrender.com"], // ✅ Set frontend origin
    credentials: true // ✅ Allow credentials (cookies)
}));
app.use(cookieParser());

//db connection
connectDB();


//api endpoints
app.use("/api/food",foodRouter)
app.use("/images",express.static('uploads'))
app.use("/api/user",userRouter)
app.use("/api/cart",cartRouter)
app.use("/api/order",orderRouter)
app.use('/api/admin',adminRouter)



app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})


