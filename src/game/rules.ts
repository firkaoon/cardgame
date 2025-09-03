export const RULES = {
  livesStartByPlayers(players: number) {
    return Math.max(2, Math.min(players, 4));
  },
  shurikensStart: 1,
  maxLevelByPlayers(players: number) {
    if (players <= 2) return 12;
    if (players === 3) return 10;
    return 8; // 4+
  },
};


