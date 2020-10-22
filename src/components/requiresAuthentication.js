import React, { useContext } from "react";
import AuthenticationContext from "./authenticationContext";
import { RequiresLogin } from "./login";

const requiresAuthentication = Component => props => {
  const auth = useContext(AuthenticationContext);
  if (auth && auth.user) {
    return <Component {...props} />;
  }
  return <RequiresLogin />;
};

export default requiresAuthentication;
