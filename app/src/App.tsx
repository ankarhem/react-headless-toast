import { useState } from 'react';
import './App.css';
import { createToaster, ToasterProvider } from '@headless-toast/core';
import { uniqueId } from 'xstate/lib/utils';

interface ToastProps {
  id: string;
  title: string;
  message: string;
}

const Toast = ({ id, title, message }: ToastProps) => {
  return (
    <div className="bg-slate-400 text-slate-800">
      <h2>{title}</h2>
      <p>{message}</p>
      <p>{id}</p>
    </div>
  );
};

interface AnotherToastProps {
  id: string;
  someOtherProps: string;
}

const AnotherToast = ({ id, someOtherProps }: AnotherToastProps) => {
  return (
    <div className="bg-blue-400 text-blue-800">
      <h2>{someOtherProps}</h2>
      <p>{id}</p>
    </div>
  );
};

const ToastContainer = () => {
  const toasts = useToasts();

  return (
    <div className="absolute top-4 right-4">
      {toasts.map((toast) => {
        return <toast.Component key={toast.id} {...toast.props} />;
      })}
    </div>
  );
};

const Child = () => {
  // const [state, send] = useToasterActor();
  const toast = useToast();
  return (
    <div className="grid container mx-auto items-center justify-center">
      <h1 className="text-5xl">hello</h1>
      <div className="flex flex-col">
        <button
          onClick={() => {
            toast({
              props: {
                title: 'my default toast',
                message: 'some text',
              },
            });
          }}
        >
          Send default notification
        </button>
        <button
          onClick={() => {
            toast({
              props: {
                someOtherProps: 'hello',
              },
              Component: AnotherToast,
              autoCloseAfter: 500,
            });
          }}
        >
          Send notification
        </button>
      </div>
    </div>
  );
};

const { toasterMachine, useToast, useToasts } = createToaster({
  ToastComponent: Toast,
  // toastOptions: {
  //   autoCloseAfter:1600
  // }
});

function App() {
  return (
    <ToasterProvider toasterMachine={toasterMachine as any}>
      <Child />
      <ToastContainer />
    </ToasterProvider>
  );
}

export default App;
