import { describe, it, expect } from 'vitest';
import { buildDerivedState } from '@/game/reducer';
import type { Action } from '@/game/types';

describe('derived state', () => {
  it('counts a mistake when a play causes burns', () => {
    const actions = [
      { id: 'd1', type: 'deal', level: 1, playerOrder: ['a', 'b'], seed: 's', ts: 1 },
      { id: 'p1', type: 'play', playerId: 'a', card: 50, ts: 2 },
      { id: 'b1', type: 'burn', playerId: 'b', card: 30, causePlayId: 'p1', ts: 3 },
    ] as Action[];
    
    const state = buildDerivedState(actions, ['a', 'b'], 1, 2);
    expect(state.mistakes).toBe(1);
    expect(state.pile[0].mistake).toBe(true);
  });

  it('handles multiple burns from same play', () => {
    const actions = [
      { id: 'd1', type: 'deal', level: 2, playerOrder: ['a', 'b'], seed: 's', ts: 1 },
      { id: 'p1', type: 'play', playerId: 'a', card: 50, ts: 2 },
      { id: 'b1', type: 'burn', playerId: 'b', card: 30, causePlayId: 'p1', ts: 3 },
      { id: 'b2', type: 'burn', playerId: 'b', card: 25, causePlayId: 'p1', ts: 4 },
    ] as Action[];
    
    const state = buildDerivedState(actions, ['a', 'b'], 2, 2);
    expect(state.mistakes).toBe(1); // One mistake for the play that caused burns
    expect(state.pile[0].mistake).toBe(true);
    expect(state.burned['b']).toEqual([30, 25]);
  });

  it('tracks remaining cards correctly', () => {
    const actions = [
      { id: 'd1', type: 'deal', level: 2, playerOrder: ['a', 'b'], seed: 's', ts: 1 },
      { id: 'p1', type: 'play', playerId: 'a', card: 50, ts: 2 },
      { id: 'p2', type: 'play', playerId: 'b', card: 60, ts: 3 },
    ] as Action[];
    
    const state = buildDerivedState(actions, ['a', 'b'], 2, 2);
    expect(state.remainingCounts['a']).toBe(1);
    expect(state.remainingCounts['b']).toBe(1);
  });

  it('detects level completion', () => {
    const actions = [
      { id: 'd1', type: 'deal', level: 1, playerOrder: ['a', 'b'], seed: 's', ts: 1 },
      { id: 'p1', type: 'play', playerId: 'a', card: 50, ts: 2 },
      { id: 'p2', type: 'play', playerId: 'b', card: 60, ts: 3 },
    ] as Action[];
    
    const state = buildDerivedState(actions, ['a', 'b'], 1, 2);
    expect(state.levelComplete).toBe(true);
  });
});


