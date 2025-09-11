import { hotelModel } from "@/database/models/hotel-model";
import {
  isDateInbetween,
  replaceMongoIdInArray,
  replaceMongoIdInObject,
} from "@/database/utils/data-util";
import { bookingModel } from "../models/booking-model";
import { ratingModel } from "../models/rating-model";
import { reviewModel } from "../models/review-model";
import { userModel } from "../models/user-model";

export async function getAllHotels(destination, checkin, checkout, category) {
  const regex = new RegExp(destination, "i");
  const hotelsByDestination = await hotelModel
    .find({ city: regex })
    .select([
      "thumbNailUrl",
      "name",
      "city",
      "lowRate",
      "highRate",
      "propertyCategory",
    ])
    .lean();
  let allHotels = hotelsByDestination;

  if(category){
    const categoryToMatch = decodeURI(category).split('|');
    allHotels = allHotels.filter((hotel)=>{
      return(
        categoryToMatch.includes(hotel.propertyCategory.toString())
      )
    })
  }

  if (checkin && checkout) {
    allHotels = await Promise.all(
      allHotels.map(async (hotel) => {
        const found = await findBooking(hotel._id, checkin, checkout);

        if (found) {
          hotel["isBooked"] = true;
        } else {
          hotel["isBooked"] = false;
        }
        return hotel;
      })
    );
  }

  return replaceMongoIdInArray(allHotels);
}

async function findBooking(hotelId,checkin,checkout) {
  const matches = await bookingModel
    .find({ hotelId: hotelId.toString() })
    .lean();

  const found = matches.find((match) => {
    return (
      isDateInbetween(checkin, match.checkin, match.checkout) ||
      isDateInbetween(checkout, match.checkin, match.checkout) ||
      isDateInbetween(match.checkin,checkin,checkout) ||
      isDateInbetween(match.checkout,checkin,checkout)
    );
  });
  return found;
}

export async function getHotelById(hotelId,checkin,checkout) {
  const hotel = await hotelModel.findById(hotelId).lean();
  if(checkin && checkout)
  {
    const found = await findBooking(hotel._id,checkin,checkout);
    if(found){
        hotel['isBooked']=true;
    }else{
        hotel['isBooked']=false;
    }
  }
  return replaceMongoIdInObject(hotel);
}
export async function getRatingsForAHotel(hotelId) {
  const ratings = await ratingModel.find({ hotelId: hotelId }).lean();
  return replaceMongoIdInArray(ratings);
}
export async function getReviewsForAHotel(hotelId) {
  const reviews = await reviewModel.find({ hotelId: hotelId }).lean();
  return replaceMongoIdInArray(reviews);
}

export async function getUserByEmail(email) {
  const user = await userModel.find({email:email}).lean();
  return replaceMongoIdInObject(user[0]);
  
}

export async function getBookingsByUser(userId){
  const bookings = await bookingModel.find({userId: userId}).lean();
  return replaceMongoIdInArray(bookings);
}