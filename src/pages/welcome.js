import React from "react";
import { Link } from "react-router-dom";
import "../styles/welcome.css";

function Welcome() {
  return (
    <div className="welcome-main-container">
      <h1 id="welcome-heading">Intellect Connect</h1>
      <h2 id="welcome-subheading">Reading has never been easier!</h2>
      <div id="welcome-blue-circle"></div>
      <Link id="welcome-login-button" to="/login">
        <div >
          <p>Login</p>
        </div>
      </Link>
      <div id="welcome-sign-up-link">
        <p>
          New to intellect connect?
          <a href="/register" id="welcome-link">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Welcome;
