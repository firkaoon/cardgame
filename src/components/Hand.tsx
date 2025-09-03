import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoom } from '@/store/useRoom';
import { useAuth } from '@/store/useAuth';
import { privateHandDoc, actionsCol } from '@/lib/firebase';
import { addDoc, onSnapshot } from 'firebase/firestore';
import Card from './Card';
import type { Action } from '@/game/types';

export default function Hand() {
  const uid = useAuth((s) => s.uid)!;
  const [cards, setCards] = useState<number[]>([]);
  const { actions, playCard } = useRoom();

  useEffect(() => {
    return onSnapshot(privateHandDoc(uid), (snap) => 
      setCards((snap.data()?.cards as number[]) || [])
    );
  }, [uid]);

  // React to latest play by others: auto-burn any lower cards
  useEffect(() => {
    const lastPlay = [...actions].reverse().find((a) => a.type === 'play') as Extract<Action, { type: 'play' }> | undefined;
    if (!lastPlay || lastPlay.playerId === uid) return;
    
    const lower = cards.filter((c) => c < lastPlay.card);
    if (lower.length === 0) return;
    
    // emit burn events (one per card)
    lower.forEach(async (c) => {
      await addDoc(actionsCol(), { 
        type: 'burn', 
        playerId: uid, 
        card: c, 
        causePlayId: lastPlay.id, 
        ts: Date.now() 
      });
    });
    
    // remove burned locally (UI will sync from doc update once we rewrite hand)
    setCards((prev) => prev.filter((c) => c >= lastPlay.card));
  }, [actions, uid, cards]);

  const handlePlayCard = async (card: number) => {
    await playCard(card);
  };

  const sortedCards = [...cards].sort((a, b) => a - b);

  return (
    <div className="flex gap-2 justify-center items-end p-4 min-h-[120px]">
      <AnimatePresence>
        {sortedCards.map((card, index) => (
          <motion.div
            key={card}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 200
            }}
            style={{ zIndex: sortedCards.length - index }}
          >
            <Card
              value={card}
              onClick={() => handlePlayCard(card)}
              className="transform hover:-translate-y-2"
            />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {sortedCards.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-white/50 text-center py-8"
        >
          <p className="text-lg">Kartlarınız bitti!</p>
          <p className="text-sm">Diğer oyuncuları bekleyin...</p>
        </motion.div>
      )}
    </div>
  );
}
