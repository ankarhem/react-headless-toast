import './App.css';
import {
  createToaster,
  ToastContext,
  ToasterProvider,
} from '@headless-toast/core';
import { useRef } from 'react';
import { Transition } from '@headlessui/react';
import { useActor } from '@xstate/react';
import { Interpreter } from 'xstate';

interface ToastProps {
  id: string;
  title: string;
  message: string;
  toastRef?: Interpreter<ToastContext>;
}

const Toast = ({ id, title, message, toastRef }: ToastProps) => {
  const [state] = useActor(toastRef!);

  const visible = !state.matches('exiting') && !state.matches('summoned');

  return (
    <Transition
      key={id}
      show={visible}
      enter="transition-all ease-out duration-300"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-300"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div
        className={`w-80 rounded px-4 py-1 flex flex-col gap-2 border-2 bg-red-400 border-red-900 text-red-900`}
      >
        <div className="flex items-center w-full justify-between">
          <h2 className="font-semibold capitalize">ℹ️ {title}</h2>
          <button className="flex items-center px-2 py-1 aspect-square">
            ❌
          </button>
        </div>
        <p className="pb-4">
          {/* {Math.random() > 0.5 ? message : message + message} */}
          {message}
        </p>
      </div>
    </Transition>
  );
};

const ToastContainer = () => {
  const toasts = useToasts();

  return (
    <div className="absolute top-8 right-8 flex flex-col gap-2">
      {toasts.map((toast, index) => {
        return (
          <toast.Component
            key={toast.id}
            {...toast.props}
            toastRef={toast.ref as any}
          />
        );
      })}
    </div>
  );
};

const Child = () => {
  // const [state, send] = useToasterActor();
  const toast = useToast();
  return (
    <div className="grid container mx-auto items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-5xl text-center">Toasts</h1>
        <h3 className="text-xl opacity-50">Burning hot, but good</h3>
      </div>
      <div className="flex flex-col gap-2">
        <button
          className="px-4 py-2 bg-blue-300 text-blue-800 rounded"
          onClick={() => {
            toast({
              props: {
                title: 'Slow toast',
                message: new Date().toLocaleString(),
              },
              autoCloseAfter: 4000,
            });
          }}
        >
          Send slow notification
        </button>
        <button
          className="px-4 py-2 bg-blue-300 text-blue-800 rounded"
          onClick={() => {
            toast({
              props: {
                title: 'Fast toast',
                message: `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam odio
                quos laudantium sit et ad nam?`,
              },
              autoCloseAfter: 1500,
            });
          }}
        >
          Send fast notification
        </button>
      </div>
    </div>
  );
};

const { toasterMachine, useToast, useToasts } = createToaster({
  ToastComponent: Toast,
  toastOptions: {
    autoCloseAfter: 160000,
  },
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
