import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB9Mf388mne2M2tRebpICkSlosORPmhmMo",
  authDomain: "examination-portal-website.firebaseapp.com",
  databaseURL: "https://examination-portal-website-default-rtdb.firebaseio.com",
  projectId: "examination-portal-website",
  storageBucket: "examination-portal-website.firebasestorage.app",
  messagingSenderId: "314952623991",
  appId: "1:314952623991:web:0d0fe1313d46568f68a372"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);