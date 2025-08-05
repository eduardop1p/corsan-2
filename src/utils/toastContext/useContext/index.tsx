'use client';

import { useContext } from 'react';

import { ToastContext } from '../context';

export function useToastContext() {
  const { toast, setToast } = useContext(ToastContext);

  return { toast, setToast };
}
