import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAwYBp3VADHKja2o87wUbIM86qVTqqD0OU",
  authDomain: "wegojim-86769.firebaseapp.com",
  projectId: "wegojim-86769",
  storageBucket: "wegojim-86769.appspot.com",
  messagingSenderId: "203026065494",
  appId: "1:203026065494:web:7e51f8b4078f4c7b1cf3f7",
  measurementId: "G-NCBKK196FB"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
const analytics = getAnalytics(app);