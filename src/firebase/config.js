import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJm0JQFYYSg0YuqLsOhhX9vz5No2ttnlc",
  authDomain: "va-it-b8c54.firebaseapp.com",
  projectId: "va-it-b8c54",
  storageBucket: "va-it-b8c54.firebasestorage.app",
  messagingSenderId: "680193328095",
  appId: "1:680193328095:web:213ffaa0d7610e98b5ba6a",
  measurementId: "G-V69P7FVNL8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;


