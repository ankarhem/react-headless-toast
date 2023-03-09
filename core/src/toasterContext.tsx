import { createContext } from 'react';
import { InterpreterFrom } from 'xstate';
import { useInterpret } from '@xstate/react';
import { createToasterMachine, RequiredToastProps } from './toasterMachine';

export * from './toasterMachine';

export const ToasterContext = createContext<
  InterpreterFrom<ReturnType<typeof createToasterMachine>> | undefined
>(undefined);

export interface ToasterProviderProps {
  children?: React.ReactNode;
  toasterMachine: ReturnType<typeof createToasterMachine<any>>;
}

export const ToasterProvider = ({
  children,
  toasterMachine,
}: ToasterProviderProps) => {
  const toasterService = useInterpret(toasterMachine);

  return (
    <ToasterContext.Provider value={toasterService as any}>
      {children}
    </ToasterContext.Provider>
  );
};
