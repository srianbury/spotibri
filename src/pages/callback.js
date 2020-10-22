import React, { useContext, useEffect } from "react";
import { navigate } from "gatsby";
import Layout from "../components/layout";
import AuthenticationContext from "../components/authenticationContext";

function getAuthValues(hash) {
  let authParams = {};
  const pairs = hash.substring(1); // removing starting #
  const kvps = pairs.split("&");
  kvps.forEach(kvp => {
    const [key, value] = kvp.split("=");
    authParams[key] = value;
  });
  return authParams;
}

const Callback = () => {
  const auth = useContext(AuthenticationContext);

  useEffect(() => {
    const user = getAuthValues(window.location.hash);
    auth.login(user);
    navigate("/");
    // eslint-disable-next-line
  }, []);

  return <Layout title="Callback">hi</Layout>;
};

export default Callback;
