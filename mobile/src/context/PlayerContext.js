import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState([]);
  const [history, setHistory] = useState([]);
  const [showPlayer, setShowPlayer] = useState(false);

  const playSong = async (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    setShowPlayer(true);
    setHistory((prev) => [song, ...prev.slice(0, 49)]);
    // Track in backend history
    try {
      await api.post('/history', {
        youtube_video_id: song.videoId || song.youtube_video_id,
        title: song.title,
        thumbnail: song.thumbnail,
        channel: song.channelTitle || song.channel,
      });
    } catch (_) {}
  };

  const addToQueue = (song) => setQueue((prev) => [...prev, song]);

  const playNext = () => {
    if (queue.length > 0) {
      const [next, ...rest] = queue;
      setQueue(rest);
      playSong(next);
    }
  };

  const playPrevious = () => {
    if (history.length > 1) {
      const prev = history[1];
      setHistory((h) => h.slice(1));
      playSong(prev);
    }
  };

  const togglePlay = () => setIsPlaying((p) => !p);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        queue,
        showPlayer,
        playSong,
        addToQueue,
        playNext,
        playPrevious,
        togglePlay,
        setShowPlayer,
        setIsPlaying,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);
