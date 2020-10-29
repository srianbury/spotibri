import React from "react";
import loadable from "@loadable/component";
// import "./src/styles/index.css";
// import "./src/styles/pure-min.css";
import "./src/styles/bootstrap.css";

const Authentication = loadable(() =>
  import("./src/components/authentication")
);

export const wrapRootElement = ({ element }) => (
  <Authentication>{element}</Authentication>
);
