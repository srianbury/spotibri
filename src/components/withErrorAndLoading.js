import React from "react";
import ErrorScreen from "./error";

const withErrorAndLoading = Component => ({ error, loading, ...rest }) => {
  if (error) {
    return <ErrorScreen error={error} />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return <Component {...rest} />;
};

export default withErrorAndLoading;
