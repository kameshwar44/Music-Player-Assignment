import React, { useState, useEffect } from 'react';
import { Box, InputBase, Typography, IconButton, Alert, Snackbar } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import VerifiedIcon from '@mui/icons-material/Verified';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { Howl } from 'howler';
import bgImage from '../assets/bgimg.png';
import artistImage from '../assets/mic.png';
import michaelJacksonImage from '../assets/images/smoothcriminal.jpg';

// Import song images
import billieJeanImg from '../assets/images/billiejean.jpg';
import beatItImg from '../assets/images/beatit.jpg';
import smoothCriminalImg from '../assets/images/smoothcriminal.jpg';
import lejas from '../assets/images/Leja.jpg';
import befikra from '../assets/images/befikar.jpg';
// Import audio files
import billieJean from '../assets/audio/billiejean.mp3';
import beatIt from '../assets/audio/beatit.mp3';
import smoothCriminal from '../assets/audio/smoothcriminal.mp3';
import leja from '../assets/audio/leja.mp3';
import befikrasong from '../assets/audio/Befikra.mp3';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  restrictToVerticalAxis,
  restrictToWindowEdges
} from '@dnd-kit/modifiers';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Navbar from './Navbar';

// Create a SortableItem component
function SortableItem({ song, index, currentSong, setCurrentSong, playSong }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: song.id,
    data: {
      type: 'song',
      song: song
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 999 : 1,
    touchAction: 'none'
  };

  const isPlaying = currentSong?.id === song.id;

  return (
    <Box
      ref={setNodeRef}
      style={style}
      className="song-item"
      data-id={song.id}
      data-playing={isPlaying}
      data-dragging={isDragging}
      sx={{
        background: isPlaying 
          ? 'rgba(255, 0, 0, 0.15)' 
          : 'transparent',
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        borderRadius: '8px',
        transition: 'all 0.3s ease',
        cursor: 'grab',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.1)',
          transform: 'translateX(5px)'
        },
        '&:active': {
          cursor: 'grabbing'
        },
        '&[data-dragging="true"]': {
          background: 'rgba(255, 68, 68, 0.15)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
          transform: 'scale(1.02)',
          border: '1px solid rgba(255, 68, 68, 0.3)',
          '& .drag-indicator': {
            color: '#ff4444'
          }
        }
      }}
      {...attributes}
      {...listeners}
    >
      <Box 
        sx={{ 
          mr: 2,
          cursor: 'grab',
          '&:active': {
            cursor: 'grabbing'
          }
        }}
      >
        <DragIndicatorIcon 
          className="drag-indicator"
          sx={{ 
            color: 'rgba(255, 255, 255, 0.5)',
            transition: 'color 0.3s ease'
          }} 
        />
      </Box>

      <Typography sx={{ color: '#fff', width: '40px' }}>
        {index + 1}
      </Typography>

      <Box 
        onClick={() => playSong(song)}
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          flex: 1,
          cursor: 'pointer'
        }}
      >
        <Box sx={{ position: 'relative', mr: 2 }}>
          <img 
            src={song.image} 
            alt={song.title}
            style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '4px',
              objectFit: 'cover'
            }}
          />
          {currentSong?.id === song.id && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0,0,0,0.5)'
              }}
            >
              <IconButton 
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  if (currentSong.isPlaying) {
                    currentSong.howl.pause();
                    setCurrentSong({ ...currentSong, isPlaying: false });
                  } else {
                    currentSong.howl.play();
                    setCurrentSong({ ...currentSong, isPlaying: true });
                  }
                }}
              >
                {currentSong.isPlaying ? (
                  <PauseIcon sx={{ color: '#fff', fontSize: 20 }} />
                ) : (
                  <PlayArrowIcon sx={{ color: '#fff', fontSize: 20 }} />
                )}
              </IconButton>
            </Box>
          )}
        </Box>
        <Typography sx={{ color: '#fff' }}>
          {song.title}
        </Typography>
      </Box>

      <Typography sx={{ color: '#fff', opacity: 0.7, width: '150px' }}>
        {song.plays}
      </Typography>

      <Typography sx={{ color: '#fff', opacity: 0.7, width: '80px' }}>
        {song.duration}
      </Typography>

      <Typography sx={{ color: '#fff', opacity: 0.7 }}>
        {song.album}
      </Typography>
    </Box>
  );
}

function MainContent({ currentSong, setCurrentSong, onPlaySongInit }) {
  const [songs, setSongs] = useState([
    { 
      id: 1, 
      title: 'Leja',
      artist: 'Lil Nas X',
      plays: '1,040,811,084',
      duration: '4:53',
      album: 'Thriller 25 Super Deluxe',
      url: leja,
      image: lejas
    },
    { 
      id: 2, 
      title: 'Beat It',
      artist: 'Michael Jackson',
      plays: '643,786,045',
      duration: '4:18',
      album: 'Thriller 25 Super Deluxe',
      url: befikrasong,
      image: befikra
    },
    { 
      id: 3, 
      title: 'Smooth Criminal',
      artist: 'Michael Jackson',
      plays: '407,234,004',
      duration: '4:17',
      album: 'Thriller 25 Super Deluxe',
      url: smoothCriminal,
      image: smoothCriminalImg
    },
    { 
      id: 4, 
      title: 'Leja',
      artist: 'Lil Nas X',
      plays: '407,234,004',
      duration: '4:17',
      album: 'Thriller 25 Super Deluxe',
      url: leja,
      image: lejas
    },
    { 
      id: 5, 
      title: 'Billie Jean',
      artist: 'Michael Jackson',
      plays: '892,345,678',
      duration: '4:54',
      album: 'Thriller',
      url: befikrasong,
      image: befikra
    },
    { 
      id: 6, 
      title: 'Thriller',
      artist: 'Michael Jackson',
      plays: '756,123,890',
      duration: '5:57',
      album: 'Thriller',
      url: smoothCriminal,
      image: smoothCriminalImg
    },
    { 
      id: 7, 
      title: 'Bad',
      artist: 'Michael Jackson',
      plays: '534,567,890',
      duration: '4:07',
      album: 'Bad',
      url: beatIt,
      image: beatItImg
    },
    { 
      id: 8, 
      title: 'The Way You Make Me Feel',
      artist: 'Michael Jackson',
      plays: '445,678,901',
      duration: '4:59',
      album: 'Bad',
      url: leja,
      image: lejas
    },
    { 
      id: 9, 
      title: 'Man in the Mirror',
      artist: 'Michael Jackson',
      plays: '389,012,345',
      duration: '5:19',
      album: 'Bad',
      url: smoothCriminal,
      image: smoothCriminalImg
    },
    { 
      id: 10, 
      title: 'Black or White',
      artist: 'Michael Jackson',
      plays: '367,890,123',
      duration: '4:16',
      album: 'Dangerous',
      url: beatIt,
      image: beatItImg
    },
    { 
      id: 11, 
      title: 'Remember the Time',
      artist: 'Michael Jackson',
      plays: '298,765,432',
      duration: '4:01',
      album: 'Dangerous',
      url: leja,
      image: lejas
    },
    { 
      id: 12, 
      title: 'Heal the World',
      artist: 'Michael Jackson',
      plays: '276,543,210',
      duration: '6:25',
      album: 'Dangerous',
      url: smoothCriminal,
      image: smoothCriminalImg
    },
    { 
      id: 13, 
      title: 'They Don\'t Care About Us',
      artist: 'Michael Jackson',
      plays: '265,432,109',
      duration: '4:44',
      album: 'HIStory',
      url: beatIt,
      image: beatItImg
    },
    { 
      id: 14, 
      title: 'Earth Song',
      artist: 'Michael Jackson',
      plays: '254,321,098',
      duration: '6:46',
      album: 'HIStory',
      url: leja,
      image: lejas
    }
  ]);

  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [artistImage, setArtistImage] = useState(null);

  // Update artist image when song changes
  useEffect(() => {
    if (currentSong) {
      setArtistImage(currentSong.image);
    }
  }, [currentSong]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    // If dropped on player
    if (over.id === 'player-droppable') {
      const songToPlay = songs.find(song => song.id === active.id);
      if (songToPlay) {
        playSong(songToPlay);
        return;
      }
    }

    // If reordering within list
    if (active.id !== over.id) {
      const oldIndex = songs.findIndex(song => song.id === active.id);
      const newIndex = songs.findIndex(song => song.id === over.id);
      
      const newSongs = [...songs];
      const [movedItem] = newSongs.splice(oldIndex, 1);
      newSongs.splice(newIndex, 0, movedItem);
      
      setSongs(newSongs);
    }
  };

  const playSong = async (song) => {
    if (!song) return;
    
    try {
      // First, stop and unload any currently playing song
      if (currentSong?.howl) {
        currentSong.howl.stop();
        currentSong.howl.unload();
        setCurrentSong(null); // Clear current song state
      }

      // Wait a brief moment to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 50));

      // Create new Howl instance for the selected song
      const howl = new Howl({
        src: [song.url],
        html5: true,
        volume: 1,
        preload: true, // Ensure audio is preloaded
        onload: () => {
          console.log(`${song.title} loaded successfully`);
        },
        onloaderror: (id, err) => {
          console.error('Error loading song:', err);
          setError(`Error loading ${song.title}`);
        },
        onplay: () => {
          // Only update state if this is the current song
          if (!currentSong || currentSong.id === song.id) {
            setCurrentSong({ ...song, howl, isPlaying: true });
          } else {
            howl.stop(); // Stop if another song has taken over
          }
        },
        onpause: () => {
          if (currentSong?.id === song.id) {
            setCurrentSong(prev => ({ ...prev, isPlaying: false }));
          }
        },
        onend: () => {
          howl.unload(); // Cleanup when song ends
          if (currentSong?.id === song.id) {
            setCurrentSong(prev => ({ ...prev, isPlaying: false }));
            // Play next song after a brief delay
            setTimeout(() => playAdjacentSong('next'), 50);
          }
        },
        onstop: () => {
          howl.unload(); // Cleanup when stopped
          if (currentSong?.id === song.id) {
            setCurrentSong(prev => ({ ...prev, isPlaying: false }));
          }
        }
      });

      // Wait for the howl to load before playing
      await new Promise((resolve, reject) => {
        howl.once('load', resolve);
        howl.once('loaderror', reject);
      });

      // Final check to ensure no other song has started playing
      if (!currentSong || currentSong.id === song.id) {
        howl.play();
      } else {
        howl.unload(); // Cleanup if another song has taken over
      }

    } catch (err) {
      console.error('Error playing song:', err);
      setError(`Error playing ${song?.title || 'unknown song'}`);
    }
  };

  // Add this new function to handle playing the next/previous song
  const playAdjacentSong = (direction) => {
    const currentIndex = songs.findIndex(song => song.id === currentSong?.id);
    if (currentIndex === -1) return;

    let nextIndex;
    if (direction === 'next') {
      nextIndex = currentIndex + 1 >= songs.length ? 0 : currentIndex + 1;
    } else {
      nextIndex = currentIndex - 1 < 0 ? songs.length - 1 : currentIndex - 1;
    }

    const songToPlay = songs[nextIndex];
    if (songToPlay) {
      playSong(songToPlay);
    }
  };

  // Add these functions to expose next/previous functionality
  useEffect(() => {
    if (onPlaySongInit) {
      onPlaySongInit({
        playSong,
        playNext: () => playAdjacentSong('next'),
        playPrevious: () => playAdjacentSong('previous')
      });
    }
  }, [onPlaySongInit, songs]);

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className="main-content" sx={{ 
      background: 'linear-gradient(to bottom, #1a0f0f, #000 , red)',
      height: '100vh',
      overflowY: 'auto'
    }}>
      <Navbar />
      <Box sx={{ 
        padding: '20px 30px',
        paddingBottom: '100px' // Add padding at bottom for better scroll
      }}>
        <Box className="artist-card" 
          sx={{ 
            background: 'linear-gradient(to right, rgba(68, 0, 0, 0.8), rgba(34, 0, 0, 0.8))',
            borderRadius: '24px',
            padding: '40px',
            mb: 4,
            position: 'relative',
            overflow: 'hidden',
            minHeight: '300px',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${bgImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.4
            }
          }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            position: 'relative',
            zIndex: 2
          }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <VerifiedIcon sx={{ color: '#1E88E5', fontSize: 20 }} />
                <Typography sx={{ color: '#fff', opacity: 0.8, fontSize: '14px' }}>
                  Verified Artist
                </Typography>
              </Box>
              <Typography variant="h1" sx={{ 
                mb: 2, 
                fontWeight: 'bold',
                fontSize: '48px',
                color: '#fff'
              }}>
                Michael Jackson
              </Typography>
              <Typography sx={{ color: '#fff', opacity: 0.8, fontSize: '14px' }}>
                27,852,501 monthly listeners
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '24px',
                height: '300px',
                width: '400px',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.02)'
                }
              }}
            >
              <img 
                src={michaelJacksonImage} 
                alt="Michael Jackson"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h6" sx={{ color: '#fff', fontWeight: 'bold' }}>
            Popular
          </Typography>
          <Typography 
            sx={{ 
              color: 'rgba(255,255,255,0.7)',
              fontSize: '14px',
              cursor: 'pointer',
              '&:hover': { color: '#fff' }
            }}
          >
            See All
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          px: 2,
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '14px',
          textTransform: 'uppercase'
        }}>
          <Typography sx={{ width: '40px' }}>#</Typography>
          <Typography sx={{ flex: 1, ml: 6 }}>TITLE</Typography>
          <Typography sx={{ width: '150px' }}>PLAYING</Typography>
          <Typography sx={{ width: '80px' }}>TIME</Typography>
          <Typography>ALBUM</Typography>
        </Box>

        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <SortableContext
            items={songs.map(song => song.id)}
            strategy={verticalListSortingStrategy}
          >
            {filteredSongs.map((song, index) => (
              <SortableItem
                key={song.id}
                song={song}
                index={index}
                currentSong={currentSong}
                setCurrentSong={setCurrentSong}
                playSong={playSong}
              />
            ))}
          </SortableContext>
        </Box>

        {filteredSongs.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4, 
            color: 'rgba(255, 255, 255, 0.7)'
          }}>
            <Typography>No songs found</Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default MainContent;