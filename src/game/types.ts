export type Phase = 'lobby' | 'playing' | 'results';

export type Room = {
  id: string; // 'default'
  phase: Phase;
  ownerId: string | null;
  level: number;
  maxLevel: number;
  seed: string | null;
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
};

export type PlayerPublic = {
  id: string;
  displayName: string;
  joinedAt: number;
  lastActive: number;
  handCount: number;
  isReady: boolean;
};

export type Action =
  | { id: string; type: 'deal'; level: number; playerOrder: string[]; seed: string; ts: number }
  | { id: string; type: 'play'; playerId: string; card: number; ts: number }
  | { id: string; type: 'burn'; playerId: string; card: number; causePlayId: string; ts: number }
  | { id: string; type: 'shuriken'; playerId: string; ts: number }
  | { id: string; type: 'advance'; level: number; playerId: string; ts: number }
  | { id: string; type: 'reset'; playerId: string; ts: number };

export type DerivedGameState = {
  pile: { card: number; playId: string; mistake: boolean }[];
  burned: Record<string, number[]>; // by playerId
  remainingCounts: Record<string, number>;
  livesStart: number;
  shurikensStart: number;
  mistakes: number; // lives lost
  levelComplete: boolean;
};


