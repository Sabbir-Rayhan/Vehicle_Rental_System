import { Router } from "express";
import { BookingController } from "./booking.controller";
import Authenticate from "../../Middleware/Authintication_Middleware";

const router = Router()



router.post('/bookings',Authenticate('admin','customer'),BookingController.makeBooking)

router.get('/bookings',Authenticate('admin','customer'),BookingController.viewBookings)

router.put('/bookings/:bookingId',Authenticate('admin','customer'),BookingController.updateBookings)

export const BookingRouter = router;