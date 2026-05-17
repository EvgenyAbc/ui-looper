/**
 * `useControlledState` — manages controlled / uncontrolled state pattern.
 *
 * Returns [value, setValue] where:
 * - If `prop` is passed → behaves controlled (prop drives value)
 * - If `prop` is undefined → uses internal state (uncontrolled)
 * - `onChange` fires in both modes
 */
import { type Dispatch, type SetStateAction,useCallback, useState } from 'react';

export function useControlledState<T>(
  prop: T | undefined,
  defaultProp: T,
  onChange?: (value: T) => void,
): [T, Dispatch<SetStateAction<T>>] {
  const [internal, setInternal] = useState(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : internal;

  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (next) => {
      const resolved = typeof next === 'function'
        ? (next as (prev: T) => T)(value)
        : next;
      if (!isControlled) setInternal(resolved);
      onChange?.(resolved);
    },
    [isControlled, value, onChange],
  );

  return [value, setValue];
}
