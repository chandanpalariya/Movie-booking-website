import  express from "express"
import cors from "cors"
import  "dotenv/config"
dotenv.config();

import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import movieRouter from "./routes/movieRoutes.js";
import path from "path"
import bookingRouter from "./routes/bookingRouter.js"

const app=express();

const port=5000;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// routes
app.use("/uploads",express.static(path.join(process.cwd(),'uploads')))
app.use("/api/auth",userRouter)
app.use("/api/movies",movieRouter)
app.use("/api/bookings",bookingRouter)





//db
connectDB();


//Routes
app.get("/",(req,res)=>{
    res.send("API WORKING")
})


app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})