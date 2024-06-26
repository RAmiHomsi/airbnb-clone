import { Link } from "react-router-dom";
import axios from "axios";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import Image from "../Image.jsx";

const PlacesPage = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);
  return (
    <div>
      <AccountNav />

      <div className="text-center">
        <Link
          className="inline-flex bg-primary text-white py-2 px-6 rounded-full"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          Add new place
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 &&
          places.map((place) => {
            return (
              <Link
                to={"/account/places/" + place._id}
                key={place.id}
                className="flex items-center gap-4 bg-gray-100 p-4 rounded-2xl grow shrink-0 mt-2"
              >
                <div className="flex w-32 h-32 grow shrink-0">
                  {place.photos.length > 0 && (
                    <Image
                      className="object-cover"
                      src={place.photos?.[0]}
                      alt=""
                    />
                  )}
                </div>
                <div className="grow-0 shrink">
                  <h2 className="text-xl">{place.title}</h2>
                  <p className="text-sm mt-2">{place.description}</p>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
};

export default PlacesPage;
