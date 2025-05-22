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

  const updateToken = (token, expiresInSeconds = 1600) => {
    const now = new Date().getTime();
    const expiryTime = now + expiresInSeconds * 1000;
    const tokenData = {
      value: token,
      expiry: expiryTime,
    };
    setCurrentToken(tokenData);
    localStorage.setItem("token", JSON.stringify(tokenData));
  };

  useEffect(() => {
    if (!currentToken) return;

    const now = new Date().getTime();
    const timeout = currentToken.expiry - now;

    if (timeout <= 0) {
      setCurrentToken(null);
      localStorage.removeItem("token");
      setCurrentUser(null);
      localStorage.removeItem("user");
      return;
    }

    const timer = setTimeout(() => {
      setCurrentToken(null);
      localStorage.removeItem("token");
      setCurrentUser(null);
      localStorage.removeItem("user");
    }, timeout);

    return () => clearTimeout(timer);
  }, [currentToken]);

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
