import React, { useState } from "react";
import { navigate } from "gatsby";
import json5 from "json5";
import AuthenticationContext from "./authenticationContext";
import * as CONSTANTS from "../constants";

const Authentication = ({ children }) => {
  const [user, setUser] = useState(() => {
    const localStorageUser = localStorage.getItem(CONSTANTS.USER_ID);
    if (localStorageUser) {
      return json5.parse(localStorage.getItem(CONSTANTS.USER_ID));
    }
    return null;
  });

  function login(user) {
    setUser(user);
    localStorage.setItem(CONSTANTS.USER_ID, json5.stringify(user));
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(CONSTANTS.USER_ID);
    navigate("/");
  }

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default Authentication;
