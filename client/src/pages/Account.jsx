import { useContext, useState } from "react";
import { UserContext } from "../userContext";
import { Navigate, Link, useParams } from "react-router-dom";
import axios from "axios";

const Account = () => {
  const { user, setUser, ready } = useContext(UserContext);
  const [redirect, setRedirect] = useState(false);
  let { subpage } = useParams();

  if (subpage === undefined) {
    subpage = "settings";
  }

  async function handleLogout() {
    await axios.post("http://localhost:4000/logout");
    setRedirect(true);
    setUser(null);
  }

  if (!user && ready && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  function linkClasses(type) {
    console.log(type);
    let classes = "py-2 px-6 rounded-full";
    if (type === subpage) {
      classes += " bg-primary text-white";
    } else {
      classes += " bg-gray-200";
    }
    return classes;
  }

  return (
    <div>
      <nav className="w-full flex mt-8 mb-8 gap-2 justify-center">
        <Link className={linkClasses("settings")} to={"/account"}>
          Settings
        </Link>
        <Link className={linkClasses("bookings")} to={"/account/bookings"}>
          My bookings
        </Link>
        <Link className={linkClasses("places")} to={"/account/places"}>
          My accommodations
        </Link>
      </nav>

      {subpage === "settings" && (
        <div className="text-center max-w-lg mx-auto">
          logged in as {user.name} with {user.email}
          <br />
          <button className="primary max-w-sm mt-2" onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default Account;
