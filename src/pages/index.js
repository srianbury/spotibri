import React from "react";
import { Link } from "gatsby";

import Layout from "../components/layout";

const apps = [
  {
    title: "Song Finder",
    to: "/song-finder/",
  },
];

const IndexPage = () => (
  <Layout title="Home">
    <p>Welcome to spotibry</p>
    <p>Apps</p>
    <ol>
      {apps.map(app => (
        <Link key={app.title} to={app.to}>
          <li>{app.title}</li>
        </Link>
      ))}
    </ol>
  </Layout>
);

export default IndexPage;
