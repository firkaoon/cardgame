import { motion } from 'framer-motion';
import { useRoom } from '@/store/useRoom';
import { useAuth } from '@/store/useAuth';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function Lobby() {
  const { room, players, startGame } = useRoom();
  const { uid, displayName, setDisplayName } = useAuth();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(displayName);

  const isOwner = room?.ownerId === uid;


  const handleStartGame = async () => {
    await startGame();
  };

  const handleNameSubmit = async () => {
    await setDisplayName(newName);
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setNewName(displayName);
    setIsEditingName(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4">The Mind</h1>
        <p className="text-white/70 text-lg">
          Birlikte düşünün, birlikte oynayın
        </p>
      </motion.div>

      {/* Player Name */}
      <div className="mb-8">
        {isEditingName ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="İsminizi girin"
              maxLength={20}
            />
            <Button onClick={handleNameSubmit} size="sm">
              Kaydet
            </Button>
            <Button onClick={handleNameCancel} variant="outline" size="sm">
              İptal
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="text-white text-lg">
              İsim: {displayName || 'Anonim'}
            </span>
            <Button 
              onClick={() => setIsEditingName(true)} 
              variant="ghost" 
              size="sm"
              className="text-white/70 hover:text-white"
            >
              Düzenle
            </Button>
          </div>
        )}
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 max-w-4xl">
        {players.map((player, index) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`
              p-4 rounded-xl backdrop-blur border transition-all
              ${player.id === uid 
                ? 'bg-blue-500/20 border-blue-400/50' 
                : 'bg-white/10 border-white/20'
              }
            `}
          >
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {player.displayName.charAt(0).toUpperCase()}
              </div>
              <div className="text-white font-medium truncate">
                {player.displayName || `Oyuncu ${player.id.slice(0, 4)}`}
              </div>
              <div className="text-white/50 text-sm">
                {player.isReady ? '✅ Hazır' : '⏳ Bekliyor'}
              </div>
              {player.id === room?.ownerId && (
                <div className="text-yellow-400 text-xs mt-1">👑 Lider</div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Start Game Button */}
      {isOwner && players.length >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Button 
            onClick={handleStartGame}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold px-8 py-3"
          >
            🎮 Oyunu Başlat ({players.length} oyuncu)
          </Button>
        </motion.div>
      )}

      {/* Waiting Message */}
      {!isOwner && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white/70"
        >
          <p>Lider oyunu başlatmayı bekliyor...</p>
          <p className="text-sm mt-2">En az 2 oyuncu gerekli</p>
        </motion.div>
      )}

      {/* Not Enough Players */}
      {isOwner && players.length < 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-white/70"
        >
          <p>Oyunu başlatmak için en az 2 oyuncu gerekli</p>
          <p className="text-sm mt-2">Şu anda {players.length} oyuncu var</p>
        </motion.div>
      )}
    </div>
  );
}
