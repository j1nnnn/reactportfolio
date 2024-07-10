import { getAuth } from "firebase/auth";
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
  apiKey: "AIzaSyC9Ku94uN0LG4pb9F56hOjnjEOuN3AqISA",
  authDomain: "react-portfolio-dashboar-e6051.firebaseapp.com",
  projectId: "react-portfolio-dashboar-e6051",
  storageBucket: "react-portfolio-dashboar-e6051.appspot.com",
  messagingSenderId: "448113593790",
  appId: "1:448113593790:web:482a8e4d44e2018239fdef",
  measurementId: "G-2PGCN3PPEQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();

export default app;

export const db = getFirestore(app);
export const storage = getStorage(app);

