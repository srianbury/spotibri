import React from "react";
import loadable from "@loadable/component";
const Authentication = loadable(() =>
  import("./src/components/authentication")
);

export const wrapRootElement = ({ element }) => (
  <Authentication>{element}</Authentication>
);
