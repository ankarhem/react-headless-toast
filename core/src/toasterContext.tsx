import { createContext, useContext } from 'react';
import { InterpreterFrom } from 'xstate';
import { useActor, useInterpret } from '@xstate/react';
import { createToasterMachine } from './toasterMachine';

export * from './toasterMachine';

export const ToasterContext = createContext<
  InterpreterFrom<ReturnType<typeof createToasterMachine>> | undefined
>(undefined);

export interface ToasterProviderProps {
  children?: React.ReactNode;
  toasterMachine: ReturnType<typeof createToasterMachine>;
}

export const ToasterProvider = ({
  children,
  toasterMachine,
}: ToasterProviderProps) => {
  const toasterService = useInterpret(toasterMachine);

  return (
    <ToasterContext.Provider value={toasterService}>
      {children}
    </ToasterContext.Provider>
  );
};
