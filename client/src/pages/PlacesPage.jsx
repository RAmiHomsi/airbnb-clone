import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const PlacesPage = () => {
  const { action } = useParams();
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [photoLink, setPhotoLink] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  //const [price, setPrice] = useState(100);
  //const [redirect, setRedirect] = useState(false);

  async function addPhotoByLink(e) {
    e.preventDefault();
    const { data } = await axios.post("http://localhost:4000/uploadlink", {
      link: photoLink,
    });

    setAddedPhotos((prev) => {
      return [...prev, data];
    });
    setPhotoLink("");
  }

  async function uploadPhoto(e) {
    const files = e.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("photos", files[i]);
    }
    const { data } = await axios.post(
      "http://localhost:4000/upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    console.log(data);
    setAddedPhotos((prev) => {
      return [...prev, ...data];
    });
  }

  return (
    <div>
      {action !== "new" && (
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
      )}

      {action === "new" && (
        <div>
          <form encType="multipart/form-data">
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
            <div className="flex gap-2">
              <input
                value={photoLink}
                onChange={(e) => setPhotoLink(e.target.value)}
                type="text"
                placeholder="Add using a link ....jpg"
              />
              <button
                onClick={addPhotoByLink}
                className="bg-gray-200 px-4 rounded-2xl"
              >
                Add&nbsp;photo
              </button>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-6">
              {addedPhotos.length > 0 &&
                addedPhotos.map((link, index) => {
                  return (
                    <div key={index}>
                      <img
                        className="rounded-2xl"
                        src={"http://localhost:4000/uploads/" + link}
                        alt=""
                      />
                    </div>
                  );
                })}
              <label className="flex items-center justify-center gap-1 border p-2 bg-transparent rounded-2xl text-2xl text-gray-500">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={uploadPhoto}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>
                Upload
              </label>
            </div>
            <h2 className="text-xl mt-4">Description</h2>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
            <h2 className="text-xl mt-4">Perks</h2>
            <div className="mt-2 grid md:grid-cols-2 lg:grid-cols-4">
              <label className="flex gap-1">
                <input
                  value={perks}
                  onChange={(e) => setPerks(e.target.value)}
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
                  value={perks}
                  onChange={(e) => setPerks(e.target.value)}
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
                  value={perks}
                  onChange={(e) => setPerks(e.target.value)}
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
            <div className="grid gap-2 sm:grid-cols-3">
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
            </div>
            <button className="primary mt-4">Save</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PlacesPage;
