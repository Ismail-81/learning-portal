// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCsbWkjwjSwJOgzYBVNIw0eH6ELij9o5b0",
  authDomain: "codelearn-1a663.firebaseapp.com",
  projectId: "codelearn-1a663",
  storageBucket: "codelearn-1a663.firebasestorage.app",
  messagingSenderId: "878772365008",
  appId: "1:878772365008:web:10a636c0ef6a29e5e720d5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);


export default app;