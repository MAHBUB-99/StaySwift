import { dbConnect } from "@/database/service/mongo";
import { NextResponse } from "next/server";
import { bookingModel } from "@/database/models/booking-model";
import mongoose from "mongoose";

export const POST = async (request) => {
  const { hotelId, userId, checkin, checkout } = await request.json();
  await dbConnect();
  const payload = {
    hotelId: new mongoose.Types.ObjectId(hotelId),
    userId: new mongoose.Types.ObjectId(userId),
    checkin,
    checkout,
  };
  try {
    await bookingModel.create(payload);
    return new NextResponse("A New Booking has been Created.", { status: 201 });
  } catch (error) {
    return new NextResponse(error.message, { status: 500 });
  }
};
