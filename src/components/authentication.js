import React, { useState } from "react";
import { navigateTo } from "gatsby";
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

  function logout(navigate = true) {
    setUser(null);
    localStorage.removeItem(CONSTANTS.USER_ID);
    if (navigateTo) {
      navigateTo("/");
    }
  }

  async function authedFetch(url) {
    let error = null;
    let result = null;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.access_token}`,
      },
    });
    result = await response.json();
    if (response.status === 401) {
      error = result.error;
      result = null;
    }
    return { error, result };
  }

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        login,
        logout,
        authedFetch,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default Authentication;
