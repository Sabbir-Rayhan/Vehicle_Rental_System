import { Request, Response } from "express";
import { BookingService } from "./booking.service";
import { JwtPayload } from "jsonwebtoken";

const makeBooking = async (req: Request, res: Response) => {
  try {
    const result = await BookingService.makeBooking(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const viewBookings = async (req: Request, res: Response) => {
  try {
    const user: any = req.user;
    let result;
    if (user.role === "admin") {
      result = await BookingService.viewBookings();
    } else {
      result = await BookingService.viewOwnBookings(user.id);
    }

    res.status(200).json({
      success: true,
      message:
        user.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: result,
    });
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

const updateBookings = async (req: Request, res: Response) => {
  try {
    const user: any = req.user;
    const { status } = req.body;
    let result;
    if (user.role === "customer") {
      if (status !== "cancelled") {
        return res.status(403).json({
          success: false,
          message: "Not Eligible for this operation",
        });
      }

      result = await BookingService.updateCustomerBooking(
        req.params.bookingId!,
        user.id
      );

      return res.status(200).json({
        success: true,
        message: "Booking cancelled successfully",
        data: result,
      });
    } else {
      result = await BookingService.updateAdminBooking(req.params.bookingId!);
      return res.status(200).json({
        success: true,
        message: "Booking marked as returned. Vehicle is now available",
        data: result,
      });
    }
  } catch (err: any) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const BookingController = {
  makeBooking,
  viewBookings,
  updateBookings,
};
