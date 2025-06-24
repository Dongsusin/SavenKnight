import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBBFWJauvqTtXcLANwrxL5TWWO9W9jYrEM",
  authDomain: "sevenknight-1e2cd.firebaseapp.com",
  projectId: "sevenknight-1e2cd",
  storageBucket: "sevenknight-1e2cd.firebasestorage.app",
  messagingSenderId: "134171898610",
  appId: "1:134171898610:web:9534b516c89e78a696166b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
