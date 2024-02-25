import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";
import Image from "../Image";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios
      .get("https://airbnb-clone-tawny-chi.vercel.app/booking")
      .then((response) => {
        setBookings(response.data);
      });
  }, []);
  return (
    <div>
      <AccountNav />
      <div>
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="flex gap-4 bg-gray-200 rounded-2xl overflow-hidden"
            >
              <div className="w-48">
                {booking.place.photos.length > 0 && (
                  <Image
                    className="object-cover"
                    src={booking.place.photos[0]}
                  />
                )}
              </div>
              <div className="py-3 pr-3 grow">
                <h2 className="text-xl mb-2">{booking.place.title} </h2>
                {new Date(booking.checkIn).toLocaleString()} &rarr;{" "}
                {new Date(booking.checkOut).toLocaleString()}
                <div>Total price: ${booking.price} </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
