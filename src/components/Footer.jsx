// Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Footer.module.css"; // Import the CSS module

function Footer({ isLightMode }) {
  return (
    <div className={`${styles.footer} ${isLightMode ? styles.light : ""}`}>
      <Link to="../diary">Diary</Link>
      <p>Version 1.3 | All Rights Reserved</p>
    </div>
  );
}

export default Footer;
