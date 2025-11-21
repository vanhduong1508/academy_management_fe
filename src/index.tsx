// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
// Import tệp Global CSS mới (đã tạo trong thư mục styles)
import "./styles/global.css";
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);