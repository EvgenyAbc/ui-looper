import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';

import { cn } from '../_shared/utils/cn';

import styles from './Modal.module.css';

/* ═══════════════════════════════════════════════════════════════
 *  Types
 *  ═══════════════════════════════════════════════════════════════ */

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

export interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  /** Whether modal is visible */
  open: boolean;
  /** Callback when modal requests close (ESC, mask click, close button) */
  onClose?: () => void;
  /** Dialog size */
  size?: ModalSize;
  /** Dialog title (rendered in header) */
  title?: ReactNode;
  /** Dialog content */
  children?: ReactNode;
  /** Dialog footer actions */
  footer?: ReactNode;
  /** Hide the close button */
  closable?: boolean;
  /** Close when clicking the mask */
  maskClosable?: boolean;
  /** Close on Escape key */
  keyboard?: boolean;
  /** Show footer */
  showFooter?: boolean;
  /** Custom footer */
  footerNode?: ReactNode;
  /** z-index override */
  zIndex?: number;
  /** Width override (for custom sizes) */
  width?: number | string;
  /** Center the modal vertically */
  centered?: boolean;
}

export type ModalSemanticDOM =
  | 'root'
  | 'mask'
  | 'wrapper'
  | 'header'
  | 'body'
  | 'footer';

/* ═══════════════════════════════════════════════════════════════
 *  Size map
 *  ═══════════════════════════════════════════════════════════════ */

const sizeClass: Record<ModalSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
  xl: styles.sizeXl,
  fullscreen: styles.sizeFullscreen,
};

/* ═══════════════════════════════════════════════════════════════
 *  Modal Root Component
 *  ═══════════════════════════════════════════════════════════════ */

/**
 * `Modal` — dialog overlay with mask, header, body, and footer.
 *
 * Compound sub-components: `Modal.Header`, `Modal.Body`, `Modal.Footer`
 * for custom layouts. When using sub-components, `title` and `footer`
 * props are ignored.
 *
 * @example
 * <Modal open={open} onClose={() => setOpen(false)} title="Confirm" size="sm">
 *   <p>Are you sure?</p>
 * </Modal>
 *
 * <Modal open={open} onClose={() => setOpen(false)}>
 *   <Modal.Header>Custom Header</Modal.Header>
 *   <Modal.Body>Custom body</Modal.Body>
 *   <Modal.Footer><Button>OK</Button></Modal.Footer>
 * </Modal>
 */
export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onClose,
      size = 'md',
      title,
      children,
      closable = true,
      maskClosable = true,
      keyboard = true,
      showFooter = false,
      footerNode,
      zIndex,
      width,
      centered = false,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const wrapperRef = useRef<HTMLDivElement>(null!);

    // Close on ESC
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (keyboard && e.key === 'Escape') onClose?.();
      },
      [keyboard, onClose],
    );

    useEffect(() => {
      if (!open) return;
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = prev;
      };
    }, [open, handleKeyDown]);

    // Focus trap — focus first focusable element
    useEffect(() => {
      if (!open || !wrapperRef.current) return;
      const firstFocusable = wrapperRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      // Small delay for animation start
      requestAnimationFrame(() => firstFocusable?.focus());
    }, [open]);

    if (!open) return null;

    const hasChildren = !!children;

    const rootClasses = cn(
      styles.root,
      centered ? styles.centered : null,
      className,
    );

    return createPortal(
      <div
        ref={ref}
        className={rootClasses}
        style={{ ...style, zIndex }}
        role="presentation"
        {...rest}
      >
        {/* Mask */}
        <div
          className={styles.mask}
          onClick={maskClosable ? onClose : undefined}
          aria-hidden="true"
        />

        {/* Wrapper */}
        <div
          ref={wrapperRef}
          role="dialog"
          aria-modal="true"
          aria-label={typeof title === 'string' ? title : undefined}
          className={cn(styles.wrapper, sizeClass[size])}
          style={width ? { maxWidth: width } : undefined}
        >
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              {title}
            </div>
            {closable && (
              <button
                type="button"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Close"
              >
                ×
              </button>
            )}
          </div>

          {/* Body */}
          {hasChildren && (
            <div className={styles.body}>
              {children}
            </div>
          )}

          {/* Footer */}
          {(showFooter || footerNode) && (
            <div className={styles.footer}>
              {footerNode}
            </div>
          )}
        </div>
      </div>,
      document.body,
    );
  },
);

Modal.displayName = 'Modal';

/* ═══════════════════════════════════════════════════════════════
 *  Sub-components
 *  ═══════════════════════════════════════════════════════════════ */

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ children, className, ...rest }, ref) => (
    <div ref={ref} className={cn(styles.header, className)} {...rest}>
      <div className={styles.headerTitle}>{children}</div>
    </div>
  ),
);
ModalHeader.displayName = 'Modal.Header';

const ModalBody = forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ children, className, ...rest }, ref) => (
    <div ref={ref} className={cn(styles.body, className)} {...rest}>
      {children}
    </div>
  ),
);
ModalBody.displayName = 'Modal.Body';

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ children, className, ...rest }, ref) => (
    <div ref={ref} className={cn(styles.footer, className)} {...rest}>
      {children}
    </div>
  ),
);
ModalFooter.displayName = 'Modal.Footer';

/* ── Compound namespace ── */

export const ModalNamespace = Object.assign(Modal, {
  Header: ModalHeader,
  Body: ModalBody,
  Footer: ModalFooter,
});

export { ModalBody, ModalFooter,ModalHeader };
export default Modal;
