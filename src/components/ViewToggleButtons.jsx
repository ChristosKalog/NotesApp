// ViewToggleButton.jsx
import React from 'react';
import styles from '../styles/ViewToggleButton.module.css'; // Import the updated CSS module

function ViewToggleButton({ viewMode, setViewMode, isLightMode, setNewNote }) {
  const handleClick = () => {
    setViewMode(viewMode === 'addNote' ? 'viewNotes' : 'addNote');
    setNewNote('');
  };

  return (
    <button
      onClick={handleClick}
      className={`${styles.viewToggleButton} ${
        viewMode === 'addNote' ? styles.active : ''
      } ${isLightMode ? styles.light : ''}`}
      title={viewMode === 'addNote' ? 'Click here to view notes' : 'Click here to add a note'}
    >
      {viewMode === 'addNote' ? 'View Notes' : 'Add a Note'}
    </button>
  );
}

export default ViewToggleButton;
