import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Box } from '@mui/material';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import NowPlaying from './components/NowPlaying';
import './App.css';

function App() {
  const [currentSong, setCurrentSong] = useState(null);
  const [playerControls, setPlayerControls] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handlePlay = useCallback(() => {
    if (currentSong?.howl) {
      currentSong.howl.play();
      setCurrentSong({ ...currentSong, isPlaying: true });
    }
  }, [currentSong]);

  const handlePause = useCallback(() => {
    if (currentSong?.howl) {
      currentSong.howl.pause();
      setCurrentSong({ ...currentSong, isPlaying: false });
    }
  }, [currentSong]);

  const handleNext = useCallback(() => {
    if (playerControls?.playNext) {
      playerControls.playNext();
    }
  }, [playerControls]);

  const handlePrevious = useCallback(() => {
    if (playerControls?.playPrevious) {
      playerControls.playPrevious();
    }
  }, [playerControls]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    // If dropped on player
    if (over.id === 'player-droppable') {
      const songData = active.data.current;
      if (songData?.song && playerControls && typeof playerControls.playSong === 'function') {
        if (currentSong?.howl) {
          currentSong.howl.stop();
        }
        playerControls.playSong(songData.song);
      }
    }
  };

  const handlePlaySongInit = useCallback((controls) => {
    if (controls && typeof controls.playSong === 'function') {
      setPlayerControls(controls);
    }
  }, []);

  return (
    <Router>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <Box className="app-container">
          <Sidebar />
          <MainContent 
            currentSong={currentSong}
            setCurrentSong={setCurrentSong}
            onPlaySongInit={handlePlaySongInit}
          />
          <Box className="side-player">
            <NowPlaying
              currentSong={currentSong}
              onPlay={handlePlay}
              onPause={handlePause}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </Box>
        </Box>
      </DndContext>
    </Router>
  );
}

export default App;