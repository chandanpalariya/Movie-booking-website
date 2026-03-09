import express from "express"
import authMiddleware from "../middleware/auth.js"
import { confirmPayment, createBooking, deleteBooking, getBooking, getOccupiedSeats, listBooking } from "../controlers/bookingController.js";

const bookingRouter=express.Router();
bookingRouter.post("/",authMiddleware,createBooking)
bookingRouter.get("/confirm-payment",confirmPayment)
bookingRouter.get("/",listBooking)
bookingRouter.get("/occupied",getOccupiedSeats)

bookingRouter.get("/my",authMiddleware,getBooking)
bookingRouter.delete("/:id",deleteBooking);

export default bookingRouter


