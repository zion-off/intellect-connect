import { initializeApp } from "firebase/app";
import {
  getFirestore,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

// firebase
const firebaseConfig = {
  apiKey: "AIzaSyAkQowwNkQhcbeiIQSbtjEvUP2vidHlXVc",
  authDomain: "intellect-connect.firebaseapp.com",
  projectId: "intellect-connect",
  storageBucket: "intellect-connect.appspot.com",
  messagingSenderId: "642561932840",
  appId: "1:642561932840:web:a4e47b26e96fbff78e3f1d"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);