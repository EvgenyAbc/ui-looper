import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { type OverlayPlacement,useOverlayPosition } from '../_shared/hooks/useOverlayPosition';
import { cn } from '../_shared/utils/cn';
import { composeRefs } from '../_shared/utils/composeRefs';

import styles from './Tooltip.module.css';

/* ── Types ── */

export type TooltipTrigger = 'hover' | 'click' | 'focus';

export interface TooltipProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'content' | 'title' | 'children'> {
  /** Tooltip content */
  title: ReactNode;
  /** The element that triggers the tooltip */
  children: ReactNode;
  /** Placement relative to trigger */
  placement?: OverlayPlacement;
  /** Trigger mode */
  trigger?: TooltipTrigger | TooltipTrigger[];
  /** Gap between trigger and tooltip in px */
  gap?: number;
  /** Whether tooltip is visible (controlled) */
  open?: boolean;
  /** Callback when visibility changes */
  onOpenChange?: (open: boolean) => void;
  /** Delay before showing (ms) */
  mouseEnterDelay?: number;
  /** Delay before hiding (ms) */
  mouseLeaveDelay?: number;
  /** Whether to show arrow */
  arrow?: boolean;
  /** Max width of tooltip */
  maxWidth?: number | string;
}

/* ── Semantic DOM ── */

export type TooltipSemanticDOM = 'root' | 'body' | 'arrow';

/* ── Parse trigger options ── */

function parseTriggers(
  trigger: TooltipTrigger | TooltipTrigger[] | undefined,
): Set<TooltipTrigger> {
  if (!trigger) return new Set(['hover']);
  const arr = Array.isArray(trigger) ? trigger : [trigger];
  return new Set(arr);
}

/* ── Component ── */

/**
 * `Tooltip` — floating label that appears on hover, focus, or click.
 *
 * @example
 * <Tooltip title="Save changes">
 *   <Button>Save</Button>
 * </Tooltip>
 *
 * <Tooltip title="Help text" placement="right" trigger="click">
 *   <span>ⓘ</span>
 * </Tooltip>
 */
export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      title,
      children,
      placement = 'top',
      trigger = 'hover',
      gap = 6,
      open: controlledOpen,
      onOpenChange,
      mouseEnterDelay = 200,
      mouseLeaveDelay = 150,
      arrow = true,
      maxWidth = 280,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const triggerRef = useRef<HTMLDivElement>(null!);
    const overlayRef = useRef<HTMLDivElement>(null!);
    const [internalOpen, setInternalOpen] = useState(false);

    const isControlled = controlledOpen !== undefined;
    const open = isControlled ? controlledOpen : internalOpen;

    const { position, update } = useOverlayPosition(triggerRef, overlayRef, {
      placement,
      gap,
      active: open,
    });

    // Measure and position after portal DOM is committed
    useEffect(() => {
      if (open) requestAnimationFrame(() => update());
    }, [open, update]);

    const triggers = parseTriggers(trigger);
    const enterTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
    const leaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

    const setOpen = (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    };

    const handleMouseEnter = () => {
      clearTimeout(leaveTimer.current);
      enterTimer.current = setTimeout(() => setOpen(true), mouseEnterDelay);
    };

    const handleMouseLeave = () => {
      clearTimeout(enterTimer.current);
      leaveTimer.current = setTimeout(() => setOpen(false), mouseLeaveDelay);
    };

    const handleFocus = () => setOpen(true);
    const handleBlur = () => setOpen(false);
    const handleClick = () => setOpen(!open);

    // Assign event handlers based on trigger type
    const eventHandlers: Record<string, (...args: any[]) => void> = {};
    if (triggers.has('hover')) {
      eventHandlers.onMouseEnter = handleMouseEnter;
      eventHandlers.onMouseLeave = handleMouseLeave;
    }
    if (triggers.has('focus')) {
      eventHandlers.onFocus = handleFocus;
      eventHandlers.onBlur = handleBlur;
    }
    if (triggers.has('click')) {
      eventHandlers.onClick = handleClick;
    }

    return (
      <>
        {/* Trigger wrapper */}
        <div
          ref={composeRefs(triggerRef, ref)}
          className={styles.trigger}
          {...eventHandlers}
        >
          {children}
        </div>

        {/* Tooltip overlay via portal */}
        {open &&
          createPortal(
            <div
              ref={overlayRef}
              role="tooltip"
              className={cn(
                styles.root,
                placement === 'top' && styles.placeTop,
                placement === 'bottom' && styles.placeBottom,
                placement === 'left' && styles.placeLeft,
                placement === 'right' && styles.placeRight,
                placement === 'top-start' && styles.placeTop,
                placement === 'top-end' && styles.placeTop,
                placement === 'bottom-start' && styles.placeBottom,
                placement === 'bottom-end' && styles.placeBottom,
                className,
              )}
              style={{
                position: 'fixed',
                top: position?.top ?? -9999,
                left: position?.left ?? -9999,
                maxWidth,
                ...style,
              }}
              {...rest}
            >
              <span className={styles.body}>{title}</span>
              {arrow && <span className={styles.arrow} />}
            </div>,
            document.body,
          )}
      </>
    );
  },
);

Tooltip.displayName = 'Tooltip';

export default Tooltip;
