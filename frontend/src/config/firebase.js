import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1WzDDBc-dHYjjZlZOuZyT7l2ehW0Gpz8",
  authDomain: "e-score-app-baa27.firebaseapp.com",
  projectId: "e-score-app-baa27",
  storageBucket: "e-score-app-baa27.firebasestorage.app",
  messagingSenderId: "318650032850",
  appId: "1:318650032850:web:619d1d3579cc5b26ea830b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);