// Register.jsx
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { auth, db } from "../firebase";
import styles from "../styles/Register.module.css"; // Import the CSS module

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: new Date(),
        username: username,
      });

      console.log("User registered successfully");
    } catch (error) {
      setError("Error: " + error.message);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.formContainer}>
        <form className={styles.registerForm} onSubmit={handleRegister}>
          <h2>Welcome to NotesApp</h2>
          <h1>Register Form</h1>
          <input
            className={styles.inputContainer}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            className={styles.inputContainer}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <div className={styles.passwordWrapper}>
            <input
              className={styles.inputContainer}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className={styles.eyeIcon}
              onClick={() => setShowPassword((prev) => !prev)}
            />
          </div>
          <div className={styles.passwordWrapper}>
            <input
              className={styles.inputContainer}
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
            <FontAwesomeIcon
              icon={showConfirmPassword ? faEye : faEyeSlash}
              className={styles.eyeIcon}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            />
          </div>
          <button className={styles.submitButton} type="submit">
            Register
          </button>
        </form>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <div className={styles.registerTitle}>
          Already a member?
          <Link to="../login" className={styles.linkLogin}>
            Log In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
