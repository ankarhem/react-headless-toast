import { createToaster, RequiredToastProps } from '@headless-toast/core';
import { Transition } from '@headlessui/react';
import { useState } from 'react';

export interface ToastProps extends RequiredToastProps {
  title: string;
  message: string;
}

export const Toast = ({ toastRef, title, message }: ToastProps) => {
  const { state, remove } = useToast(toastRef);

  return (
    <Transition
      show={state === 'entering' || state === 'idle'}
      enter="transition-all ease-out duration-300"
      enterFrom="opacity-0 scale-95"
      enterTo="opacity-100 scale-100"
      leave="transition ease-in duration-300"
      leaveFrom="opacity-100 scale-100"
      leaveTo="opacity-0 scale-95"
    >
      <div
        className={`w-80 rounded px-4 py-1 flex flex-col gap-2 border-2 bg-red-400 border-red-900 text-red-900`}
      >
        <div className="flex items-center w-full justify-between">
          <h2 className="font-semibold capitalize">ℹ️ {title}</h2>
          <button
            className="flex items-center px-2 py-1 aspect-square"
            onClick={remove}
          >
            ❌
          </button>
        </div>
        <p className="pb-4">{message}</p>
      </div>
    </Transition>
  );
};

export const ToastContainer = () => {
  const toasts = useToasts();

  return (
    <div className="absolute top-8 right-8 flex flex-col gap-2 items-end">
      {toasts.map((toast) => {
        return (
          <toast.Component
            key={toast.id}
            toastRef={toast.ref}
            {...toast.props}
          />
        );
      })}
    </div>
  );
};

export const { toasterMachine, useToaster, useToasts, useToast } =
  createToaster({
    ToastComponent: Toast,
    toastOptions: {
      autoCloseAfter: 1500,
      duration: 400,
      delay: 0,
    },
  });
