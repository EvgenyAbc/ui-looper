import { type MutableRefObject,type Ref, useCallback } from 'react';

/**
 * `composeRefs` — merges multiple React refs into a single callback ref.
 *
 * Accepts callback refs, object refs, and `null`.
 * Returns a stable callback via `useCallback`.
 *
 * @example
 * const ref = composeRefs(externalRef, internalRef);
 * <div ref={ref} />
 */
export function composeRefs<T>(...refs: (Ref<T> | undefined)[]) {
  return useCallback(
    (node: T | null) => {
      for (const ref of refs) {
        if (!ref) continue;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref && typeof ref === 'object') {
          (ref as MutableRefObject<T | null>).current = node;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}
