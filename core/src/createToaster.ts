import React from 'react';
import { ToasterContext } from './toasterContext';
import {
  createToasterMachine,
  RequiredToastProps,
  Toast,
} from './toasterMachine';
import { ToastContext } from './toastMachine';
import { useActor } from '@xstate/react';

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
  | ({
      Component: React.ComponentType<ToastProps>;
      props: Omit<ToastProps, 'id'>;
    } & Partial<Omit<ToastContext, 'id'>>)
  | ({
      Component?: undefined;
      props: Omit<DefaultToastProps, 'id'>;
    } & Partial<Omit<ToastContext, 'id'>>);

const createToaster = <DefaultToastProps extends RequiredToastProps>({
  ToastComponent,
  toastOptions,
}: CreateToasterProps<DefaultToastProps>) => {
  const toasterMachine = createToasterMachine({
    ToastComponent,
    toastOptions,
  });
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

  const useToast = () => {
    const toasterService = React.useContext(ToasterContext);

    if (!toasterService) {
      throw new Error('useToasterActor must be used within a ToasterProvider');
    }

    const [_, send] = useActor(toasterService);

    const toast = <TProps extends RequiredToastProps>({
      props,
      Component,
      ...optionalToastContext
    }: // @ts-ignore
    SendToastProps<TProps, DefaultToastProps>) => {
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
    useToast,
    useToasts,
  };
};

export { createToaster };
