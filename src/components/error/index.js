import React from "react";
import Logout from "../logout";

const ErrorScreen = ({ error }) => {
  let ErrorMessage = DefaultError;
  switch (error.status) {
    case 401:
      ErrorMessage = Error401;
      break;
    default:
  }

  return <ErrorMessage error={error} />;
};

const DefaultError = () => <div>Sorry! Something's broken</div>;

const Error401 = () => (
  <div>
    <p>
      Sorry! Your spotify access token expired and I haven't added the feature
      to automatically refresh it. Please logout and login again.
    </p>
    <Logout />
  </div>
);

export default ErrorScreen;
