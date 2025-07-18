import React from 'react';
import { Box } from '@mui/material';
import NavPanel from '../widgets/NavPanel';
import { customColors } from '../app/theme';

const AppLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        backgroundColor: customColors.primary.backgroundLight,
      }}
    >
      <NavPanel />
      <Box component="main" sx={{ ml: '240px', p: 3, width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
