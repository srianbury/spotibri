import React from "react";
import Layout from "../components/layout";
import Login from "../components/login";

const ReLoginView = () => (
  <Layout title="Login Again">
    <p>
      Sorry! Your auth token expired and I haven't implemented a way to refresh
      them yet. Please login again.
    </p>
    <Login />
  </Layout>
);

export default ReLoginView;
