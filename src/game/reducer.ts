import type { Action, DerivedGameState } from './types';

export function buildDerivedState(
  actions: Action[],
  playerIds: string[],
  level: number,
  playersCount: number
): DerivedGameState {
  const pile: DerivedGameState['pile'] = [];
  const burned: Record<string, number[]> = {};
  const remainingCounts: Record<string, number> = {};
  playerIds.forEach((id) => ((burned[id] = []), (remainingCounts[id] = 0)));

  // Count dealt per player from latest `deal`
  const lastDeal = [...actions].reverse().find((a) => a.type === 'deal') as
    | Extract<Action, { type: 'deal' }>
    | undefined;
  if (lastDeal) {
    lastDeal.playerOrder.forEach((pid) => (remainingCounts[pid] = level));
  }

  // Sort actions by ts ascending (serverTimestamp -> number on client snapshot)
  const acts = [...actions].sort((a, b) => a.ts - b.ts);

  const burnsByPlay: Record<string, number> = {};

  for (const a of acts) {
    if (a.type === 'play') {
      pile.push({ card: a.card, playId: a.id, mistake: false });
      remainingCounts[a.playerId] = Math.max(0, (remainingCounts[a.playerId] || 0) - 1);
    } else if (a.type === 'burn') {
      burned[a.playerId].push(a.card);
      // Link to play for mistake detection
      burnsByPlay[a.causePlayId] = (burnsByPlay[a.causePlayId] || 0) + 1;
      remainingCounts[a.playerId] = Math.max(0, (remainingCounts[a.playerId] || 0) - 1);
    }
    // shuriken/advance/reset have no direct effect here (UI reacts separately)
  }

  let mistakes = 0;
  for (const p of pile) {
    if (burnsByPlay[p.playId] > 0) {
      p.mistake = true;
      mistakes++;
    }
  }

  const totalRemaining = Object.values(remainingCounts).reduce((a, b) => a + b, 0);
  const levelComplete = totalRemaining === 0;

  return {
    pile,
    burned,
    remainingCounts,
    livesStart: Math.max(2, Math.min(playersCount, 4)),
    shurikensStart: 1,
    mistakes,
    levelComplete,
  };
}


