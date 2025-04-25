import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Get the root element from the HTML
const container = document.getElementById('root');

// Create a root using the new React 18 API
const root = createRoot(container);

// Render your App component to the DOM
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);