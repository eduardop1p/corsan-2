'use client';

import React, {
  createContext,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';

import Toast from '@/components/toast';
import ToastProtocol from '@/interfaces/toastProtocol';

interface ToastContextProtocol {
  toast: ToastProtocol;
  setToast: Dispatch<SetStateAction<ToastProtocol>>;
}

const defaultState: ToastProtocol = {
  open: false,
  severity: 'success',
  message: '',
};

export const ToastContext = createContext<ToastContextProtocol>({
  toast: defaultState,
  setToast: () => { }, // eslint-disable-line
});

export default function ToastContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toast, setToast] = useState(defaultState);

  return (
    <ToastContext.Provider value={{ toast, setToast }}>
      {children}
      <Toast />
    </ToastContext.Provider>
  );
}
