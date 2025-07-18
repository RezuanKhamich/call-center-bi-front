import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import Logo from '../assets/logo.svg';
import ModalConfirm from '../features/ModalConfim';

const menuItems = [
  { text: 'Дашборд', icon: <DashboardIcon />, path: '/moderator/dashboard' },
  { text: 'Отчёты', icon: <AssignmentIcon />, path: '/moderator/reports' },
  { text: 'История', icon: <HistoryIcon />, path: '/moderator/history' },
  { text: 'Выйти', icon: <LogoutIcon />, path: '/login' },
];

const Sidebar = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleClick = (path) => {
    if (path === '/login') {
      setShowLogoutModal(true);
    } else {
      navigate(path);
    }
  };

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        backgroundColor: '#f5f5f5',
        borderRight: '1px solid #ddd',
        position: 'fixed',
        top: 0,
        left: 0,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box sx={{ p: 2, textAlign: 'center', borderBottom: '1px solid #ccc' }}>
        <img src={Logo} alt="Logo" style={{ width: 80, height: 80, marginBottom: 8 }} />
        <Typography variant="h6" fontWeight="bold">
          ЦОЗМАИТ КБР
        </Typography>
      </Box>

      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => handleClick(item.path)}
            selected={location.pathname === item.path}
            sx={{
              flexDirection: 'row',
              '&.Mui-selected': {
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
              },
              '&:hover': {
                backgroundColor: '#e3f2fd',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
      {showLogoutModal && (
        <ModalConfirm
          text="Вы уверены, что хотите выйти?"
          confirmLabel="Выйти"
          color="#d32f2f"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </Box>
  );
};

export default Sidebar;
