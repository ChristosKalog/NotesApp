// NoteForm.jsx
import React from "react";
import styles from "../styles/Dashboard.module.css"; // Import the CSS module

function NoteForm({
  newNote,
  setNewNote,
  isShared,
  setIsShared,
  isTask,
  setIsTask,
  handleAddNote,
  isLightMode,
  handleTextSelect,
  isAddingNote,
  selectedDate,
  setSelectedDate,
}) {
  return (
    <form
      className={`${styles.dashboardForm} ${isLightMode ? styles.light : ""}`}
      onSubmit={handleAddNote}
    >
      <textarea
        value={newNote}
        onChange={(e) => setNewNote(e.target.value)}
        onMouseUp={handleTextSelect}
        placeholder="Enter a new note"
        className={`${styles.textInput} ${styles.dashboardInput} ${
          isLightMode ? styles.light : ""
        }`}
      />
      <div className={styles.checkboxes}>
        <label
          className={`${styles.dashboardCheckboxLabel} ${
            isLightMode ? styles.light : ""
          }`}
        >
          <input
            type="checkbox"
            checked={isShared}
            onChange={(e) => setIsShared(e.target.checked)}
            className={`${styles.dashboardCheckbox} ${
              isLightMode ? styles.light : ""
            }`}
            title="Click here to share the note"
          />
          Shared
        </label>
        <label
          className={`${styles.dashboardCheckboxLabel} ${
            isLightMode ? styles.light : ""
          }`}
        >
          <input
            type="checkbox"
            checked={isTask}
            onChange={(e) => setIsTask(e.target.checked)}
            className={`${styles.dashboardCheckbox} ${
              isLightMode ? styles.light : ""
            }`}
            title="Click here to mark the note as completed"
          />
          Completed
        </label>
      </div>
      <div className={styles.datePicker}>
        <input
          type="date"
          value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className={`${styles.dashboardDateInput} ${
            isLightMode ? styles.light : ""
          }`}
          title="Click here to add a date note"
        />
      </div>
      <button
        type="submit"
        className={`${styles.dashboardSubmit} ${
          isLightMode ? styles.light : ""
        } ${isAddingNote ? styles.pressed : ""}`}
        disabled={isAddingNote}
        title="Click here to add the note"
      >
        {isAddingNote ? "Adding note..." : "Add Note"}
      </button>
    </form>
  );
}

export default NoteForm;
