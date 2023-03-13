import { assign, spawn, createMachine, ActorRefFrom } from 'xstate';
import { ToastContext, createToastMachine, ToastEvent } from './toastMachine';
import { v4 as uuid } from 'uuid';

export type RequiredToastProps = {
  id: string;
  toastRef: ActorRefFrom<ReturnType<typeof createToastMachine>>;
};

export type ProvidedToastProps = keyof RequiredToastProps;

export type Toast<ToastProps extends RequiredToastProps> = {
  id: string;
  ref: ActorRefFrom<ReturnType<typeof createToastMachine>>;
  Component: React.ComponentType<ToastProps>;
  props: Omit<ToastProps, ProvidedToastProps>;
};

export interface ToasterContextType {
  toasts: Toast<any>[];
}

export type ToasterEvent<ToastProps extends RequiredToastProps> =
  | ({
      type: 'TOAST.ADD';
      Component: React.ComponentType<ToastProps>;
      props: Omit<ToastProps, ProvidedToastProps>;
    } & Partial<Omit<ToastContext, 'id'>>)
  | { type: 'TOAST.REMOVED'; id: string }
  // | { type: 'TOAST.REMOVE'; id: string }
  | { type: 'TOASTS.CLEAR' }
  | { type: 'TOASTS.PAUSE' };

export type ToasterState = 'idle' | 'active';

export interface CreateToasterMachineProps<
  ToastProps extends RequiredToastProps
> {
  ToastComponent: React.ComponentType<ToastProps>;
  toastOptions?: Partial<Omit<ToastContext, 'id'>>;
}

const defaultToastOptions: Omit<ToastContext, 'id'> = {
  autoCloseAfter: 1600,
  duration: 400,
  delay: 0,
};

const createToasterMachine = <ToastProps extends RequiredToastProps>({
  ToastComponent,
  toastOptions,
}: CreateToasterMachineProps<ToastProps>) => {
  const toastMachine = createToastMachine<ToastProps>();
  return createMachine(
    {
      tsTypes: {} as import('./toasterMachine.typegen').Typegen0,
      schema: {
        events: {} as ToasterEvent<ToastProps>,
        context: {} as ToasterContextType,
      },
      predictableActionArguments: true,
      preserveActionOrder: true,
      id: 'toasts',
      context: {
        toasts: [],
      },
      initial: 'idle',
      on: {
        'TOAST.ADD': {
          actions: assign({
            toasts: (context, event) => {
              const { type, autoCloseAfter, Component, props } = event;

              const toastId = uuid();

              const toastContext: ToastContext = {
                id: toastId,
                autoCloseAfter:
                  autoCloseAfter ||
                  toastOptions?.autoCloseAfter ||
                  defaultToastOptions.autoCloseAfter,
                duration:
                  toastOptions?.duration || defaultToastOptions.duration,
                delay: toastOptions?.delay || defaultToastOptions.delay,
              };

              const ref: ActorRefFrom<typeof toastMachine> = spawn(
                toastMachine.withContext(toastContext)
              );

              return [
                ...context.toasts,
                {
                  id: toastId,
                  ref: ref,
                  Component: Component || ToastComponent,
                  props: {
                    id: toastId,
                    toastRef: ref,
                    ...props,
                  },
                },
              ];
            },
          }),
          target: 'active',
        },
      },
      states: {
        idle: {},
        active: {
          always: [
            {
              target: 'idle',
              cond: (context) => Object.keys(context.toasts).length === 0,
            },
          ],
          on: {
            'TOASTS.PAUSE': {
              actions: 'pauseToasts',
            },
            'TOAST.REMOVED': {
              actions: 'deleteToast',
            },
            'TOASTS.CLEAR': {
              actions: 'clearToasts',
            },
          },
        },
      },
    },
    {
      actions: {
        deleteToast: assign({
          toasts: (context, event) => {
            const newToasts = context.toasts.filter((t) => t.id !== event.id);
            return newToasts;
          },
        }),
        pauseToasts: (context) => {
          const event: ToastEvent = {
            type: 'PAUSE',
          };
          context.toasts.forEach((toast) => {
            toast.ref.send(event);
          });
        },
        clearToasts: (context) => {
          const event: ToastEvent = {
            type: 'REMOVE',
          };
          context.toasts.forEach((toast) => {
            toast.ref.send(event);
          });
        },
      },
    }
  );
};

export { createToasterMachine };
