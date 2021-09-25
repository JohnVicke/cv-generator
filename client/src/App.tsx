import { ThemeProvider, useMediaQuery } from '@mui/material';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home } from './pages/Home';
import { LandingPage } from './pages/LandingPage';
import { getTheme } from './utils/MaterialUi/theme';

export const App = () => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () => getTheme({ mode: prefersDarkMode ? 'dark' : 'light' }),
    [prefersDarkMode]
  );
  return (
    <ThemeProvider theme={theme}>
      <Switch>
        <Route path="/" component={LandingPage} exact />
        <Route path="/home" component={Home} exact />
      </Switch>
    </ThemeProvider>
  );
};
