import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: `'Montserrat', sans-serif`,
  },
  palette: {
    primary: {
      main: '#6C63FF',
      contrastText: '#fff',
    },
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'blue',
            },
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3B82F6',
            boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)', // мягкая подсветка
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3B82F6', // синий при наведении
          },
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: '#6C63FF',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: 'red',
            '.MuiOutlinedInput-notchedOutline': {
              borderColor: 'red',
              borderWidth: '8px',
            },
          },
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: 'green',
            borderWidth: '4px',
          },
        },
      },
    },
  },
});

export default theme;
