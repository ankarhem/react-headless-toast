import { sendParent, createMachine } from 'xstate';
import { RequiredToastProps } from './toasterMachine';

export type ToastDuration = number | { enter: number; exit: number };
export interface ToastContext {
  id: string;
  autoCloseAfter: number;
  duration: ToastDuration;
  delay: number;
}

export type ToastEvent = { type: 'REMOVE' };

export type ToastState = 'summoned' | 'entering' | 'idle' | 'exiting';

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
          src: (context) => {
            return timeout(context.delay);
          },
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
          src: (context) => {
            const duration =
              typeof context.duration === 'number'
                ? context.duration
                : context.duration.enter;
            return timeout(duration);
          },
          onDone: {
            target: 'idle',
          },
        },
      },
      idle: {
        on: {
          REMOVE: { target: 'exiting' },
        },
        invoke: {
          id: 'idling',
          src: (context) => timeout(context.autoCloseAfter),
          onDone: {
            target: 'exiting',
          },
        },
      },
      exiting: {
        invoke: {
          id: 'exiting',
          src: (context) => {
            const duration =
              typeof context.duration === 'number'
                ? context.duration
                : context.duration.exit;
            return timeout(duration);
          },
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
