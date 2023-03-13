import { useToaster } from './Toasts';

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
          className="px-4 py-2 bg-blue-300 text-blue-800 rounded capitalize"
          onClick={() => {
            toast({
              title: 'Fast default toast',
              message: new Date().toLocaleString(),
            });
          }}
        >
          Fast default toast
        </button>
        <button
          className="px-4 py-2 bg-blue-300 text-blue-800 rounded capitalize"
          onClick={() => {
            toast(
              {
                title: 'Slow default toast',
                message: 'lorem ipsum dolor sit amet',
              },
              {
                autoCloseAfter: 4000,
              }
            );
          }}
        >
          Slow Default toast
        </button>
      </div>
    </div>
  );
}

export default App;
