import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyChzopucC4kiClSqOYN9BTXF_eKjSk0OIg",
  authDomain: "react-portfolio-dashboar-4ac14.firebaseapp.com",
  projectId: "react-portfolio-dashboar-4ac14",
  storageBucket: "react-portfolio-dashboar-4ac14.appspot.com",
  messagingSenderId: "339754763223",
  appId: "1:339754763223:web:9c5a15fe6f7d3d69a1c192",
  measurementId: "G-DEES8XQ797"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export const signInWithGoogle = () => signInWithPopup(auth, provider);