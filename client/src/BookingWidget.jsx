import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberGuest, setNumberGuest] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState();
  const [redirect, setRedirect] = useState("");
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const startDate = new Date(checkIn);
      const endDate = new Date(checkOut);
      const timeDifference = endDate - startDate;
      const numberOfNights = timeDifference / (1000 * 3600 * 24); // Convert milliseconds to days
      const pricePerNight = place.price;
      const totalPriceValue = numberOfNights * pricePerNight;
      setTotalPrice(totalPriceValue);
    } else {
      setTotalPrice(0);
    }
  }, [checkIn, checkOut]);

  async function reservation() {
    const info = {
      checkIn,
      checkOut,
      name,
      phone,
      numberGuest,
      place: place._id,
      totalPrice,
    };
    const { data } = await axios.post(
      "https://airbnb-clone-coral-six-59.vercel.app/booking",
      info
    );
    const bookingId = data._id;
    setRedirect(`/account/bookings/${bookingId}`);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <div className="bg-white shadow rounded-2xl p-4 mt-2">
        <div className="text-xl text-center">Price: ${place.price} </div>
        <div className="my-4 border p-4 rounded-2xl">
          <label htmlFor="date">Check in: </label>
          <input
            type="date"
            value={checkIn}
            onChange={(ev) => setCheckIn(ev.target.value)}
          />
        </div>
        <div className="my-4 border p-4 rounded-2xl">
          <label htmlFor="date">Check out: </label>
          <input
            type="date"
            value={checkOut}
            onChange={(ev) => setCheckOut(ev.target.value)}
          />
        </div>

        <div>
          <label htmlFor="number">Number of guests</label>
          <input
            type="number"
            value={numberGuest}
            onChange={(ev) => setNumberGuest(ev.target.value)}
          />
        </div>
        {totalPrice > 0 && (
          <div>
            <label htmlFor="number">Your name</label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <label htmlFor="number">Your phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
            />
          </div>
        )}
        <div className="mt-4">
          <strong>Total Price: ${totalPrice}</strong>
        </div>
        <button onClick={reservation} className="primary mt-6">
          Book this place
        </button>
      </div>
    </div>
  );
}
