import { createContext, useContext, useState, useEffect } from 'react';

const QueueContext = createContext();

export const useQueue = () => {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within QueueProvider');
  }
  return context;
};

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isShuffled, setIsShuffled] = useState(false);
  const [originalQueue, setOriginalQueue] = useState([]);

  // Load queue from localStorage on mount
  useEffect(() => {
    const savedQueue = localStorage.getItem('musicQueue');
    const savedIndex = localStorage.getItem('queueIndex');
    if (savedQueue) {
      try {
        setQueue(JSON.parse(savedQueue));
        setCurrentIndex(savedIndex ? parseInt(savedIndex) : -1);
      } catch (e) {
        console.error('Failed to load queue:', e);
      }
    }
  }, []);

  // Save queue to localStorage whenever it changes
  useEffect(() => {
    if (queue.length > 0) {
      localStorage.setItem('musicQueue', JSON.stringify(queue));
      localStorage.setItem('queueIndex', currentIndex.toString());
    }
  }, [queue, currentIndex]);

  const addToQueue = (song) => {
    setQueue(prev => [...prev, song]);
    if (window.showToast) {
      window.showToast('✅ Added to queue', 'success');
    }
  };

  const addToQueueNext = (song) => {
    const newQueue = [...queue];
    newQueue.splice(currentIndex + 1, 0, song);
    setQueue(newQueue);
    if (window.showToast) {
      window.showToast('✅ Added to play next', 'success');
    }
  };

  const removeFromQueue = (index) => {
    const newQueue = queue.filter((_, i) => i !== index);
    setQueue(newQueue);
    if (index < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    }
    if (window.showToast) {
      window.showToast('Removed from queue', 'info');
    }
  };

  const clearQueue = () => {
    setQueue([]);
    setCurrentIndex(-1);
    setIsShuffled(false);
    setOriginalQueue([]);
    localStorage.removeItem('musicQueue');
    localStorage.removeItem('queueIndex');
    if (window.showToast) {
      window.showToast('Queue cleared', 'info');
    }
  };

  const playFromQueue = (index) => {
    setCurrentIndex(index);
    return queue[index];
  };

  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return queue[currentIndex + 1];
    }
    return null;
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      return queue[currentIndex - 1];
    }
    return null;
  };

  const shuffleQueue = () => {
    if (!isShuffled) {
      // Save original order
      setOriginalQueue([...queue]);
      
      // Shuffle
      const currentSong = queue[currentIndex];
      const otherSongs = queue.filter((_, i) => i !== currentIndex);
      const shuffled = otherSongs.sort(() => Math.random() - 0.5);
      
      // Put current song first
      const newQueue = currentSong ? [currentSong, ...shuffled] : shuffled;
      setQueue(newQueue);
      setCurrentIndex(0);
      setIsShuffled(true);
      
      if (window.showToast) {
        window.showToast('🔀 Shuffle enabled', 'success');
      }
    } else {
      // Restore original order
      setQueue(originalQueue);
      setIsShuffled(false);
      setOriginalQueue([]);
      
      if (window.showToast) {
        window.showToast('🔁 Shuffle disabled', 'info');
      }
    }
  };

  const moveInQueue = (fromIndex, toIndex) => {
    const newQueue = [...queue];
    const [movedItem] = newQueue.splice(fromIndex, 1);
    newQueue.splice(toIndex, 0, movedItem);
    setQueue(newQueue);
    
    // Adjust current index if needed
    if (fromIndex === currentIndex) {
      setCurrentIndex(toIndex);
    } else if (fromIndex < currentIndex && toIndex >= currentIndex) {
      setCurrentIndex(prev => prev - 1);
    } else if (fromIndex > currentIndex && toIndex <= currentIndex) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const replaceQueue = (songs, startIndex = 0) => {
    setQueue(songs);
    setCurrentIndex(startIndex);
    setIsShuffled(false);
    setOriginalQueue([]);
  };

  const value = {
    queue,
    currentIndex,
    isShuffled,
    addToQueue,
    addToQueueNext,
    removeFromQueue,
    clearQueue,
    playFromQueue,
    playNext,
    playPrevious,
    shuffleQueue,
    moveInQueue,
    replaceQueue,
    hasNext: currentIndex < queue.length - 1,
    hasPrevious: currentIndex > 0,
    currentSong: queue[currentIndex] || null
  };

  return (
    <QueueContext.Provider value={value}>
      {children}
    </QueueContext.Provider>
  );
};
