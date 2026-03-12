import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Failed to find the root element");
  }
  
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  console.log("ShipmentGuard AI: Mount Successful");
} catch (error) {
  console.error("ShipmentGuard AI: Mount Failed", error);
  document.body.innerHTML = `
    <div style="color:red; padding:40px; background:white; font-family:sans-serif;">
      <h1>Fatal Mount Error</h1>
      <pre style="background:#f5f5f5; padding:20px; border-radius:8px;">${error.stack}</pre>
    </div>
  `;
}
