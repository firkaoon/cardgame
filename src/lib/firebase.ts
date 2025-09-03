import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  serverTimestamp,
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { getAuth, signInAnonymously, updateProfile, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBxIUX6Qr4Z1cKlUsXF-sf6dvAk47V2d2Q",
  authDomain: "card-5e01d.firebaseapp.com",
  projectId: "card-5e01d",
  storageBucket: "card-5e01d.firebasestorage.app",
  messagingSenderId: "83990315582",
  appId: "1:83990315582:web:f081a9df6657770ba1876f",
  measurementId: "G-32LQN9XJZQ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export function roomRef() {
  return doc(db, 'rooms', 'default');
}

export function playersCol() {
  return collection(roomRef(), 'players');
}

export function actionsCol() {
  return collection(roomRef(), 'actions');
}

export function privateHandDoc(uid: string) {
  return doc(db, 'rooms/default/private', uid, 'hand');
}

export const Fire = {
  serverTimestamp,
  roomRef,
  playersCol,
  actionsCol,
  privateHandDoc,
  onAuth: onAuthStateChanged,
  signIn: () => signInAnonymously(auth),
  updateProfile,
  addDoc,
  setDoc,
  updateDoc,
  getDoc,
  onSnapshot,
};


