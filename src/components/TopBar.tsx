import { motion } from 'framer-motion';
import { useRoom } from '@/store/useRoom';
import { Button } from '@/components/ui/button';
import { Heart, Zap, RotateCcw, LogOut } from 'lucide-react';
import { buildDerivedState } from '@/game/reducer';

export default function TopBar() {
  const { room, players, actions, useShuriken, resetGame } = useRoom();


  if (!room || room.phase !== 'playing') {
    return null;
  }

  const derivedState = buildDerivedState(
    actions,
    players.map(p => p.id),
    room.level,
    players.length
  );

  const { mistakes, livesStart, shurikensStart } = derivedState;
  const remainingLives = livesStart - mistakes;
  const remainingShurikens = shurikensStart; // TODO: Track shuriken usage

  const handleShuriken = async () => {
    await useShuriken();
  };

  const handleReset = async () => {
    await resetGame();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur border-b border-white/10"
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Side - Game Info */}
        <div className="flex items-center gap-6">
          <div className="text-white">
            <div className="text-lg font-bold">Seviye {room.level}</div>
            <div className="text-sm opacity-70">Maksimum: {room.maxLevel}</div>
          </div>

          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            <span className="text-white font-medium">
              {remainingLives}/{livesStart}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="text-white font-medium">
              {remainingShurikens}/{shurikensStart}
            </span>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center gap-3">
          <Button
            onClick={handleShuriken}
            disabled={remainingShurikens <= 0}
            variant="outline"
            size="sm"
            className="text-yellow-400 border-yellow-400/50 hover:bg-yellow-400/20"
          >
            <Zap className="w-4 h-4 mr-2" />
            Shuriken
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="text-white border-white/50 hover:bg-white/20"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Sıfırla
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Çık
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-white/10">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${(room.level / room.maxLevel) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </motion.div>
  );
}
