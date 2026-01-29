import { useState, useRef, useEffect, useCallback } from 'preact/hooks';
import type { InputProps } from '../types';

interface PhoneInputProps extends InputProps {
  onFocus: () => void;
  onBlur: () => void;
}

const COUNTRY_CODES = [
  { code: '+44', flag: '\u{1F1EC}\u{1F1E7}', label: 'United Kingdom' },
  { code: '+1',  flag: '\u{1F1FA}\u{1F1F8}', label: 'United States' },
  { code: '+353', flag: '\u{1F1EE}\u{1F1EA}', label: 'Ireland' },
  { code: '+91', flag: '\u{1F1EE}\u{1F1F3}', label: 'India' },
  { code: '+61', flag: '\u{1F1E6}\u{1F1FA}', label: 'Australia' },
  { code: '+49', flag: '\u{1F1E9}\u{1F1EA}', label: 'Germany' },
  { code: '+33', flag: '\u{1F1EB}\u{1F1F7}', label: 'France' },
  { code: '+34', flag: '\u{1F1EA}\u{1F1F8}', label: 'Spain' },
  { code: '+39', flag: '\u{1F1EE}\u{1F1F9}', label: 'Italy' },
  { code: '+81', flag: '\u{1F1EF}\u{1F1F5}', label: 'Japan' },
  { code: '+86', flag: '\u{1F1E8}\u{1F1F3}', label: 'China' },
  { code: '+55', flag: '\u{1F1E7}\u{1F1F7}', label: 'Brazil' },
  { code: '+27', flag: '\u{1F1FF}\u{1F1E6}', label: 'South Africa' },
  { code: '+971', flag: '\u{1F1E6}\u{1F1EA}', label: 'UAE' },
  { code: '+966', flag: '\u{1F1F8}\u{1F1E6}', label: 'Saudi Arabia' },
];

export function PhoneInput({ name, value, placeholder, countryCode, onFocus, onBlur, onChange }: PhoneInputProps) {
  const [selectedCode, setSelectedCode] = useState(
    COUNTRY_CODES.find((c) => c.code === countryCode) ?? COUNTRY_CODES[0]
  );
  const [open, setOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const searchTimerRef = useRef<number>(0);

  const close = useCallback(() => {
    setOpen(false);
    setFocusedIdx(-1);
    setSearch('');
  }, []);

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
      listRef.current.children[focusedIdx]?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIdx]);

  const handlePickerKeyDown = (e: KeyboardEvent) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
        onFocus();
        setFocusedIdx(COUNTRY_CODES.findIndex((c) => c.code === selectedCode.code));
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIdx((i) => Math.min(i + 1, COUNTRY_CODES.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIdx((i) => Math.max(i - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIdx >= 0) {
          setSelectedCode(COUNTRY_CODES[focusedIdx]);
          close();
        }
        break;
      case 'Escape':
        e.preventDefault();
        close();
        break;
      case 'Tab':
        close();
        break;
      default:
        // Type-ahead search
        if (e.key.length === 1) {
          const newSearch = search + e.key.toLowerCase();
          setSearch(newSearch);
          clearTimeout(searchTimerRef.current);
          searchTimerRef.current = window.setTimeout(() => setSearch(''), 800);
          const idx = COUNTRY_CODES.findIndex(
            (c) => c.label.toLowerCase().startsWith(newSearch) || c.code.startsWith(newSearch)
          );
          if (idx >= 0) setFocusedIdx(idx);
        }
    }
  };

  const handleCountrySelect = (country: typeof COUNTRY_CODES[0]) => {
    setSelectedCode(country);
    close();
  };

  return (
    <>
      {/* Country code picker */}
      <div ref={wrapperRef} class="phone-country-picker">
        <button
          type="button"
          class="phone-country-trigger"
          onClick={() => {
            if (open) {
              close();
            } else {
              setOpen(true);
              onFocus();
              setFocusedIdx(COUNTRY_CODES.findIndex((c) => c.code === selectedCode.code));
            }
          }}
          onKeyDown={handlePickerKeyDown}
        >
          <span class="phone-country-flag">{selectedCode.flag}</span>
          <span class="phone-country-code">{selectedCode.code}</span>
          <svg class={`phone-country-chevron ${open ? 'open' : ''}`} width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2.5 3.75l2.5 2.5 2.5-2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        {open && (
          <ul ref={listRef} class="phone-country-dropdown custom-select-dropdown" role="listbox">
            {COUNTRY_CODES.map((c, i) => (
              <li
                key={c.code}
                role="option"
                class={`custom-select-option ${c.code === selectedCode.code ? 'selected' : ''} ${i === focusedIdx ? 'focused' : ''}`}
                aria-selected={c.code === selectedCode.code}
                onClick={() => handleCountrySelect(c)}
                onMouseEnter={() => setFocusedIdx(i)}
              >
                <span class="phone-option-flag">{c.flag}</span>
                <span class="phone-option-label">{c.label}</span>
                <span class="phone-option-code">{c.code}</span>
                {c.code === selectedCode.code && (
                  <svg class="check-icon" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7l3 3 5-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Divider */}
      <div class="phone-divider" />

      {/* Phone number input */}
      <input
        class="input-control"
        type="tel"
        name={name}
        value={value}
        placeholder={placeholder ?? '7904567670'}
        onFocus={onFocus}
        onBlur={onBlur}
        onInput={(e) => onChange?.((e.target as HTMLInputElement).value)}
        autocomplete="tel"
      />
    </>
  );
}
