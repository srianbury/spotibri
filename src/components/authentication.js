import React, { useState } from "react";
import AuthenticationContext from "./authenticationContext";

const Authentication = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticationContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

export default Authentication;
