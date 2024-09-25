// UrlInputForm.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Dashboard.module.css'; // Import the CSS module

function UrlInputForm({ url, handleUrlInputChange, handleAddLink, isLightMode }) {
  return (
    <form
      className={`${styles.urlInputForm} ${isLightMode ? styles.light : ''}`}
      onSubmit={handleAddLink}
    >
      <input
        type="text"
        value={url}
        onChange={handleUrlInputChange}
        placeholder="Enter URL"
        className={`${styles.dashboardInputUrl} ${
          isLightMode ? styles.light : ''
        }`}
      />
      <button
        type="submit"
        className={`${styles.dashboardSubmitUrl} ${
          isLightMode ? styles.light : ''
        }`}
      >
        <FontAwesomeIcon icon={faLink} />
      </button>
    </form>
  );
}

export default UrlInputForm;
