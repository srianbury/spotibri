import React, { useContext } from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import AuthenticationContext from "./authenticationContext";
import Login from "./login";
import Logout from "./logout";

const Header = ({ siteTitle, pageTitle }) => {
  const auth = useContext(AuthenticationContext);
  return (
    <header
      className="d-flex justify-content-between pt-1 pb-1 pl-2 pr-2 mb-2"
      style={{ backgroundColor: "#d3d3d3" }}
    >
      <div className="d-flex flex-wrap align-content-center">
        <h4>{pageTitle}</h4>
      </div>

      <div>
        <h3>
          <Link to="/">{siteTitle}</Link>
        </h3>
      </div>

      <div className="d-flex flex-wrap align-content-center">
        <Link to="/" className="d-inline mr-1 align-self-center">
          Home
        </Link>
        <div className="d-inline">
          {auth && auth.user ? <Logout /> : <Login />}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
