import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/welcome.css";

import { motion } from "framer-motion";

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
      <h1 id="welcome-heading">readshare</h1>
      <motion.h2
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
        id="welcome-subheading">
        Reading has never been easier!
      </motion.h2>
      <motion.div
        animate={{ y: -200 }}
        transition={{ type: "spring", stiffness: 100 }}
        id="welcome-blue-circle"
      />
      <div id="welcome-buttons">
        <Link to="/register" id="welcome-signup-button">
          <div>
            <p style={{ color: "#f8f5f2" }}>Sign up</p>
          </div>
        </Link>
        <Link to="/login" style={{ textDecoration: "none" }}>
          <div>
            <p
              style={{
                color: "#f8f5f2",
                textAlign: "center",
                fontFamily: "ClashDisplay-Variable",
                fontSize: "13px",
                fontWeight: "500",
              }}>
              I have an account
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Welcome;
