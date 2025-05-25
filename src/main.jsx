import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/styles.css';

// Use basename only in production (GitHub Pages)
const basename = import.meta.env.PROD ? '/exam' : '/';

console.log('Main.jsx loading...');
console.log('Environment:', import.meta.env.MODE);
console.log('Production:', import.meta.env.PROD);
console.log('Basename:', basename);

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <BrowserRouter basename={basename}>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
  console.log('React app rendered successfully');
} catch (error) {
  console.error('Error rendering React app:', error);
  // Fallback rendering
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
      <h1>Application Error</h1>
      <p>There was an error loading the application.</p>
      <p>Error: ${error.message}</p>
      <p>Please check the browser console for more details.</p>
    </div>
  `;
} 