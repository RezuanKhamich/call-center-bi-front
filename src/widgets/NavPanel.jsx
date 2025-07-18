import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import Logo from '../assets/logo.svg';
import ModalConfirm from '../features/ModalConfim';
import styled from 'styled-components';
import LogoImage from '../shared/LogoImage';
import { customColors } from '../app/theme';

const ListContainer = styled(List)`
  padding: 10px 10px !important;
  margin-top: 28px !important;
  display: flex;
  flex-direction: column;
  flex-grow: 0 !important;
  gap: 10px;
  font-weight: 600;
  color: gray;
`;

const ListButton = styled(ListItemButton)`
  flex-direction: row;
  color: #ffffff;
  border-radius: 20px !important;
  font-weight: 600;

  &.Mui-selected {
    background-color: ${customColors.primary.main} !important;
    border-radius: 20px;
    color: ${customColors.primary.white};
    & span {
      color: ${customColors.primary.white};
    }

    &:hover {
      background-color: ${customColors.primary.mainHover} !important;
      color: inherit;
      & span {
        color: inherit;
      }
    }
  }

  &:hover {
    border-radius: 20px;
    background-color: ${customColors.primary.mainHover} !important;
  }
`;

const menuItems = [
  { text: 'Дашборд', icon: <DashboardIcon />, path: '/moderator/dashboard' },
  { text: 'Отчёты', icon: <AssignmentIcon />, path: '/moderator/reports' },
  { text: 'История', icon: <HistoryIcon />, path: '/moderator/history' },
  { text: 'Выйти', icon: <LogoutIcon />, path: '/login' },
];

const NavPanel = () => {
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
        position: 'fixed',
        top: 0,
        left: 0,
        overflowY: 'auto',
        display: 'flex',
        backgroundColor: customColors.primary.white,
        flexDirection: 'column',
        boxShadow: customColors.boxShadow,
      }}
    >
      <LogoImage src={Logo} text="ЦОЗМАИТ КБР" sx={{ width: 80, height: 80 }} />

      <ListContainer sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListButton
            key={item.text}
            onClick={() => handleClick(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListButton>
        ))}
      </ListContainer>
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

export default NavPanel;
