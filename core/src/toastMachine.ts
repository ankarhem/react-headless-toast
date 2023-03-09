import { sendParent, createMachine } from 'xstate';
import { RequiredToastProps } from './toasterMachine';

export interface ToastContext {
  id: string;
  autoCloseAfter: number;
}

export type ToastEvent = { type: 'REMOVE' } | { type: 'EXITED' };

function timeout(length: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, length);
  });
}

const createToastMachine = <ToasterProps extends RequiredToastProps>() => {
  return createMachine<ToastContext, ToastEvent>({
    predictableActionArguments: true,
    preserveActionOrder: true,
    initial: 'summoned',
    id: 'Toast',
    states: {
      summoned: {
        invoke: {
          id: 'entering',
          src: () => timeout(10),
          onDone: {
            target: 'entering',
          },
        },
        on: {
          REMOVE: { target: 'exiting' },
        },
      },
      entering: {
        on: {
          REMOVE: { target: 'exiting' },
        },
        invoke: {
          id: 'entering',
          src: (context) => timeout(context.autoCloseAfter),
          onDone: [
            {
              target: 'idle.persisting',
              cond: (context) => context.autoCloseAfter === 0,
            },
            { target: 'idle.expiring' },
          ],
        },
      },
      idle: {
        on: {
          REMOVE: { target: 'exiting' },
        },
        states: {
          expiring: {
            invoke: {
              id: 'idling',
              src: (context) => timeout(context.autoCloseAfter),
              onDone: {
                target: '#Toast.exiting',
              },
            },
          },
          persisting: {},
        },
      },
      exiting: {
        invoke: {
          id: 'exiting',
          src: (context) => timeout(context.autoCloseAfter / 4),
          onDone: {
            actions: [
              sendParent((ctx: ToastContext) => {
                return { type: 'TOAST.REMOVED', id: ctx.id };
              }),
            ],
          },
        },
      },
    },
  });
};

export { createToastMachine };
