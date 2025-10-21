// src/main.jsx ou src/index.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* PREMIER ROUTER (CECI EST CORRECT) */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);