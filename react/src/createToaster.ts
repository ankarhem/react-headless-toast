import React from 'react';
import { ToasterContext } from './toasterContext';
import {
  createToasterMachine,
  ProvidedToastProps,
  RequiredToastProps,
  Toast,
} from './toasterMachine';
import { createToastMachine, ToastContext } from './toastMachine';
import { useActor } from '@xstate/react';
import { ActorRefFrom, Interpreter } from 'xstate';

export interface CreateToasterProps<
  DefaultToastProps extends RequiredToastProps
> {
  ToastComponent: React.ComponentType<DefaultToastProps>;
  toastOptions?: Partial<Omit<ToastContext, 'id'>>;
}

type SendToastProps<
  ToastProps extends RequiredToastProps,
  DefaultToastProps extends RequiredToastProps
> =
  | [
      toastComponentProps: Omit<ToastProps, ProvidedToastProps>,
      toastOptions: {
        Component: React.ComponentType<ToastProps>;
      } & Partial<Omit<ToastContext, 'id'>>
    ]
  | [
      toastComponentProps: Omit<DefaultToastProps, ProvidedToastProps>,
      toastOptions?: {
        Component?: undefined;
      } & Partial<Omit<ToastContext, 'id'>>
    ];

type SendToastProps2<
  ToastProps extends RequiredToastProps,
  DefaultToastProps extends RequiredToastProps
> =
  | ({
      Component: React.ComponentType<ToastProps>;
      props: Omit<ToastProps, ProvidedToastProps>;
    } & Partial<Omit<ToastContext, 'id'>>)
  | ({
      Component?: undefined;
      props: Omit<DefaultToastProps, ProvidedToastProps>;
    } & Partial<Omit<ToastContext, 'id'>>);

const createToaster = <DefaultToastProps extends RequiredToastProps>({
  ToastComponent,
  toastOptions,
}: CreateToasterProps<DefaultToastProps>) => {
  const toasterMachine = createToasterMachine({
    ToastComponent,
    toastOptions,
  });

  const useToast = (
    toastRef: ActorRefFrom<ReturnType<typeof createToastMachine>>
  ) => {
    const [machineState, send] = useActor(toastRef);

    const remove = () => {
      send('REMOVE');
    };

    const pause = () => {
      send('PAUSE');
    };

    const resume = () => {
      send('RESUME');
    };

    return {
      state: machineState,
      remove,
      pause,
      resume,
      ...machineState.context,
    };
  };

  const useToasts = () => {
    const toasterService = React.useContext(ToasterContext);

    if (!toasterService) {
      throw new Error('useToasterActor must be used within a ToasterProvider');
    }

    const [state, _] = useActor(toasterService);

    if (!state.matches('active')) {
      return [] as Toast<any>[];
    }

    const toasts = state.context.toasts;

    return toasts;
  };

  const useToaster = () => {
    const toasterService = React.useContext(ToasterContext);

    if (!toasterService) {
      throw new Error('useToasterActor must be used within a ToasterProvider');
    }

    const [_, send] = useActor(toasterService);

    const toast = <TProps extends RequiredToastProps>(
      ...args: SendToastProps<TProps, DefaultToastProps>
    ) => {
      const [props, toastOptions] = args;
      const { Component, ...optionalToastContext } = toastOptions || {};
      if (!Component) {
        send({
          type: 'TOAST.ADD',
          props: props,
          Component: ToastComponent,
          ...optionalToastContext,
        } as any);
      } else {
        send({
          type: 'TOAST.ADD',
          props: props,
          Component: Component,
          ...optionalToastContext,
        } as any);
      }
    };

    return toast;
  };

  return {
    toasterMachine,
    useToaster,
    useToasts,
    useToast,
  };
};

export { createToaster };
