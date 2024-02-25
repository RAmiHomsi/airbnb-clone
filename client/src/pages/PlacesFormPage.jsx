import { useEffect, useState } from "react";
import axios from "axios";
import PhotosUploader from "../PhotosUploader";
import AccountNav from "../AccountNav";
import { Navigate, useParams } from "react-router-dom";

const PlacesFormPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [perks, setPerks] = useState([]);
  const [description, setDescription] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios
      .get(`https://airbnb-clone-tawny-chi.vercel.app/places/${id}`)
      .then((response) => {
        const { data } = response;
        setTitle(data.title);
        setAddress(data.address);
        setAddedPhotos(data.photos);
        setPerks(data.perks);
        setDescription(data.description);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price);
      });
  }, [id]);

  /// Inside your PlacesPage component
  const handleCbClick = (event) => {
    const perk = event.target.name; // Get the name attribute of the checkbox
    if (event.target.checked) {
      // If the checkbox is checked, add the perk to the selectedPerks array
      setPerks((prevPerks) => {
        const updatedPerks = [...prevPerks, perk];
        console.log(`Added perk: ${perk}`);
        console.log(`Updated perks:`, updatedPerks);
        return updatedPerks;
      });
    } else {
      // If the checkbox is unchecked, remove the perk from the selectedPerks array
      setPerks((prevPerks) => {
        const updatedPerks = prevPerks.filter((selected) => selected !== perk);
        console.log(`Removed perk: ${perk}`);
        console.log(`Updated perks:`, updatedPerks);
        return updatedPerks;
      });
    }
  };

  async function savePlace(ev) {
    ev.preventDefault();
    const placeData = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      //update
      await axios.put("https://airbnb-clone-tawny-chi.vercel.app/places", {
        id,
        ...placeData,
      });
      setRedirect(true);
    } else {
      //create new place

      await axios.post(
        "https://airbnb-clone-tawny-chi.vercel.app/places",
        placeData
      );
      setRedirect(true);
    }
  }

  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }

  return (
    <>
      <div>
        <AccountNav />
        <form onSubmit={savePlace}>
          <h2 className="text-xl mt-4">Title</h2>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My appartment"
          />
          <h2 className="text-xl mt-4">Address</h2>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="The address"
          />
          <h2 className="text-xl mt-4">Photos</h2>
          <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
          <h2 className="text-xl mt-4">Description</h2>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <h2 className="text-xl mt-4">Perks</h2>
          <div className="mt-2 grid md:grid-cols-2 lg:grid-cols-4">
            <label className="flex gap-1">
              {/* checked attribute is to check whether the corresponding perk (e.g., "wifi," "parking," or "TV") is included in the perks array. This will ensure that the checkboxes are checked when the associated perk is in the perks when displaying them */}
              <input
                name="wifi"
                checked={perks.includes("wifi")}
                onChange={handleCbClick}
                type="checkbox"
              />
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
                  d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z"
                />
              </svg>
              <span>Wifi</span>
            </label>
            <label className="flex gap-1">
              <input
                name="parking"
                checked={perks.includes("parking")}
                onChange={handleCbClick}
                type="checkbox"
              />
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
                  d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                />
              </svg>

              <span>Free parking</span>
            </label>
            <label className="flex gap-1">
              <input
                name="TV"
                checked={perks.includes("TV")}
                onChange={handleCbClick}
                type="checkbox"
              />
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
                  d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125z"
                />
              </svg>

              <span>TV</span>
            </label>
          </div>
          <h2 className="text-xl mt-4">Extra Info</h2>
          <textarea
            value={extraInfo}
            onChange={(e) => setExtraInfo(e.target.value)}
          ></textarea>
          <h2 className="text-xl mt-4">
            Check in and out times + Max guests allowed
          </h2>
          <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="mt-2">Check in</h3>
              <input
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                type="text"
              />
            </div>
            <div>
              <h3 className="mt-2">Check out</h3>
              <input
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                type="text"
              />
            </div>
            <div>
              <h3 className="mt-2">Max guests</h3>
              <input
                value={maxGuests}
                onChange={(e) => setMaxGuests(e.target.value)}
                type="number"
              />
            </div>
            <div>
              <h3 className="mt-2">Price</h3>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
              />
            </div>
          </div>
          <button className="primary mt-4">Save</button>
        </form>
      </div>
    </>
  );
};

export default PlacesFormPage;
