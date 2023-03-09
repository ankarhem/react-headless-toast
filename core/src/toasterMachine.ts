import {
  AnyEventObject,
  assign,
  Interpreter,
  send,
  spawn,
  createMachine,
} from 'xstate';
import { ToastContext, createToastMachine } from './toastMachine';
import { v4 as uuid } from 'uuid';

export type Toast<ToastProps extends RequiredToastProps> = {
  id: string;
  ref: Interpreter<ToastContext>;
  Component: React.ComponentType<ToastProps>;
  props: ToastProps;
};

export interface ToasterContextType {
  toasts: Toast<any>[];
}

export type RequiredToastProps = {
  id: string;
};

export type ToasterEvent<ToastProps> =
  | ({
      type: 'TOAST.ADD';
      Component: React.ComponentType<ToastProps>;
      props: ToastProps;
    } & Partial<Omit<ToastContext, 'id'>>)
  | { type: 'TOAST.REMOVED'; id: string }
  | { type: 'TOAST.REMOVE'; id: string }
  | { type: 'TOASTS.CLEAR' };

export type ToasterState = 'idle' | 'active';

export interface CreateToasterMachineProps<ToastProps> {
  ToastComponent: React.ComponentType<ToastProps>;
  toastOptions?: Partial<Omit<ToastContext, 'id'>>;
}

const defaultToastOptions: Omit<ToastContext, 'id'> = {
  autoCloseAfter: 1600,
  duration: 400,
  delay: 10,
};

const createToasterMachine = <ToastProps extends RequiredToastProps>({
  ToastComponent,
  toastOptions,
}: CreateToasterMachineProps<ToastProps>) => {
  const toastMachine = createToastMachine<ToastProps>();
  return createMachine<ToasterContextType, ToasterEvent<ToastProps>>({
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
              duration: toastOptions?.duration || defaultToastOptions.duration,
              delay: toastOptions?.delay || defaultToastOptions.delay,
            };

            const ref = spawn(toastMachine.withContext(toastContext));

            return [
              ...context.toasts,
              {
                id: toastId,
                ref,
                Component: Component || ToastComponent,
                props: {
                  ...props,
                  id: props.id || toastId,
                },
              },
            ] as any;
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
          'TOAST.REMOVED': {
            actions: assign({
              toasts: (context, event) => {
                const newToasts = context.toasts.filter(
                  (t) => t.id !== event.id
                );
                return newToasts;
              },
            }),
          },
          'TOAST.REMOVE': {
            actions: send('REMOVE', {
              to: (_, event: AnyEventObject) => event.id,
            }),
            // actions: (context, event) => {
            //   sendTo('REMOVE', event);
            // },
          },
          'TOASTS.CLEAR': {
            actions: (context) => {
              context.toasts.forEach((toast) => {
                toast.ref.send({
                  type: 'REMOVE',
                });
              });
            },
          },
        },
      },
    },
  });
};

export { createToasterMachine };
