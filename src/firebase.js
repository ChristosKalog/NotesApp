// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDwNLq1CqT0QIZDDPFRqE_sXx5EddwcXNc",
    authDomain: "noteit-cc3df.firebaseapp.com",
    projectId: "noteit-cc3df",
    storageBucket: "noteit-cc3df.appspot.com",
    messagingSenderId: "1064607948133",
    appId: "1:1064607948133:web:99398304684ebe3e3b558c"
  };

// Initialize Firebase  
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);