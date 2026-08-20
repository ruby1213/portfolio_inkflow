import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { ThemeProvider, LangProvider } from './contexts.jsx';
import './styles.css';

// Note: StrictMode is intentionally omitted — its dev-mode double-invoked
// effects would mount the WebGL fluid simulation twice in quick succession.
ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <LangProvider>
      <App />
    </LangProvider>
  </ThemeProvider>
);
