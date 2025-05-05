import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add console message to debug loading issues
console.log('Procore\'s CEOBlueprint application starting...');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Add a visible message directly to the body in case of React rendering issues
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('root')?.children.length) {
    const debugDiv = document.createElement('div');
    debugDiv.style.padding = '20px';
    debugDiv.style.fontFamily = 'sans-serif';
    debugDiv.innerHTML = `
      <h1>Procore's CEOBlueprint Debug Info</h1>
      <p>If you're seeing this message, React failed to render properly.</p>
      <p>Please check browser console for errors.</p>
    `;
    document.body.appendChild(debugDiv);
  }
});
