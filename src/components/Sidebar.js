import { Box, Typography, IconButton, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import ExploreIcon from '@mui/icons-material/Explore';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import Logo from './Logo';
import { useState } from 'react';

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuContent = (
    <>
      <Box className="logo" sx={{ 
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <Logo />
        {mobileOpen && (
          <IconButton 
            onClick={handleDrawerToggle}
            sx={{ 
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'rgba(255,255,255,0.7)'
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Typography variant="subtitle2" sx={{ opacity: 0.7, mb: 2 }}>MENU</Typography>
      
      <Box className="menu-item">
        <HomeIcon />
        <span>Home</span>
      </Box>
      <Box className="menu-item">
        <TrendingUpIcon />
        <span>Trends</span>
      </Box>
      <Box className="menu-item">
        <LibraryMusicIcon />
        <span>Library</span>
      </Box>
      <Box className="menu-item">
        <ExploreIcon />
        <span>Discover</span>
      </Box>

      <Typography variant="subtitle2" sx={{ opacity: 0.7, mb: 2, mt: 4 }}>GENERAL</Typography>
      
      <Box className="menu-item">
        <SettingsIcon />
        <span>Settings</span>
      </Box>
      <Box className="menu-item">
        <LogoutIcon />
        <span>Log Out</span>
      </Box>
    </>
  );

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ 
          mr: 2, 
          display: { sm: 'none' },
          position: 'fixed',
          top: 10,
          left: 10,
          zIndex: 1200,
          background: 'rgba(255,68,68,0.9)',
          '&:hover': {
            background: 'rgba(255,68,68,1)'
          }
        }}
      >
        <MenuIcon />
      </IconButton>

      <Box
        component="nav"
        sx={{ 
          width: { sm: 250 },
          flexShrink: { sm: 0 },
          display: { xs: 'none', sm: 'block' }
        }}
      >
        {/* Regular sidebar for desktop */}
        <Box className="sidebar">
          {menuContent}
        </Box>
      </Box>

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 250,
            background: '#000000',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)'
          },
        }}
      >
        {menuContent}
      </Drawer>
    </>
  );
}

export default Sidebar; 