import { create } from 'zustand';
import { playersCol } from '@/lib/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { useAuth } from './useAuth';

export const usePresence = create(() => ({}));

export async function initPresence() {
  const uid = useAuth.getState().uid;
  if (!uid) return;
  const ref = doc(playersCol(), uid);
  await setDoc(
    ref,
    {
      id: uid,
      displayName: useAuth.getState().displayName || `Player-${uid.slice(0, 4)}`,
      joinedAt: Date.now(),
      lastActive: Date.now(),
      handCount: 0,
      isReady: false,
    },
    { merge: true }
  );
  const beat = async () => {
    await updateDoc(ref, { lastActive: Date.now() });
  };
  const interval = setInterval(beat, 25000);
  window.addEventListener('beforeunload', () => clearInterval(interval));
}
