import React, { useContext } from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import AuthenticationContext from "../components/authenticationContext";

const Header = ({ siteTitle }) => {
  const { user } = useContext(AuthenticationContext);
  return (
    <header>
      <div>
        <h3>
          <Link to="/">{siteTitle}</Link>
        </h3>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login/">Login</Link>
          </li>
          <li>{user ? "Logged In" : "Not Logged In"}</li>
        </ul>
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
