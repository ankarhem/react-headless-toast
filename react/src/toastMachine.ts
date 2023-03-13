import { sendParent, createMachine } from 'xstate';
import { RequiredToastProps } from './toasterMachine';

export type ToastDuration = number | { enter: number; exit: number };
export interface ToastContext {
  id: string;
  autoCloseAfter: number;
  duration: ToastDuration;
  delay: number;
}

export type ToastEvent =
  | { type: 'REMOVE' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' };

export type ToastState = 'summoned' | 'entering' | 'idle' | 'exiting';

function timeout(length: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, length);
  });
}

const createToastMachine = <ToasterProps extends RequiredToastProps>() => {
  return createMachine(
    {
      tsTypes: {} as import('./toastMachine.typegen').Typegen0,
      schema: {
        events: {} as ToastEvent,
        context: {} as ToastContext,
      },
      predictableActionArguments: true,
      preserveActionOrder: true,
      initial: 'summoned',
      id: 'Toast',
      states: {
        summoned: {
          invoke: {
            id: 'entering',
            src: 'entering',
            onDone: {
              target: 'idle',
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
            src: 'entering',
            onDone: {
              target: 'idle',
            },
          },
        },
        idle: {
          initial: 'active',
          on: {
            REMOVE: { target: 'exiting' },
          },
          states: {
            paused: {
              on: {
                RESUME: { target: 'active' },
              },
            },
            active: {
              on: {
                PAUSE: { target: 'paused' },
              },
              invoke: {
                id: 'idling',
                src: 'idling',
                onDone: {
                  target: '#Toast.exiting',
                },
              },
            },
          },
        },
        exiting: {
          invoke: {
            id: 'exiting',
            src: 'exiting',
            onDone: {
              actions: 'toastRemoved',
            },
          },
        },
      },
    },
    {
      services: {
        entering: (ctx) => {
          return timeout(ctx.delay);
        },
        idling: (ctx) => timeout(ctx.autoCloseAfter),
        exiting: (ctx) => {
          const duration =
            typeof ctx.duration === 'number' ? ctx.duration : ctx.duration.exit;
          return timeout(duration);
        },
      },
      actions: {
        toastRemoved: sendParent((ctx: ToastContext) => {
          return { type: 'TOAST.REMOVED', id: ctx.id };
        }),
      },
    }
  );
};

export { createToastMachine };
