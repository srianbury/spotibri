import React from "react";

const withList = Component => ({ length, empty, ...rest }) => {
  if (length === 0) {
    return <>{empty}</>;
  }
  return <Component {...rest} />;
};

export default withList;
