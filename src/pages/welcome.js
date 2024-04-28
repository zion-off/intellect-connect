import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/welcome.css";

function Welcome() {
  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = "hidden";

    // Enable scrolling again when the component unmounts
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  return (
    <div className="welcome-main-container">
      <h1 id="welcome-heading">Intellect Connect</h1>
      <h2 id="welcome-subheading">Reading has never been easier!</h2>
      <div id="welcome-blue-circle"></div>
      <Link id="welcome-login-button" to="/login">
        <div>
          <p>Login</p>
        </div>
      </Link>
      <div id="welcome-sign-up-link">
        <p>
          New to intellect connect?{" "}
          <Link to="/register" id="welcome-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Welcome;
