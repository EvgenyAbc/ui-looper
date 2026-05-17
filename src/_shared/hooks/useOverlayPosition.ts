import { type RefObject,useCallback, useEffect, useRef, useState } from 'react';

/* ── Types ── */

export type OverlayPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-start'
  | 'top-end'
  | 'bottom-start'
  | 'bottom-end';

export interface OverlayPosition {
  top: number;
  left: number;
}

export interface UseOverlayPositionOptions {
  gap?: number;
  placement?: OverlayPlacement;
  /** When true, re-positions on scroll/resize */
  active?: boolean;
}

/* ── Compute position ── */

function computePosition(
  triggerRect: DOMRect,
  overlayRect: DOMRect,
  placement: OverlayPlacement,
  gap: number,
): OverlayPosition {
  const centerX = triggerRect.left + triggerRect.width / 2 - overlayRect.width / 2;
  const centerY = triggerRect.top + triggerRect.height / 2 - overlayRect.height / 2;

  switch (placement) {
    case 'top':
      return { top: triggerRect.top - overlayRect.height - gap, left: centerX };
    case 'bottom':
      return { top: triggerRect.bottom + gap, left: centerX };
    case 'left':
      return { top: centerY, left: triggerRect.left - overlayRect.width - gap };
    case 'right':
      return { top: centerY, left: triggerRect.right + gap };
    case 'top-start':
      return { top: triggerRect.top - overlayRect.height - gap, left: triggerRect.left };
    case 'top-end':
      return { top: triggerRect.top - overlayRect.height - gap, left: triggerRect.right - overlayRect.width };
    case 'bottom-start':
      return { top: triggerRect.bottom + gap, left: triggerRect.left };
    case 'bottom-end':
      return { top: triggerRect.bottom + gap, left: triggerRect.right - overlayRect.width };
  }
}

/* ── Hook ── */

/**
 * `useOverlayPosition` — computes overlay position relative to a trigger.
 *
 * @example
 * const { position, update } = useOverlayPosition(
 *   triggerRef, overlayRef,
 *   { placement: 'bottom', active: open },
 * );
 *
 * useEffect(() => {
 *   if (open) requestAnimationFrame(() => update());
 * }, [open, update]);
 */
export function useOverlayPosition(
  triggerRef: RefObject<HTMLElement | null>,
  overlayRef: RefObject<HTMLElement | null>,
  options: UseOverlayPositionOptions = {},
) {
  const { gap = 6, placement = 'top', active = false } = options;
  const [position, setPosition] = useState<OverlayPosition | null>(null);
  const frameRef = useRef(0);

  const update = useCallback(() => {
    const trigger = triggerRef.current;
    const overlay = overlayRef.current;
    if (!trigger || !overlay) return;

    const triggerRect = trigger.getBoundingClientRect();
    const overlayRect = overlay.getBoundingClientRect();

    setPosition(computePosition(triggerRect, overlayRect, placement, gap));
  }, [triggerRef, overlayRef, placement, gap]);

  // Re-position on scroll/resize while active
  useEffect(() => {
    if (!active) return;
    const onRefresh = () => {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onRefresh, true);
    window.addEventListener('resize', onRefresh);
    return () => {
      window.removeEventListener('scroll', onRefresh, true);
      window.removeEventListener('resize', onRefresh);
      cancelAnimationFrame(frameRef.current);
    };
  }, [active, update]);

  return { position, update };
}
