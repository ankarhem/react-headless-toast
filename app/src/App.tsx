import { useToaster } from './main';

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
}

export default App;
