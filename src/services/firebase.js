// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAhuwew7cmD3SpmesBnVhos4wYrbmDhwVw",
  authDomain: "project-cost-tracker-298f5.firebaseapp.com",
  projectId: "project-cost-tracker-298f5",
  storageBucket: "project-cost-tracker-298f5.appspot.com",
  messagingSenderId: "345160409176",
  appId: "1:345160409176:android:bca7be1ec069d390076a2d"  // Android App ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
