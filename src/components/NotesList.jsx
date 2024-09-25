// NotesList.jsx
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { faCheckSquare } from "@fortawesome/free-regular-svg-icons";
import { faSquare } from "@fortawesome/free-regular-svg-icons";
import { auth } from "../firebase";
import styles from "../styles/NotesList.module.css"; // Updated to use CSS modules
import { format } from "date-fns"; // Import format from date-fns

function NotesList({
  filteredNotes,
  message,
  isLightMode,
  deleteNote,
  toggleLike,
  toggleTask,
}) {
  const [expandedNotes, setExpandedNotes] = useState({});
  const [clickTimeouts, setClickTimeouts] = useState({});

  const toggleExpand = (noteId) => {
    setExpandedNotes((prevState) => ({
      ...prevState,
      [noteId]: !prevState[noteId],
    }));
  };

  const stripHtmlTags = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const countLineBreaks = (content) => {
    return (content.match(/\n/g) || []).length;
  };

  const shouldShowButton = (content) => {
    const plainTextContent = stripHtmlTags(content);
    const lineBreaks = countLineBreaks(plainTextContent);
    return plainTextContent.length > 60 || lineBreaks > 1;
  };

  const handleDelete = (noteId) => {
    deleteNote(noteId);
  };

  const handleClick = (noteId) => {
    const currentTime = new Date().getTime();
    const lastClickTime = clickTimeouts[noteId] || 0;
    if (currentTime - lastClickTime < 300) {
      // Double-click threshold
      handleDelete(noteId);
    } else {
      setClickTimeouts((prev) => ({ ...prev, [noteId]: currentTime }));
    }
  };

  const formatContent = (content) => {
    return content.replace(/\n/g, "<br />");
  };

  return (
    <div
      className={`${styles.dashboardNotesContainer} ${
        isLightMode ? styles.light : ""
      }`}
    >
      {filteredNotes.length === 0 ? (
        <p
          className={`${styles.dashboardMessage} ${
            isLightMode ? styles.light : ""
          }`}
        >
          {message}!
        </p>
      ) : (
        <ul
          className={`${styles.dashboardNotesList} ${
            isLightMode ? styles.light : ""
          }`}
        >
          {filteredNotes.map((note) => {
            const shouldShowMore = shouldShowButton(note.content);
            const formattedContent = formatContent(note.content);

            return (
              <li
                key={note.id}
                className={`${styles.dashboardNoteItem} ${
                  isLightMode ? styles.light : ""
                }`}
              >
                <small className={styles.noteDate}>
                  {format(note.createdAt.toDate(), "dd/MM/yyyy")}
                </small>

                <div
                  className={`${styles.noteContent} ${
                    isLightMode ? styles.light : ""
                  } ${expandedNotes[note.id] ? styles.expanded : ""}`}
                >
                  <span
                    dangerouslySetInnerHTML={{ __html: formattedContent }}
                  />
                </div>

                {note.dueDate ? (
                  <div
                    className={`${styles.noteDueDate} ${
                      isLightMode ? styles.light : ""
                    }`}
                  >
                    <p className={styles.fadedText}>Due on:&nbsp;</p>
                    <p>
                      <strong>
                        {note.dueDate.toDate().toLocaleDateString()}
                      </strong>
                    </p>
                  </div>
                ) : (
                  ""
                )}
                {shouldShowMore && (
                  <div className={styles.rowContainer}>
                    <button
                      onClick={() => toggleExpand(note.id)}
                      className={`${styles.expandButton} ${
                        isLightMode ? styles.light : ""
                      }`}
                    >
                      {expandedNotes[note.id] ? "Read less" : "Read more..."}
                    </button>
                  </div>
                )}
                <div className={`${styles.rowContainer} ${styles.buttons}`}>
                  <div className={styles.leftButtonContainer}>
                    {note.isShared && (
                      <button
                        onClick={() => toggleLike(note.id, note.isLiked)}
                        className={`${styles.dashboardLikeButton} ${
                          isLightMode ? styles.light : ""
                        }`}
                        disabled={note.userId === auth.currentUser.uid}
                      >
                        <FontAwesomeIcon
                          icon={note.isLiked ? faHeartSolid : faHeartRegular}
                          className={styles.icon}
                          title="Click here to like the note"
                        />
                      </button>
                    )}
                    <button
                      onClick={() => toggleTask(note.id, note.isTask)}
                      className={`${styles.dashboardLikeButton} ${
                        isLightMode ? styles.light : ""
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={note.isTask ? faCheckSquare : faSquare}
                        className={styles.icon}
                        title="Click here to mark as complete"
                      />
                    </button>
                  </div>
                  {note.userId === auth.currentUser.uid && (
                    <button
                      onClick={() => handleClick(note.id)}
                      className={`${styles.dashboardDeleteButton} ${
                        isLightMode ? styles.light : ""
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        className={styles.icon}
                        title="Click 2 times to delete the note"
                      />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default NotesList;
