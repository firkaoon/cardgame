import { create } from 'zustand';
import { roomRef, actionsCol, playersCol, privateHandDoc } from '@/lib/firebase';
import { addDoc, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import { seedFromString, mulberry32 } from '@/lib/rng';
import { shuffle } from '@/lib/shuffle';
import type { Action, Room, PlayerPublic } from '@/game/types';
import { useAuth } from './useAuth';

type RoomState = {
  room: Room | null;
  players: PlayerPublic[];
  actions: Action[];
  subscribe: () => void;
  startGame: () => Promise<void>;
  dealLevel: (level: number, seed: string) => Promise<void>;
  playCard: (card: number) => Promise<void>;
  useShuriken: () => Promise<void>;
  advanceLevel: () => Promise<void>;
  resetGame: () => Promise<void>;
};

export const useRoom = create<RoomState>((set, get) => ({
  room: null,
  players: [],
  actions: [],
  
  subscribe() {
    onSnapshot(roomRef(), (snap) => 
      set({ room: { id: 'default', ...(snap.data() || {}) } as Room })
    );
    
    onSnapshot(playersCol(), (snap) => 
      set({ players: snap.docs.map((d) => d.data() as PlayerPublic) })
    );
    
    onSnapshot(actionsCol(), (snap) =>
      set({ actions: snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Action[] })
    );
  },

  async startGame() {
    const uid = useAuth.getState().uid!;
    const seed = crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
    await setDoc(roomRef(), {
      id: 'default',
      phase: 'playing',
      ownerId: uid,
      level: 1,
      maxLevel: 8,
      seed,
      createdAt: Date.now(),
      startedAt: Date.now(),
    }, { merge: true });
    await get().dealLevel(1, seed);
  },

  async dealLevel(level: number, seed: string) {
    const state = get();
    const players = state.players.map((p) => p.id);
    const deck = Array.from({ length: 100 }, (_, i) => i + 1);
    const r = mulberry32(seedFromString(seed));
    const shuffled = shuffle(deck, r);
    const hands: Record<string, number[]> = {};
    
    players.forEach((pid, idx) => {
      hands[pid] = shuffled.slice(idx * level, idx * level + level).sort((a, b) => a - b);
    });

    // write deal action
    await addDoc(actionsCol(), {
      type: 'deal',
      level,
      playerOrder: players,
      seed,
      ts: Date.now(),
    } as Omit<Action, 'id'>);

    // write each private hand and public handCount
    await Promise.all(
      players.map(async (pid) => {
        await setDoc(privateHandDoc(pid), { cards: hands[pid] });
        await updateDoc(doc(playersCol(), pid), { handCount: level });
      })
    );
  },

  async playCard(card: number) {
    const uid = useAuth.getState().uid!;
    const id = uuid();
    await addDoc(actionsCol(), { 
      id, 
      type: 'play', 
      playerId: uid, 
      card, 
      ts: Date.now() 
    } as Action);
  },

  async useShuriken() {
    const uid = useAuth.getState().uid!;
    await addDoc(actionsCol(), { 
      type: 'shuriken', 
      playerId: uid, 
      ts: Date.now() 
    } as Action);
  },

  async advanceLevel() {
    const uid = useAuth.getState().uid!;
    const room = get().room;
    if (!room) return;
    
    await addDoc(actionsCol(), { 
      type: 'advance', 
      level: room.level + 1, 
      playerId: uid, 
      ts: Date.now() 
    } as Action);
  },

  async resetGame() {
    const uid = useAuth.getState().uid!;
    await addDoc(actionsCol(), { 
      type: 'reset', 
      playerId: uid, 
      ts: Date.now() 
    } as Action);
  },
}));
