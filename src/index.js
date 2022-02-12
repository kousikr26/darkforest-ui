import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Box, ThemeProvider } from '@mui/system';
import {createTheme} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline';
const darkTheme = createTheme({
  palette: {
    primary: {
      main: '#ffffff',
      darker: '#ffffff',
    },
    mode: 'dark',
  },
});
ReactDOM.render(
  //<React.StrictMode>
  // <ThemeProvider theme={darkTheme}>
    // <CssBaseline />
    <App />,
  // </ThemeProvider>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
