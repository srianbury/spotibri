import React from "react";
import Authentication from "./src/components/authentication";

export const wrapRootElement = ({ element }) => (
  <Authentication>{element}</Authentication>
);
