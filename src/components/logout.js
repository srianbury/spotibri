import React, { useContext } from "react";
import AuthenticationContext from "./authenticationContext";

const Logout = () => {
  const { logout } = useContext(AuthenticationContext);
  return (
    <button type="button" onClick={() => logout()}>
      Logout
    </button>
  );
};

export default Logout;
