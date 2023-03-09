import { createToaster, ToasterProvider } from '@headless-toast/core';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Toast, ToastContainer } from './Toasts';

export const { toasterMachine, useToaster, useToasts, useToast } =
  createToaster({
    ToastComponent: Toast,
    toastOptions: {
      autoCloseAfter: 160000,
      duration: 400,
      delay: 0,
    },
  });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ToasterProvider toasterMachine={toasterMachine}>
      <App />
      <ToastContainer />
    </ToasterProvider>
  </React.StrictMode>
);
