import { useEffect, useState } from "react";
import AccountNav from "../AccountNav";
import axios from "axios";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:4000/booking").then((response) => {
      setBookings(response.data);
    });
  }, []);
  return (
    <div>
      <AccountNav />
      <div>
        {bookings?.length > 0 &&
          bookings.map((booking) => (
            <div key={booking._id}>{booking.checkIn}</div>
          ))}
      </div>
    </div>
  );
}
