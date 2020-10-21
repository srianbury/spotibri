import React, { useContext } from "react";
import AuthenticationContext from "./authenticationContext";
import { RequiresLogin } from "./login";

const requiresAuthentication = Component => props => {
  const { user } = useContext(AuthenticationContext);
  if (!user) {
    return <RequiresLogin />;
  }
  return <Component {...props} />;
};

export default requiresAuthentication;
