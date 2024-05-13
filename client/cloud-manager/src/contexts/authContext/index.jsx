import React, { useContext, useEffect, useState } from "react";
import { auth } from "../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";

export const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const userDataResponse = await axios.get(
            `http://localhost:3000/account/${user.email}`
          );
          const accountInfo = userDataResponse.data[0];
          setCurrentUserData(accountInfo);
        } catch (error) {
          console.error("Error fetching user data from MongoDB:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setCurrentUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [currentUser]); // Ensure useEffect runs when currentUser changes

  const contextValue = {
    currentUser,
    currentUserData,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
