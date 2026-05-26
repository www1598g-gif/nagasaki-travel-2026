// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// 👇 下面這一串要換成你剛剛在 Firebase 網站上申請的喔！
// Your web app's Firebase configuration
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCYjJymGsrS_DWnndUR6MY2KUSmjXE-N7A",
  authDomain: "chiangmai-2026.firebaseapp.com",
  databaseURL: "https://chiangmai-2026-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chiangmai-2026",
  storageBucket: "chiangmai-2026.firebasestorage.app",
  messagingSenderId: "515846045286",
  appId: "1:515846045286:web:dec91f8868d5cdece5b7a7"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
