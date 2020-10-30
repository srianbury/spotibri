import React from "react";
import { Link } from "gatsby";
import Layout from "../components/layout";

const apps = [
  {
    title: "Song Finder - Playlist",
    to: "/song-finder/",
    description: "Search for lyrics within a playlist :)",
  },
];

const IndexPage = () => (
  <Layout title="Home">
    <div className="container row">
      {apps.map(app => (
        <div key={app.title} className="col-6">
          <h3>
            <Link to={app.to}>{app.title}</Link>
          </h3>
          <div>{app.description}</div>
        </div>
      ))}
    </div>
  </Layout>
);

export default IndexPage;
