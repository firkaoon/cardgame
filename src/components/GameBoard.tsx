import { motion, AnimatePresence } from 'framer-motion';
import { useRoom } from '@/store/useRoom';
import { buildDerivedState } from '@/game/reducer';
import Card from './Card';

export default function GameBoard() {
  const { room, players, actions } = useRoom();


  if (!room || room.phase !== 'playing') {
    return null;
  }

  const derivedState = buildDerivedState(
    actions,
    players.map(p => p.id),
    room.level,
    players.length
  );

  const { pile } = derivedState;

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      {/* Center Pile */}
      <div className="relative">
        <motion.div
          className="w-32 h-48 rounded-3xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur border border-white/30 flex items-center justify-center"
          animate={{
            boxShadow: [
              "0 0 20px rgba(59, 130, 246, 0.3)",
              "0 0 40px rgba(59, 130, 246, 0.6)",
              "0 0 20px rgba(59, 130, 246, 0.3)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="text-white/70 text-sm font-medium">
            Merkez Yığını
          </div>
        </motion.div>

        {/* Played Cards Stack */}
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence>
            {pile.map((playedCard, index) => (
              <motion.div
                key={playedCard.playId}
                className="absolute"
                initial={{ 
                  opacity: 0, 
                  scale: 0.8, 
                  y: 100,
                  rotate: Math.random() * 20 - 10
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  y: 0,
                  rotate: 0
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.8, 
                  y: -50 
                }}
                transition={{ 
                  duration: 0.5,
                  type: "spring",
                  stiffness: 200
                }}
                style={{
                  zIndex: index + 1,
                  transform: `translateY(${index * -2}px) rotate(${index * 2}deg)`
                }}
              >
                <Card
                  value={playedCard.card}
                  className={cn(
                    "w-12 h-18 text-lg",
                    playedCard.mistake && "ring-2 ring-red-500 animate-pulse"
                  )}
                  disabled
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Game Info */}
      <div className="mt-8 text-center text-white">
        <div className="text-2xl font-bold mb-2">Seviye {room.level}</div>
        <div className="text-sm opacity-70">
          {pile.length} kart oynandı • {derivedState.mistakes} hata
        </div>
      </div>

      {/* Mistake Indicator */}
      {derivedState.mistakes > 0 && (
        <motion.div
          className="mt-4 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <div className="text-red-300 text-sm font-medium">
            ⚠️ {derivedState.mistakes} hata yapıldı!
          </div>
        </motion.div>
      )}
    </div>
  );
}

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}
