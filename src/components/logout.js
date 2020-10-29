import React, { useContext } from "react";
import AuthenticationContext from "./authenticationContext";

const Logout = () => {
  const { logout } = useContext(AuthenticationContext);
  return (
    <button
      type="button"
      onClick={() => logout()}
      className="btn btn-secondary btn-sm"
    >
      Logout
    </button>
  );
};

export default Logout;
