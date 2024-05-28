import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/navbar.css";
import { ReactComponent as ProfileIcon } from "../assets/profile.svg";
import { ReactComponent as HomeIcon } from "../assets/home.svg";

const Navbar = () => {
  const location = useLocation(); // Hook to get the current location
  const currentPath = location.pathname; // Current route path

  // Determine the color of the icons based on the current path
  const homeIconColor = currentPath === "/communities" ? "#078080" : "black";
  const profileIconColor = currentPath === "/profile" ? "#078080" : "black";

  return (
    <div id="navbar-outer-container">
      <div id="navbar-main-container">
        <Link to="/communities">
          <button id="navbar-button">
            <HomeIcon
              id="navbar-home-icon"
              style={{ fill: homeIconColor, height: "24px", width: "24px" }}
            />
          </button>
        </Link>
        <Link to="/profile">
          <button id="navbar-button">
            <ProfileIcon
              id="navbar-profile-icon"
              style={{ fill: profileIconColor, height: "24px", width: "24px" }}
            />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
