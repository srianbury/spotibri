import React from "react";
import ErrorScreen from "./error";
import Loading from "./loading";

const withErrorAndLoading = Component => ({ error, loading, ...rest }) => {
  if (error) {
    return <ErrorScreen error={error} />;
  }

  if (loading) {
    return <Loading />;
  }

  return <Component {...rest} />;
};

export default withErrorAndLoading;
