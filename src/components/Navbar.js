import React from 'react';
import { Box, Typography, InputBase } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Logo from './Logo';

function Navbar() {
  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      padding: '20px 30px',
      gap: 3,
      background: 'transparent'
    }}>
    
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 3
      }}>
        <Typography 
          sx={{ 
            color: '#ff4444',
            fontSize: '15px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          Music
        </Typography>
        <Typography 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '15px',
            cursor: 'pointer'
          }}
        >
          Podcast
        </Typography>
        <Typography 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '15px',
            cursor: 'pointer'
          }}
        >
          Live
        </Typography>
        <Typography 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '15px',
            cursor: 'pointer'
          }}
        >
          Radio
        </Typography>
      </Box>

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '30px',
        padding: '10px 20px',
        flex: 1,
        maxWidth: '400px',
        marginLeft: 'auto'
      }}>
        <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.7)', mr: 1 }} />
        <InputBase
          placeholder="Michael Jackson"
          sx={{ 
            color: 'white',
            flex: 1,
            '& input::placeholder': {
              color: 'rgba(255, 255, 255, 0.7)',
              opacity: 1
            }
          }}
          fullWidth
        />
      </Box>
    </Box>
  );
}

export default Navbar; 