import {
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

import { useControlledState } from '../_shared/hooks/useControlledState';
import { useOverlayPosition } from '../_shared/hooks/useOverlayPosition';
import { cn } from '../_shared/utils/cn';

import styles from './Select.module.css';

/* ═══════════════════════════════════════════════════════════════
 *  Types
 *  ═══════════════════════════════════════════════════════════════ */

export type SelectMode = 'single' | 'multiple' | 'tags';

export interface SelectOptionData {
  label: ReactNode;
  value: string | number;
  disabled?: boolean;
}

export interface SelectGroupData {
  label: ReactNode;
  options: SelectOptionData[];
}

type RawOption = SelectOptionData | SelectGroupData;

export function isOptionData(item: RawOption): item is SelectOptionData {
  return 'value' in item;
}

export interface SelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange' | 'defaultValue'> {
  /** Select mode */
  mode?: SelectMode;
  /** Selected value(s) — controlled */
  value?: string | number | (string | number)[];
  /** Default value — uncontrolled */
  defaultValue?: string | number | (string | number)[];
  /** Callback when selection changes */
  onChange?: (value: string | number | (string | number)[]) => void;
  /** Data-driven options */
  options?: RawOption[];
  /** Placeholder text */
  placeholder?: string;
  /** Enable search input */
  searchable?: boolean;
  /** Placeholder for search */
  searchPlaceholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Error / warning / success status */
  status?: 'default' | 'error' | 'warning' | 'success';
  /** Max tags to show before collapsing (multiple mode) */
  maxTagCount?: number;
  /** Clear the selected value(s) */
  allowClear?: boolean;
  /** Children: Select.Option / Select.Group */
  children?: ReactNode;
  /** Width of the trigger */
  width?: number | string;
}

export type SelectSemanticDOM =
  | 'root'
  | 'trigger'
  | 'popup'
  | 'option'
  | 'tag'
  | 'search';

/* ═══════════════════════════════════════════════════════════════
 *  Utility: flatten options from children
 *  ═══════════════════════════════════════════════════════════════ */

interface FlatOption {
  label: ReactNode;
  value: string | number;
  disabled: boolean;
}

function flattenOptions(options: RawOption[] | undefined): FlatOption[] {
  if (!options) return [];
  const result: FlatOption[] = [];
  for (const item of options) {
    if (isOptionData(item)) {
      result.push({ label: item.label, value: item.value, disabled: item.disabled ?? false });
    } else {
      // Group
      for (const opt of item.options) {
        result.push({ label: opt.label, value: opt.value, disabled: opt.disabled ?? false });
      }
    }
  }
  return result;
}

/* ═══════════════════════════════════════════════════════════════
 *  Status styles map
 *  ═══════════════════════════════════════════════════════════════ */

const statusClass: Record<string, string> = {
  default: '',
  error: styles.statusError,
  warning: styles.statusWarning,
  success: styles.statusSuccess,
};

/* ═══════════════════════════════════════════════════════════════
 *  Select Root Component
 *  ═══════════════════════════════════════════════════════════════ */

/**
 * `Select` — dropdown selector with single, multiple, and tags mode.
 *
 * @example
 * <Select options={[{ label: 'One', value: 1 }, { label: 'Two', value: 2 }]} />
 *
 * <Select mode="multiple" defaultValue={[1, 2]}>
 *   <Select.Option value={1}>One</Select.Option>
 *   <Select.Option value={2}>Two</Select.Option>
 * </Select>
 */
export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      mode = 'single',
      value: controlledValue,
      defaultValue,
      onChange,
      options,
      placeholder = 'Select…',
      searchable = false,
      searchPlaceholder = 'Search…',
      disabled = false,
      status = 'default',
      maxTagCount,
      allowClear = false,
      children: _children,
      width,
      className,
      ...rest
    },
    ref,
  ) => {
    const selectId = useId();
    const triggerRef = useRef<HTMLDivElement>(null!);
    const popupRef = useRef<HTMLDivElement>(null!);
    const searchRef = useRef<HTMLInputElement>(null!);
    const [open, setOpen] = useState(false);
    const [searchText, setSearchText] = useState('');

    // Controlled / uncontrolled value
    const defaultVal = defaultValue ?? (mode === 'single' ? '' : []);
    const [value, setValue] = useControlledState(controlledValue, defaultVal, onChange);

    // Flatten options
    const flatOptions = useMemo(() => flattenOptions(options), [options]);

    // Position the popup
    const { position, update } = useOverlayPosition(triggerRef, popupRef, {
      placement: 'bottom-start',
      gap: 4,
      active: open,
    });

    // Measure and position after portal DOM is committed
    useEffect(() => {
      if (open) requestAnimationFrame(() => update());
    }, [open, update]);

    // Filter options based on search
    const filtered = useMemo(() => {
      const pool = options ? flatOptions : [];
      if (!searchText) return pool;
      const lower = searchText.toLowerCase();
      return pool.filter(
        (opt) => String(opt.label).toLowerCase().includes(lower) || String(opt.value).toLowerCase().includes(lower),
      );
    }, [options, flatOptions, searchText]);

    // Is a value selected?
    const isSelected = (val: string | number) => {
      if (mode === 'single') return value === val;
      return Array.isArray(value) && value.includes(val);
    };

    // Select / deselect
    const handleSelect = (val: string | number) => {
      if (mode === 'single') {
        setValue(val);
        setOpen(false);
      } else {
        const arr = Array.isArray(value) ? [...value] : [];
        const idx = arr.indexOf(val);
        if (idx >= 0) arr.splice(idx, 1);
        else arr.push(val);
        setValue(arr);
      }
    };

    // Clear
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation();
      setValue(mode === 'single' ? '' : []);
    };

    // Remove tag (multiple mode)
    const removeTag = (val: string | number) => {
      if (mode === 'single') return;
      const arr = Array.isArray(value) ? value.filter((v) => v !== val) : [];
      setValue(arr);
    };

    // Keyboard navigation
    const [activeIndex, setActiveIndex] = useState(-1);
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); return; }
      if (!open) {
        if (e.key === 'Enter' || e.key === 'ArrowDown') { setOpen(true); return; }
      }
      if (open) {
        const list = filtered;
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setActiveIndex((prev) => Math.min(prev + 1, list.length - 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setActiveIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (list[activeIndex]) handleSelect(list[activeIndex].value);
        }
      }
    };

    // Close on outside click
    useEffect(() => {
      if (!open) return;
      const handler = (e: MouseEvent) => {
        const target = e.target as Node;
        if (triggerRef.current?.contains(target) || popupRef.current?.contains(target)) return;
        setOpen(false);
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    // Focus search when popup opens
    useEffect(() => {
      if (open && searchable) {
        // Small delay to let DOM render
        requestAnimationFrame(() => searchRef.current?.focus());
      }
      if (!open) setSearchText('');
    }, [open, searchable]);

    // Compute display value
    const selectedLabel = (() => {
      if (mode === 'single' && value) {
        const found = flatOptions.find((o) => o.value === value);
        return found ? found.label : String(value);
      }
      return '';
    })();

    // Tags rendering for multiple mode
    const selectedArr = mode !== 'single' && Array.isArray(value) ? value : [];
    const visibleTags = maxTagCount ? selectedArr.slice(0, maxTagCount) : selectedArr;
    const overflowCount = maxTagCount ? Math.max(0, selectedArr.length - maxTagCount) : 0;

    const rootClasses = cn(
      styles.root,
      disabled ? styles.disabled : null,
      statusClass[status],
      className,
    );

    return (
      <div
        ref={ref}
        className={rootClasses}
        style={width ? { width } : undefined}
        {...rest}
      >
        {/* ── Trigger ── */}
        <div
          ref={triggerRef}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={`${selectId}-popup`}
          tabIndex={disabled ? -1 : 0}
          className={cn(styles.trigger, open ? styles.triggerOpen : null)}
          onClick={() => { if (!disabled) setOpen(!open); }}
          onKeyDown={handleKeyDown}
        >
          {/* Selected display */}
          <span className={styles.display}>
            {mode === 'single' ? (
              value ? (
                <span className={styles.singleValue}>{selectedLabel}</span>
              ) : (
                <span className={styles.placeholder}>{placeholder}</span>
              )
            ) : (
              <>
                {visibleTags.map((val) => (
                  <span key={String(val)} className={styles.tag}>
                    <span className={styles.tagLabel}>
                      {flatOptions.find((o) => o.value === val)?.label ?? val}
                    </span>
                    <button
                      type="button"
                      className={styles.tagRemove}
                      onClick={(e) => { e.stopPropagation(); removeTag(val); }}
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {overflowCount > 0 && (
                  <span className={styles.tagOverflow}>+{overflowCount}</span>
                )}
                {selectedArr.length === 0 && (
                  <span className={styles.placeholder}>{placeholder}</span>
                )}
              </>
            )}
          </span>

          {/* Indicators */}
          <span className={styles.indicators}>
            {allowClear && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={handleClear}
                aria-label="Clear"
                tabIndex={-1}
              >
                ×
              </button>
            )}
            <span className={cn(styles.arrow, open ? styles.arrowUp : null)} aria-hidden="true">
              ▼
            </span>
          </span>
        </div>

        {/* ── Popup (portal) ── */}
        {open && createPortal(
          <div
            ref={popupRef}
            id={`${selectId}-popup`}
            role="listbox"
            className={styles.popup}
            style={{
              position: 'fixed',
              top: position?.top ?? -9999,
              left: position?.left ?? -9999,
              minWidth: triggerRef.current?.offsetWidth ?? 200,
            }}
          >
            {/* Search */}
            {searchable && (
              <div className={styles.searchWrapper}>
                <input
                  ref={searchRef}
                  type="text"
                  className={styles.searchInput}
                  placeholder={searchPlaceholder}
                  value={searchText}
                  onChange={(e) => { setSearchText(e.target.value); setActiveIndex(-1); }}
                  onKeyDown={handleKeyDown}
                />
              </div>
            )}

            {/* Options list */}
            <div className={styles.optionList}>
              {filtered.length === 0 ? (
                <div className={styles.notFound}>No results</div>
              ) : (
                filtered.map((opt, idx) => {
                  const active = activeIndex === idx;
                  const selected = isSelected(opt.value);
                  return (
                    <div
                      key={String(opt.value)}
                      role="option"
                      aria-selected={selected}
                      className={cn(
                        styles.option,
                        active ? styles.optionActive : null,
                        selected ? styles.optionSelected : null,
                        opt.disabled ? styles.optionDisabled : null,
                      )}
                      onClick={() => { if (!opt.disabled) handleSelect(opt.value); }}
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      {mode !== 'single' && (
                        <span className={cn(styles.checkbox, selected ? styles.checkboxChecked : null)}>
                          {selected && '✓'}
                        </span>
                      )}
                      <span className={styles.optionLabel}>{opt.label}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>,
          document.body,
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';

/* ═══════════════════════════════════════════════════════════════
 *  Sub-components
 *  ═══════════════════════════════════════════════════════════════ */

export interface OptionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  value: string | number;
  disabled?: boolean;
  children?: ReactNode;
}

export interface GroupProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  children?: ReactNode;
}

const Option = forwardRef<HTMLDivElement, OptionProps>(
  ({ value, disabled, children, className, ...rest }, ref) => (
    <div
      ref={ref}
      data-select-option-value={value}
      data-select-option-disabled={disabled || undefined}
      className={cn(className)}
      {...rest}
    >
      {children}
    </div>
  ),
);
Option.displayName = 'Select.Option';

const Group = forwardRef<HTMLDivElement, GroupProps>(
  ({ label, children, className, ...rest }, ref) => (
    <div ref={ref} className={cn(className)} {...rest}>
      <div className={styles.groupLabel}>{label}</div>
      {children}
    </div>
  ),
);
Group.displayName = 'Select.Group';

/* ── Compound namespace ── */

export const SelectNamespace = Object.assign(Select, { Option, Group });
export { Group,Option };
export default Select;
