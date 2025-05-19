import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  currentUser: null,
  currentToken: null,
  updateUser: () => {},
  updateToken: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [currentToken, setCurrentToken] = useState(
    JSON.parse(localStorage.getItem("token")) || null
  );

  const updateUser = (user) => {
    setCurrentUser(user);
  };

  const updateToken = (token) => {
    setCurrentToken(token);
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
    localStorage.setItem("token", JSON.stringify(currentToken));
  }, [currentUser, currentToken]);

  return (
    <AuthContext.Provider
      value={{ currentUser, currentToken, updateUser, updateToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
