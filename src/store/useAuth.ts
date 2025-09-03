import { create } from 'zustand';
import { auth, Fire } from '@/lib/firebase';

type AuthState = {
  uid: string | null;
  displayName: string;
  setDisplayName: (name: string) => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  uid: null,
  displayName: '',
  async setDisplayName(name) {
    const u = auth.currentUser;
    if (!u) return;
    await Fire.updateProfile(u, { displayName: name });
    set({ displayName: name });
  },
}));

Fire.onAuth(auth, async (user) => {
  if (!user) {
    await Fire.signIn();
  } else {
    useAuth.setState({ uid: user.uid, displayName: user.displayName || '' });
  }
});
