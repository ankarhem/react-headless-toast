import { RequiredToastProps } from '@headless-toast/core';
import { useToaster } from './Toasts';

interface CustomToastProps extends RequiredToastProps {
  message: string;
}

const CustomToast = ({ message }: CustomToastProps) => {
  return (
    <div className="text-center rounded-full w-60 bg-indigo-400 text-indigo-800 border-2 border-indigo-800 px-4 py-1">
      <h1 className="text-2xl font-semibold">One-off toast</h1>
      <p>{message}</p>
    </div>
  );
};

function App() {
  const toast = useToaster();
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
            toast(
              {
                message: new Date().toLocaleString(),
              },
              {
                Component: CustomToast,
                autoCloseAfter: 500,
              }
            );
          }}
        >
          One-off toast
        </button>
        <button
          className="px-4 py-2 bg-blue-300 text-blue-800 rounded"
          onClick={() => {
            toast(
              {
                title: 'Fast default toast',
                message: 'Fast toast with custom component',
              },
              {
                autoCloseAfter: 1500,
              }
            );
          }}
        >
          Default toast
        </button>
      </div>
    </div>
  );
}

export default App;
