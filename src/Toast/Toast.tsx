import {
  createContext,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../_shared/utils/cn';

import styles from './Toast.module.css';

/* ═══════════════════════════════════════════════════════════════
 *  Types
 *  ═══════════════════════════════════════════════════════════════ */

export type ToastType = 'info' | 'success' | 'warning' | 'error';

export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

export interface ToastOptions {
  /** Toast type / variant */
  type?: ToastType;
  /** Main message */
  message: ReactNode;
  /** Optional description / detail */
  description?: ReactNode;
  /** Auto-close duration in ms (0 = persist) */
  duration?: number;
  /** Optional action button */
  action?: { label: string; onClick: () => void };
  /** Custom icon override */
  icon?: ReactNode;
  /** Callback when toast closes */
  onClose?: () => void;
}

export interface ToastItem {
  id: string;
  type: ToastType;
  message: ReactNode;
  description?: ReactNode;
  duration: number;
  action?: { label: string; onClick: () => void };
  icon?: ReactNode;
  onClose?: () => void;
  createdAt: number;
}

export interface ToastContextValue {
  /** Show a toast, returns the id */
  toast: (options: ToastOptions) => string;
  /** Remove a toast by id */
  dismiss: (id: string) => void;
  /** Clear all toasts */
  clear: () => void;
}

export interface ToastProviderProps {
  children?: ReactNode;
  /** Position of toast stack */
  position?: ToastPosition;
  /** Default duration in ms */
  defaultDuration?: number;
  /** Max visible toasts */
  maxToasts?: number;
  /** Gap between toasts in px */
  gap?: number;
}

export interface ToastItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'action'> {
  item: ToastItem;
  onDismiss: (id: string) => void;
}

export type ToastSemanticDOM = 'root' | 'icon' | 'message' | 'description' | 'action' | 'close';

/* ═══════════════════════════════════════════════════════════════
 *  Context
 *  ═══════════════════════════════════════════════════════════════ */

export const ToastContext = createContext<ToastContextValue | null>(null);

/* ═══════════════════════════════════════════════════════════════
 *  ID generator
 *  ═══════════════════════════════════════════════════════════════ */

let toastCounter = 0;
function generateId(): string {
  toastCounter += 1;
  return `toast-${toastCounter}-${Date.now()}`;
}

/* ═══════════════════════════════════════════════════════════════
 *  Toast Provider
 *  ═══════════════════════════════════════════════════════════════ */

/**
 * `Toast.Provider` — wraps the app and provides toast context.
 *
 * Place once at the root of your application.
 *
 * @example
 * <Toast.Provider position="top-right">
 *   <App />
 * </Toast.Provider>
 */
const ToastProvider = forwardRef<HTMLDivElement, ToastProviderProps>(
  (
    {
      children,
      position = 'top-right',
      defaultDuration = 4000,
      maxToasts = 5,
      gap = 8,
    },
    ref,
  ) => {
    const [items, setItems] = useState<ToastItem[]>([]);
    const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    const dismiss = useCallback((id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      const timer = timersRef.current.get(id);
      if (timer) {
        clearTimeout(timer);
        timersRef.current.delete(id);
      }
    }, []);

    const clear = useCallback(() => {
      setItems([]);
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    }, []);

    const toast = useCallback(
      (options: ToastOptions): string => {
        const id = generateId();
        const type = options.type ?? 'info';
        const duration = options.duration ?? defaultDuration;

        const newItem: ToastItem = {
          id,
          type,
          message: options.message,
          description: options.description,
          duration,
          action: options.action,
          icon: options.icon,
          onClose: options.onClose,
          createdAt: Date.now(),
        };

        setItems((prev) => {
          const next = [...prev, newItem];
          return next.length > maxToasts ? next.slice(next.length - maxToasts) : next;
        });

        if (duration > 0) {
          const timer = setTimeout(() => {
            dismiss(id);
            options.onClose?.();
          }, duration);
          timersRef.current.set(id, timer);
        }

        return id;
      },
      [defaultDuration, maxToasts, dismiss],
    );

    const contextValue = useMemo<ToastContextValue>(
      () => ({ toast, dismiss, clear }),
      [toast, dismiss, clear],
    );

    const positionClass = (() => {
      switch (position) {
        case 'top-left': return styles.positionTopLeft;
        case 'top-center': return styles.positionTopCenter;
        case 'bottom-right': return styles.positionBottomRight;
        case 'bottom-left': return styles.positionBottomLeft;
        case 'bottom-center': return styles.positionBottomCenter;
        default: return styles.positionTopRight;
      }
    })();

    return (
      <ToastContext.Provider value={contextValue}>
        {children}

        {/* Toast container (portal) */}
        {createPortal(
          <div
            ref={ref}
            className={cn(styles.container, positionClass)}
            style={{ gap }}
          >
            {items.map((item) => (
              <ToastItemComponent
                key={item.id}
                item={item}
                onDismiss={dismiss}
              />
            ))}
          </div>,
          document.body,
        )}
      </ToastContext.Provider>
    );
  },
);

ToastProvider.displayName = 'Toast.Provider';

/* ═══════════════════════════════════════════════════════════════
 *  Toast Item (internal)
 *  ═══════════════════════════════════════════════════════════════ */

const typeIcon: Record<ToastType, string> = {
  info: '\u2139\uFE0F',
  success: '\u2705',
  warning: '\u26A0\uFE0F',
  error: '\u274C',
};

/**
 * `Toast.Item` — individual notification toast.
 */
const ToastItemComponent = forwardRef<HTMLDivElement, ToastItemProps>(
  ({ item, onDismiss, className, ...rest }, ref) => {
    const typeClass = (() => {
      switch (item.type) {
        case 'info': return styles.typeInfo;
        case 'success': return styles.typeSuccess;
        case 'warning': return styles.typeWarning;
        case 'error': return styles.typeError;
      }
    })();

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(styles.item, typeClass, className)}
        style={{ '--toast-gap': `${item.createdAt}ms` } as React.CSSProperties}
        {...rest}
      >
        {/* Icon */}
        <span className={styles.itemIcon} aria-hidden="true">
          {item.icon ?? typeIcon[item.type]}
        </span>

        {/* Content */}
        <div className={styles.itemContent}>
          <div className={styles.itemMessage}>{item.message}</div>
          {item.description && (
            <div className={styles.itemDescription}>{item.description}</div>
          )}
        </div>

        {/* Action */}
        {item.action && (
          <button
            type="button"
            className={styles.itemAction}
            onClick={() => {
              item.action!.onClick();
              onDismiss(item.id);
            }}
          >
            {item.action.label}
          </button>
        )}

        {/* Close */}
        <button
          type="button"
          className={styles.itemClose}
          onClick={() => onDismiss(item.id)}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    );
  },
);

ToastItemComponent.displayName = 'Toast.Item';

/* ═══════════════════════════════════════════════════════════════
 *  Namespace
 *  ═══════════════════════════════════════════════════════════════ */

export const ToastNamespace = Object.assign(
  {},
  { Provider: ToastProvider, Item: ToastItemComponent },
);

export { ToastItemComponent,ToastProvider };
export default ToastNamespace;
