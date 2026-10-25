import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAiIPuaLlkLyYN0uS0C01uAW3g00OMm8Wg",
  authDomain: "califnco-app-21278.firebaseapp.com",
  projectId: "califnco-app-21278",
  storageBucket: "califnco-app-21278.firebasestorage.app",
  messagingSenderId: "295930372249",
  appId: "1:295930372249:web:64b190d9b3809055a79808",
  measurementId: "G-44GEK85DVH"
};

const app = initializeApp(firebaseConfig);
export const authInstance = getAuth(app);
export const db = getFirestore(app);
