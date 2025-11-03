import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  IconButton
} from '@mui/material';
import {
  PrivacyTip as PrivacyIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';
import './UserAvatar.css';

const getAvatarColor = (email: string): string => {
  const colors = [
    '#3a7068', '#2a5550', '#f44336', '#2196f3', 
    '#9c27b0', '#ff9800', '#009688'
  ];
  const hash = email.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return colors[hash % colors.length];
};

const UserAvatar = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const handlePrivacy = () => {
    handleMenuClose();
    navigate('/privacy');
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
  };

  return (
    <div className="user-avatar-container">
      <IconButton
        onClick={handleMenuOpen}
        size="medium"
        sx={{ p: 0.5 }}
        aria-label="Account menu"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar
          sx={{
            bgcolor: user ? getAvatarColor(user.email) : '#3a7068',
            width: 40,
            height: 40,
            fontSize: '1.1rem',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'scale(1.1)' }
          }}
        >
          {user ? user.email[0].toUpperCase() : <AccountIcon />}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        ref={menuRef}
        PaperProps={{
          sx: {
            width: 320,
            maxWidth: '95%',
            mt: 1.5,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            overflow: 'visible',
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* Current Account */}
        <Box px={2} py={1.5}>
          <Typography variant="subtitle2" color="text.secondary">
            Active Account
          </Typography>
        </Box>
        <MenuItem sx={{ 
          cursor: 'default', 
          '&:hover': { bgcolor: 'transparent' },
          py: 1.5
        }}>
          <Avatar
            sx={{
              bgcolor: user ? getAvatarColor(user.email) : '#3a7068',
              mr: 2,
              width: 44,
              height: 44
            }}
          >
            {user?.email[0].toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body1" fontWeight="medium">
              {user?.firstName || user?.email.split('@')[0]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
        </MenuItem>
        <Divider sx={{ my: 1 }} />

        {/* Menu Actions */}
        <MenuItem onClick={handlePrivacy} sx={{ py: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <PrivacyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Privacy & Security" />
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem 
          onClick={handleLogout} 
          sx={{ 
            py: 1.5,
            color: 'error.main',
            '&:hover': { bgcolor: 'error.light' }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </div>
  );
};

export default UserAvatar;