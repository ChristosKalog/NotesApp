import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  doc,
  getDoc,
  deleteDoc,
  updateDoc,
  Timestamp,
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import CryptoJS from "crypto-js";
import Header from "./Header";
import Footer from "./Footer";
import ViewToggleButtons from "./ViewToggleButtons";
import NoteForm from "./NoteForm";
import UrlInputForm from "./UrlInputForm";
import FilterButtons from "./FilterButtons";
import NotesList from "./NotesList";
import styles from "../styles/Dashboard.module.css"; // Import the CSS module

const secretKey = "your-secret-key"; // Replace with a secure key

function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isShared, setIsShared] = useState(false);
  const [isTask, setIsTask] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // 'all', 'my', 'shared'
  const [message, setMessage] = useState("");
  const [isLightMode, setIsLightMode] = useState(false); // State for theme
  const [selectedText, setSelectedText] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [url, setUrl] = useState("");
  const [viewMode, setViewMode] = useState("viewNotes"); // State for view mode
  const [isAddingNote, setIsAddingNote] = useState(false); // State for button press
  const [selectedDate, setSelectedDate] = useState(new Date()); // State for date picker

  const buttonRefs = useRef([]);

  useEffect(() => {
    if (auth.currentUser) {
      fetchUserProfile();
      const unsubscribe = fetchNotes();
      return () => unsubscribe(); // Cleanup subscription on unmount
    }
  }, [auth.currentUser]);

  const fetchUserProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setLoading(false);
    }
  };

  const fetchNotes = () => {
    const q = query(collection(db, "notes"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedNotes = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        const decryptedContent = CryptoJS.AES.decrypt(
          data.content,
          secretKey
        ).toString(CryptoJS.enc.Utf8);
        return {
          id: doc.id,
          ...data,
          content: decryptedContent,
        };
      });
      setNotes(fetchedNotes);
      setLoading(false);
    });
    return unsubscribe;
  };

  const filteredNotes = useMemo(() => {
    if (filter === "all") {
      return notes.filter(
        (note) => note.userId === auth.currentUser?.uid || note.isShared
      );
    } else if (filter === "my") {
      return notes.filter((note) => note.userId === auth.currentUser?.uid);
    } else if (filter === "shared") {
      return notes.filter((note) => note.isShared);
    }
    return [];
  }, [notes, filter, auth.currentUser]);

  const filteredNotesArray = Array.isArray(filteredNotes)
    ? filteredNotes
    : Array.from(filteredNotes);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const encryptedNote = CryptoJS.AES.encrypt(newNote, secretKey).toString();

    try {
      setIsAddingNote(true); // Set state to true when the button is pressed

      await addDoc(collection(db, "notes"), {
        userId: auth.currentUser.uid,
        content: encryptedNote,
        isShared: isShared,
        isLiked: false,
        isTask: isTask,
        createdAt: Timestamp.fromDate(new Date()),
        dueDate: selectedDate, // Add the selected date here
        username: username,
      });
      setNewNote("");
      setIsShared(false); // Reset the shared state
      setSelectedDate(new Date()); // Reset the date picker

      // Set a timeout to revert the button state after 300ms
      setTimeout(() => {
        setIsAddingNote(false);
      }, 300);
    } catch (error) {
      console.error("Error adding note:", error);
      setIsAddingNote(false); // Ensure to revert the button state in case of error
    }
  };

  const deleteNote = async (id) => {
    try {
      await deleteDoc(doc(db, "notes", id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Redirect will be handled by the Router in App.js
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    if (newFilter === "my") {
      setMessage("You do not have any notes to show");
    } else if (newFilter === "shared") {
      setMessage("You do not have any shared notes to show");
    } else if (newFilter === "all") {
      setMessage("You do not have any notes at all to show");
    }
  };

  const toggleTheme = () => {
    setIsLightMode(!isLightMode);
  };

  const updateNoteLocalState = (noteId, updatedFields) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === noteId ? { ...note, ...updatedFields } : note
      )
    );
  };

  const toggleLike = async (noteId, currentLikeStatus) => {
    try {
      const noteRef = doc(db, "notes", noteId);
      await updateDoc(noteRef, {
        isLiked: !currentLikeStatus,
      });
      updateNoteLocalState(noteId, { isLiked: !currentLikeStatus });
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const toggleTask = async (noteId, currentTaskStatus) => {
    try {
      const noteRef = doc(db, "notes", noteId);
      await updateDoc(noteRef, {
        isTask: !currentTaskStatus,
      });
      updateNoteLocalState(noteId, { isTask: !currentTaskStatus });
    } catch (error) {
      console.error("Error toggling task status:", error);
    }
  };

  const handleTextSelect = () => {
    const text = window.getSelection().toString();
    setSelectedText(text);
    setShowUrlInput(true); // Show the URL input box
  };

  const handleUrlInputChange = (e) => {
    setUrl(e.target.value);
  };

  const handleAddLink = (e) => {
    e.preventDefault();
    if (url.trim()) {
      let linkedText;
      if (selectedText.trim()) {
        // If text is selected, use it as the link text
        linkedText = `<a href="${url}" target="_blank">${selectedText}</a>`;
        setNewNote(newNote.replace(selectedText, linkedText));
      } else {
        // If no text is selected, use "Link" as the link text
        linkedText = `</br><a href="${url}" target="_blank">Link</a>`;
        setNewNote(newNote + " " + linkedText);
      }
      setSelectedText("");
      setUrl("");
      setShowUrlInput(false); // Hide the URL input box
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`${styles.wrapper} ${isLightMode ? styles.light : ""}`}>
      <Header
        username={username}
        handleLogout={handleLogout}
        toggleTheme={toggleTheme}
        isLightMode={isLightMode}
      />
   

      <div className={styles.mainContent}>
        <ViewToggleButtons
          viewMode={viewMode}
          setViewMode={setViewMode}
          isLightMode={isLightMode}
          setNewNote={setNewNote}
        />
        {viewMode === "addNote" && (
          <>
            <NoteForm
              newNote={newNote}
              setNewNote={setNewNote}
              isShared={isShared}
              setIsShared={setIsShared}
              isTask={isTask}
              setIsTask={setIsTask}
              handleAddNote={handleAddNote}
              isLightMode={isLightMode}
              handleTextSelect={handleTextSelect}
              isAddingNote={isAddingNote}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
            />
            {showUrlInput && (
              <UrlInputForm
                url={url}
                handleUrlInputChange={handleUrlInputChange}
                handleAddLink={handleAddLink}
                isLightMode={isLightMode}
              />
            )}
          </>
        )}
        {viewMode === "viewNotes" && (
          <>
            <FilterButtons
              filter={filter}
              handleFilterChange={handleFilterChange}
              buttonRefs={buttonRefs}
              isLightMode={isLightMode}
            />
            <NotesList
              filteredNotes={filteredNotes}
              message={message}
              isLightMode={isLightMode}
              deleteNote={deleteNote}
              toggleLike={toggleLike}
              toggleTask={toggleTask}
            />
          </>
        )}
      </div>
      <Footer isLightMode={isLightMode} />
    </div>
  );
}

export default Dashboard;
