import React from "react";
import ErrorScreen from "./Error";

const withErrorAndLoading = Component => ({ error, loading, ...rest }) => {
  if (error) {
    console.log({ error });
    return <ErrorScreen error={error} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Component {...rest} />;
};

export default withErrorAndLoading;
