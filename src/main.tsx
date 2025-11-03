import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './Components/App'; // Import your main App component
import './index.css'; // Import your CSS file

// Find the root element in the HTML
const rootElement = document.getElementById('root');

// Create a root for rendering
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App /> {/* Render the App component */}
    </React.StrictMode>
  );
} else {
  console.error('Failed to find the root element');
}