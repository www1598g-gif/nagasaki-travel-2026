// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// 👇 下面這一串要換成你剛剛在 Firebase 網站上申請的喔！
// Your web app's Firebase configuration
// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyD83tQLQOKT6Mom6mIBFIIQUWhjZzgIN5Q",
  authDomain: "nagasaki-2026.firebaseapp.com",
  databaseURL: "https://nagasaki-2026-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nagasaki-2026",
  storageBucket: "nagasaki-2026.firebasestorage.app",
  messagingSenderId: "745050256149",
  appId: "1:745050256149:web:eb312690e754c61a50ef1c"
};


const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
