// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBw7hIzJe1Y7xekhjxMK0kRQo-qZ-6PAg4",
  authDomain: "trx-app-aacde.firebaseapp.com",
  projectId: "trx-app-aacde",
  storageBucket: "trx-app-aacde.appspot.com",
  messagingSenderId: "897540290771",
  appId: "1:897540290771:web:7aa892a2d4b41223ae3c26"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };