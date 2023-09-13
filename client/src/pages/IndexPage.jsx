import { useEffect, useState } from "react";
import axios from "axios";

const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:4000/places").then((response) => {
      setPlaces(response.data);
    });
  }, []);
  return (
    <div className="mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {places.length > 0 &&
        places.map((place) => {
          return (
            <div key={place.id}>
              <div className="bg-gray-500 rounded-2xl">
                {place.photos?.[0] && (
                  <img
                    className="rounded-2xl"
                    src={"http://localhost:4000/uploads/" + place.photos?.[0]}
                    alt={place.name}
                  />
                )}
              </div>

              <h2 className="font-bold">{place.address}</h2>
              <h3 className="text-sm truncate text-gray-500">{place.title}</h3>
              <div className="mt-1">
                {" "}
                <span className="font-bold">${place.price}</span> per night
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default IndexPage;
