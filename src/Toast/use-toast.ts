import { useContext } from 'react';

import { ToastContext, type ToastContextValue } from './Toast';

/**
 * `useToast` — returns the toast API from `Toast.Provider`.
 *
 * @example
 * const { toast } = useToast();
 * toast({ message: 'Saved!', type: 'success' });
 * toast({ message: 'Error', type: 'error', duration: 0 });
 */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error(
      'useToast() must be used within a <Toast.Provider>. ' +
      'Wrap your app with <Toast.Provider> first.',
    );
  }
  return ctx;
}
