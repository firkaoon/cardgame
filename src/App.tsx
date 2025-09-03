import { useEffect } from 'react';
import { useAuth } from '@/store/useAuth';
import { useRoom } from '@/store/useRoom';
import { initPresence } from '@/store/usePresence';
import Lobby from '@/components/Lobby';
import GameBoard from '@/components/GameBoard';
import Hand from '@/components/Hand';
import TopBar from '@/components/TopBar';

export default function App() {
  const { uid } = useAuth();
  const { room, subscribe } = useRoom();

  useEffect(() => {
    if (uid) {
      initPresence();
      subscribe();
    }
  }, [uid, subscribe]);

  if (!uid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Bağlanıyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar - only show during game */}
      {room?.phase === 'playing' && <TopBar />}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {room?.phase === 'lobby' && <Lobby />}
        {room?.phase === 'playing' && (
          <>
            <GameBoard />
            <Hand />
          </>
        )}
        {room?.phase === 'results' && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Oyun Bitti!</h2>
              <p>Sonuçlar yakında...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


