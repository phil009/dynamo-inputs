import { useState, useRef, useEffect, useCallback } from 'preact/hooks';
import type { InputProps } from '../types';

interface SelectInputProps extends InputProps {
  onFocus: () => void;
  onBlur: () => void;
}

export function SelectInput({ name, value, options, onFocus, onBlur, onChange }: SelectInputProps) {
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selected = options?.find((o) => o.value === value);

  const close = useCallback(() => {
    setOpen(false);
    setFocusedIdx(-1);
    onBlur();
  }, [onBlur]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, close]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIdx >= 0 && listRef.current) {
      const items = listRef.current.children;
      items[focusedIdx]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIdx]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!options?.length) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (!open) {
          setOpen(true);
          onFocus();
          setFocusedIdx(options.findIndex((o) => o.value === value));
        } else if (focusedIdx >= 0) {
          onChange?.(options[focusedIdx].value);
          close();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!open) {
          setOpen(true);
          onFocus();
          setFocusedIdx(0);
        } else {
          setFocusedIdx((i) => Math.min(i + 1, options.length - 1));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (open) {
          setFocusedIdx((i) => Math.max(i - 1, 0));
        }
        break;
      case 'Escape':
        if (open) {
          e.preventDefault();
          close();
        }
        break;
      case 'Tab':
        if (open) close();
        break;
    }
  };

  const handleSelect = (val: string) => {
    onChange?.(val);
    close();
  };

  return (
    <div ref={wrapperRef} class="custom-select" tabIndex={0} onKeyDown={handleKeyDown}>
      {/* Hidden native input for form submission */}
      <input type="hidden" name={name} value={value} />

      <div
        class="custom-select-trigger"
        onClick={() => {
          if (open) {
            close();
          } else {
            setOpen(true);
            onFocus();
            setFocusedIdx(options?.findIndex((o) => o.value === value) ?? -1);
          }
        }}
      >
        <span class={`custom-select-value ${selected ? '' : 'placeholder'}`}>
          {selected?.label ?? ''}
        </span>
        <span class={`select-chevron ${open ? 'open' : ''}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
      </div>

      {open && options && (
        <ul ref={listRef} class="custom-select-dropdown" role="listbox">
          {options.map((opt, i) => (
            <li
              key={opt.value}
              role="option"
              class={`custom-select-option ${opt.value === value ? 'selected' : ''} ${i === focusedIdx ? 'focused' : ''}`}
              aria-selected={opt.value === value}
              onClick={() => handleSelect(opt.value)}
              onMouseEnter={() => setFocusedIdx(i)}
            >
              {opt.label}
              {opt.value === value && (
                <svg class="check-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 7l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
