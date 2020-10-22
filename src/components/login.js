import React from "react";
import Layout from "./layout";

const Login = () => {
  function goToAuth() {
    window.location.href = `https://accounts.spotify.com/authorize?client_id=${process.env.GATSBY_SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=http://localhost:8000/callback/&scope=playlist-read-private`;
  }
  return (
    <button type="button" onClick={goToAuth}>
      Login
    </button>
  );
};

const RequiresLogin = () => (
  <Layout title="Login">
    <p>Login first</p>
    <Login />
  </Layout>
);

export default Login;
export { RequiresLogin };
