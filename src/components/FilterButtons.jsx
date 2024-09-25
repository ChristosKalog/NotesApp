// FilterButtons.jsx
import React from "react";
import styles from "../styles/Dashboard.module.css"; // Import the CSS module

function FilterButtons({ filter, handleFilterChange, buttonRefs, isLightMode }) {
  return (
    <div
      className={`${styles.dashboardFilterContainer} ${
        isLightMode ? styles.light : ""
      }`}
    >
      <div className={styles.dashboardFilterButtons}>
        <button
          data-filter="my"
          ref={(el) => (buttonRefs.current[0] = el)}
          onClick={() => handleFilterChange("my")}
          className={`${styles.dashboardFilterButton} ${
            filter === "my" ? styles.active : ""
          } ${isLightMode ? styles.light : ""}`}
          title="Click here to view YOUR notes"
        >
          My Notes
        </button>
        <button
          data-filter="shared"
          ref={(el) => (buttonRefs.current[1] = el)}
          onClick={() => handleFilterChange("shared")}
          className={`${styles.dashboardFilterButton} ${
            filter === "shared" ? styles.active : ""
          } ${isLightMode ? styles.light : ""}`}
          title="Click here to view the SHARED notes"
        >
          Shared Notes
        </button>
        <button
          data-filter="all"
          ref={(el) => (buttonRefs.current[2] = el)}
          onClick={() => handleFilterChange("all")}
          className={`${styles.dashboardFilterButton} ${
            filter === "all" ? styles.active : ""
          } ${isLightMode ? styles.light : ""}`}
          title="Click here to view ALL the notes"
        >
          All Notes
        </button>
      </div>
    </div>
  );
}

export default FilterButtons;
