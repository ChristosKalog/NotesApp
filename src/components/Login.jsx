// Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn } from "@fortawesome/free-solid-svg-icons";

import styles from "../styles/Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User logged in successfully");
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <section className={styles.wrapper}>
      <div className={styles.formContainer}>
        <form className={styles.loginForm} onSubmit={handleLogin}>
          <h2>Welcome to NotesApp</h2>
          <h1>Login Form</h1>
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button className={styles.submitButton} type="submit">
            <FontAwesomeIcon icon={faSignIn} />
          </button>
          {error && <p className={styles.errorMessage}>{error}</p>}

          <div className={styles.registerTitle}>
            Not a member?
            <Link to="../register" className={styles.linkLogin}>
              Register Here
            </Link>
          </div>
        </form>
      </div>
    </section>
  );
}
