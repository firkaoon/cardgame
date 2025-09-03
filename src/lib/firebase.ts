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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
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


