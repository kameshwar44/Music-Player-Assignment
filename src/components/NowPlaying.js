import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Slider } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import RepeatIcon from '@mui/icons-material/Repeat';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import albumArt from '../assets/1.png';
import { Droppable } from 'react-beautiful-dnd';
import { useDroppable } from '@dnd-kit/core';
import { useLocalStorage } from '../hooks/useLocalStorage';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function NowPlaying({ currentSong, onPlay, onPause, onNext, onPrevious }) {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useLocalStorage('playerVolume', 1);
  const [isVolumeHovered, setIsVolumeHovered] = useState(false);
  
  const { setNodeRef, isOver } = useDroppable({
    id: 'player-droppable'
  });

  useEffect(() => {
    let interval;
    if (currentSong?.howl && currentSong.isPlaying) {
      interval = setInterval(() => {
        const seek = currentSong.howl.seek();
        const duration = currentSong.howl.duration();
        setProgress((seek / duration) * 100);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentSong]);

  useEffect(() => {
    if (currentSong?.howl) {
      currentSong.howl.volume(volume);
    }
  }, [currentSong, volume]);

  const handleProgressChange = (event, newValue) => {
    if (currentSong?.howl) {
      const duration = currentSong.howl.duration();
      const seekTime = (duration * newValue) / 100;
      currentSong.howl.seek(seekTime);
      setProgress(newValue);
    }
  };

  const handleVolumeChange = (event, newValue) => {
    if (currentSong?.howl) {
      const fadeTime = 100;
      const currentVolume = currentSong.howl.volume();
      const volumeDiff = newValue - currentVolume;
      const steps = 10;
      const stepTime = fadeTime / steps;
      const volumeStep = volumeDiff / steps;

      let currentStep = 0;
      const volumeInterval = setInterval(() => {
        currentStep++;
        const stepVolume = currentVolume + (volumeStep * currentStep);
        currentSong.howl.volume(stepVolume);
        
        if (currentStep >= steps) {
          clearInterval(volumeInterval);
          currentSong.howl.volume(newValue);
          setVolume(newValue);
        }
      }, stepTime);
    }
  };

  if (!currentSong) {
    return (
      <Box 
        ref={setNodeRef}
        className="empty-player"
        data-droppable={isOver}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: '240px',
          margin: '0 auto',
          padding: '0px',
          paddingTop: '20px',
          paddingBottom: '20px',
          paddingLeft: '0px',
        }}
      >
        <CloudUploadIcon className="drag-icon" />
        <Typography variant="h6" sx={{ 
          fontWeight: 500,
          color: isOver ? '#ff4444' : 'rgba(255,255,255,0.8)'
        }}>
          {isOver ? 'Drop to Play' : 'No song playing'}
        </Typography>
        <Typography variant="body2" sx={{ 
          opacity: 0.7,
          maxWidth: '80%',
          textAlign: 'center'
        }}>
          {isOver ? 'Release to start playing' : 'Drag a song here to play'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box 
      ref={setNodeRef}
      className="now-playing"
    >
      <Typography variant="subtitle2" sx={{ 
        mb: 3, 
        fontWeight: 500,
        letterSpacing: '1px',
        textTransform: 'uppercase'
      }}>
        Now Playing
      </Typography>
      
      <Box className="album-art" sx={{ position: 'relative' }}>
        <img 
          src={currentSong.image} 
          alt={currentSong.title}
          style={{
            width: '100%',
            height: 'auto',
            borderRadius: '15px'
          }}
        />
        <Box className="play-overlay" sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.3)',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          borderRadius: '15px',
          '&:hover': {
            opacity: 1
          }
        }}>
          <IconButton 
            onClick={currentSong.isPlaying ? onPause : onPlay}
            sx={{ 
              background: 'rgba(255,68,68,0.9)',
              '&:hover': {
                background: '#ff4444'
              }
            }}
          >
            {currentSong.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </IconButton>
        </Box>
      </Box>

      <Box className="song-info" sx={{ mt: 2 }}>
        <Typography className="song-title" variant="h6" noWrap>
          {currentSong.title}
        </Typography>
        <Typography className="song-artist" variant="subtitle2" sx={{ opacity: 0.7 }} noWrap>
          {currentSong.artist}
        </Typography>
      </Box>

      <Box className="progress-slider">
        <Slider
          value={progress}
          onChange={handleProgressChange}
          sx={{
            color: '#ff4444',
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 0 0 8px rgba(255, 68, 68, 0.16)'
              }
            }
          }}
        />
        <Box className="time-display">
          <Typography variant="caption">
            {formatTime(currentSong.howl?.seek() || 0)}
          </Typography>
          <Typography variant="caption">
            {formatTime(currentSong.howl?.duration() || 0)}
          </Typography>
        </Box>
      </Box>

      <Box className="player-controls">
        <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          <ShuffleIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <IconButton onClick={onPrevious}>
          <SkipPreviousIcon />
        </IconButton>
        <IconButton 
          className="play-pause"
          onClick={currentSong.isPlaying ? onPause : onPlay}
        >
          {currentSong.isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton onClick={onNext}>
          <SkipNextIcon />
        </IconButton>
        <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)' }}>
          <RepeatIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>

      <Box className="volume-control">
        <VolumeUpIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
        <Slider
          value={volume}
          onChange={handleVolumeChange}
          min={0}
          max={1}
          step={0.01}
          sx={{
            color: '#ff4444',
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
              '&:hover': {
                boxShadow: '0 0 0 8px rgba(255, 68, 68, 0.16)'
              }
            }
          }}
        />
      </Box>
    </Box>
  );
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default NowPlaying;