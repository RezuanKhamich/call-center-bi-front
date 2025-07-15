import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../widgets/NavPanel';

const AppLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box component="main" sx={{ ml: '240px', p: 3, width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
