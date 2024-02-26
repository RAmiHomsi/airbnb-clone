import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!user && !ready) {
      axios
        .get("https://airbnb-clone-tawny-chi.vercel.app/profile")
        .then(({ data }) => {
          setUser(data);
          setReady(true);
        });
    }
  }, [user, ready, setUser]);
  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
