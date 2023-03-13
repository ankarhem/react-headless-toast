import { ToasterProvider } from 'react-headless-toast';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ToastContainer, toasterMachine } from './Toasts';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ToasterProvider toasterMachine={toasterMachine}>
      <App />
      <ToastContainer />
    </ToasterProvider>
  </React.StrictMode>
);
