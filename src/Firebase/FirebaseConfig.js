import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";  // Import Auth
import { GoogleAuthProvider } from "firebase/auth";  // Import GoogleAuthProvider

const firebaseConfig = {
  apiKey: "AIzaSyBx2aAzWoLxZbIAtJuVr-I1f2oiWwCVZJU",
  authDomain: "amantiwari-movie.firebaseapp.com",
  projectId: "amantiwari-movie",
  storageBucket: "amantiwari-movie.firebasestorage.app",
  messagingSenderId: "960228805957",
  appId: "1:960228805957:web:fded66981d11afb5f5022c",
  measurementId: "G-7NMHK4BLKF"
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(FirebaseApp);

// Initialize Authentication and Google Auth Provider
export const auth = getAuth(FirebaseApp);
export const googleProvider = new GoogleAuthProvider();

// Initialize Analytics (optional, for tracking user behavior)
const analytics = getAnalytics(FirebaseApp);
