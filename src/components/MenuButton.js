import React from 'react';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function MenuButton({ onClick }) {
  return (
    <IconButton
      className="menu-button"
      onClick={onClick}
      sx={{
        color: '#fff',
        '&:hover': {
          background: 'rgba(255, 68, 68, 1)'
        }
      }}
    >
      <MenuIcon />
    </IconButton>
  );
}

export default MenuButton; 