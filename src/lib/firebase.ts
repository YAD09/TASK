import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAMUmQH4W5W3J-OsKKUYD1w6EaxHyk4M5Y",
  authDomain: "vivid-flux-6xhgq.firebaseapp.com",
  projectId: "vivid-flux-6xhgq",
  storageBucket: "vivid-flux-6xhgq.firebasestorage.app",
  messagingSenderId: "304563299771",
  appId: "1:304563299771:web:d495a3d3ceb42d77e9509e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Use custom firestoreDatabaseId by passing it as the second argument to getFirestore
export const db = getFirestore(app, "ai-studio-af348c99-5e44-406a-b9d7-72c9d5d527a1");
