// Diary.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, isToday, getDay, isSameDay } from 'date-fns';
import styles from '../styles/Diary.module.css'; // Import the CSS module

const Diary = () => {
  const location = useLocation();
  const notes = location.state?.message || "No state passed"; // Use optional chaining and default message
  const [currentDate, setCurrentDate] = useState(new Date());

  const start = startOfMonth(currentDate);
  const end = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start, end });
  const startDay = getDay(start);

  const handlePreviousMonth = () => {
    setCurrentDate(addMonths(currentDate, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Function to check if a day has a note
  const hasNoteOnDay = (day) => {
    return Array.isArray(notes) && notes.some(note => note.dueDate && isSameDay(day, note.dueDate.toDate()));
  };

  return (
    <div className={styles.diaryContainer}>
      <div className={styles.diaryHeader}>
        <button onClick={handlePreviousMonth} className={styles.arrowButton}>{'<'}</button>
        <h3>{format(currentDate, 'MMMM yyyy')}</h3>
        <button onClick={handleNextMonth} className={styles.arrowButton}>{'>'}</button>
      </div>
      <div className={styles.diaryDaysNames}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className={styles.diaryDayName}>{day}</div>
        ))}
      </div>
      <div className={styles.diaryBody}>
        {Array.from({ length: startDay }).map((_, index) => (
          <div key={index} className={`${styles.diaryDay} ${styles.empty}`}></div>
        ))}
        {days.map((day) => (
          <div
            key={day}
            className={`${styles.diaryDay} ${isToday(day) ? styles.highlight : ''} ${hasNoteOnDay(day) ? styles.note : ''}`}
          >
            {format(day, 'd')}
          </div>
        ))}
      </div>
      <div className={styles.back}>
        <Link to="/dashboard">Go Back</Link>
      </div>
    </div>
  );
};

export default Diary;
