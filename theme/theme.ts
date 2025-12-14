'use client';
import { createTheme } from '@mui/material/styles';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1d1d1f', // Deep charcoal (Claude bg)
      paper: '#2b2b2d',   // Slightly lighter for cards
    },
    primary: {
      main: '#d97757', // Warm accent
    },
    text: {
      primary: '#ececf1',
      secondary: '#9e9e9e',
    },
  },
  typography: {
    fontFamily: inter.style.fontFamily,
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
  },
});

export default theme;
