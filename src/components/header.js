import React, { useContext } from "react";
import { Link } from "gatsby";
import PropTypes from "prop-types";
import AuthenticationContext from "./authenticationContext";
import Login from "./login";
import Logout from "./logout";

const Header = ({ siteTitle, pageTitle }) => {
  const auth = useContext(AuthenticationContext);
  return (
    <header className="pure-g" style={{ backgroundColor: "#d3d3d3" }}>
      <div className="pure-u-1-3">
        <div className="d-flex">
          <div className="margin-left-20">
            <h3>{pageTitle}</h3>
          </div>
        </div>
      </div>
      <div className="pure-u-1-3 text-align-center">
        <h3>
          <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
            {siteTitle}
          </Link>
        </h3>
      </div>
      <div className="pure-u-1-3">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            height: "100%",
          }}
        >
          <div className="margin-right-20" style={{ alignSelf: "center" }}>
            <Link
              to="/"
              style={{
                display: "inline",
                textDecoration: "none",
                color: "#000",
              }}
            >
              Home
            </Link>
            <div style={{ display: "inline", marginLeft: "10px" }}>
              {auth && auth.user ? <Logout /> : <Login />}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

//
//

Header.propTypes = {
  siteTitle: PropTypes.string,
};

Header.defaultProps = {
  siteTitle: ``,
};

export default Header;
