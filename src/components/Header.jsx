// Header.jsx
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faLightbulb, faMoon } from "@fortawesome/free-solid-svg-icons";
import styles from "../styles/Header.module.css"; // Import the CSS module

function Header({ username, handleLogout, toggleTheme, isLightMode }) {
  return (
    <div className={`${styles.header} ${isLightMode ? styles.light : ""}`}>
      <p className={`${styles.dashboardHeading} ${isLightMode ? styles.light : ""}`}>
        {username}
      </p>
      <div className={styles.headerButtons}>
        <button
          className={`${styles.lightmodeButton} ${isLightMode ? styles.light : ""}`}
          onClick={toggleTheme}
          title="Switch light mode"
        >
          <FontAwesomeIcon icon={isLightMode ? faMoon : faLightbulb} />
        </button>
        <button
          className={`${styles.dashboardLogout} ${isLightMode ? styles.light : ""}`}
          onClick={handleLogout}
          title="Logout"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
        </button>
      </div>
    </div>
  );
}

export default Header;
