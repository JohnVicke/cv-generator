import { createTheme, ThemeOptions } from '@mui/material';

const themeOptions: ThemeOptions = {
  palette: {
    primary: {
      main: '#3f51b5'
    },
    secondary: {
      main: '#f50057'
    }
  },
  typography: {
    fontFamily: 'Poppins',
    h1: {
      fontWeight: 700
    },
    h2: {
      fontWeight: 700
    },
    h3: {
      fontWeight: 700
    }
  }
};

type ThemeMode = {
  mode: 'dark' | 'light';
};

export const getTheme = ({ mode }: ThemeMode) =>
  createTheme({ ...themeOptions, palette: { mode: mode } });
