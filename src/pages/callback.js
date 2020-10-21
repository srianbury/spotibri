import React, { useContext, useEffect } from "react";
import Layout from "../components/layout";
import AuthenticationContext from "../components/authenticationContext";
import { navigate } from "gatsby";

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
  const { setUser } = useContext(AuthenticationContext);
  useEffect(() => {
    const auth = getAuthValues(window.location.hash);
    setUser(cur => ({ ...cur, auth }));
    navigate("/");
  }, [setUser]);

  return <Layout title="Callback">hi</Layout>;
};

export default Callback;
