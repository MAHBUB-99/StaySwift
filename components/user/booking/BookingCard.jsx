import { getHotelById } from "@/database/queries";
import { getDayDifference } from "@/database/utils/data-util";

export default async function BookingCard({ hotelId, checkin, checkout }) {
  const hotelInfo = await getHotelById(hotelId);
  const days = await getDayDifference(checkin, checkout);
  const totalCost = ((hotelInfo?.highRate + hotelInfo?.lowRate) / 2) * days;
  
  return (
    <div className="flex justify-between items-center ">
      <div>
        <h3 className="text-xl font-semibold">Effotel By Sayaji Jaipur</h3>
        <div className="text-sm text-gray-600 my-4">
          <p>Check In: {checkin}</p>
          <p>Check Out: {checkout}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-right">${totalCost}</h3>
        <p className="text-sm text-gray-600">
          ${totalCost / days} per night x ${days} days
        </p>
      </div>
    </div>
  );
}
