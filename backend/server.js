import express from "express"
import cors from "cors"
import dotenv from  "dotenv"
import mongoose from "mongoose"
dotenv.config();

import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import movieRouter from "./routes/movieRoutes.js";
import path from "path"
import bookingRouter from "./routes/bookingRouter.js"

const app=express();

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Warn about optional but important environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Warning: STRIPE_SECRET_KEY not set - payment features will not work');
}

const port=process.env.PORT||5000;

//middleware
app.use(cors({
    origin: "*"
}));
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

// Health check endpoint
app.get("/health", (req, res) => {
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    res.status(200).json({
        status: 'ok',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`)
})
