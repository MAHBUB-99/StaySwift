import { auth } from "@/auth";
import PaymentForm from "@/components/payment/PaymentForm";
import PriceSummary from "@/components/payment/PriceSummary";
import {
  getHotelById,
  getRoomOptionsForHotel,
  getUserByEmail,
} from "@/database/queries";
import { parseStayParams, stayQuery } from "@/database/utils/stay";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export const metadata = { title: "Secure booking" };

export default async function PaymentPage({ params: { id }, searchParams }) {
  const stay = parseStayParams(searchParams);
  const query = stayQuery(stay);
  const hotelHref = `/hotels/${id}?${query}#rooms`;

  const session = await auth();
  if (!session) {
    const here = `/hotels/${id}/payment?room=${searchParams.room ?? ""}&${query}`;
    redirect(`/login?callbackUrl=${encodeURIComponent(here)}`);
  }
  if (!stay.checkin) {
    redirect(hotelHref);
  }

  const hotel = await getHotelById(id);
  if (!hotel) {
    notFound();
  }
  const rooms = await getRoomOptionsForHotel(hotel, stay);
  const room = rooms.find((option) => option.key === searchParams.room);
  if (!room?.bookable) {
    redirect(hotelHref);
  }
  const loggedInUser = await getUserByEmail(session.user.email);

  return (
    <div className="container py-6">
      <Link href={hotelHref} className="link text-sm">
        ← Back to rooms
      </Link>
      <h1 className="mt-3 text-3xl font-bold">Secure booking</h1>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        <PaymentForm
          loggedInUser={loggedInUser}
          hotelId={hotel.id}
          roomType={room.key}
          stay={stay}
          total={room.price.total}
        />
        <PriceSummary hotel={hotel} room={room} stay={stay} price={room.price} />
      </div>
    </div>
  );
}
