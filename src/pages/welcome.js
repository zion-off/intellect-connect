import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/welcome.css";

import { motion } from "framer-motion";

function Welcome() {

  return (
    <div className="welcome-main-container">
      <div className="welcome-heading">
        <h1 id="welcome-heading">Readshare</h1>
        <img
          src="./images/dialog-one.png"
          alt="logo"
          id="welcome-design-element-one"
        />
        <img
          src="./images/dialog-two.png"
          alt="logo"
          id="welcome-design-element-two"
        />
        <motion.h2
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          id="welcome-subheading"
        >
          Reading has never been easier!
        </motion.h2>
      </div>

      <div id="welcome-buttons">
        <Link to="/register" id="welcome-signup-button">
          <p style={{ color: "#f8f5f2" }}>Sign up</p>
        </Link>
        <Link to="/login" id="welcome-login-button">
          <p>I have an account</p>
        </Link>
      </div>
    </div>
  );
}

export default Welcome;
