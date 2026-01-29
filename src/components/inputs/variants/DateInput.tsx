import { useRef } from 'preact/hooks';
import type { InputProps } from '../types';

interface DateInputProps extends InputProps {
  onFocus: () => void;
  onBlur: () => void;
}

export function DateInput({ name, value, placeholder, minDate, maxDate, onFocus, onBlur, onChange }: DateInputProps) {
  const hiddenRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    hiddenRef.current?.showPicker?.();
    hiddenRef.current?.click();
  };

  const handleDateChange = (e: Event) => {
    const raw = (e.target as HTMLInputElement).value; // yyyy-mm-dd
    if (raw) {
      const formatted = raw.replace(/-/g, '/');
      onChange?.(formatted);
    }
  };

  return (
    <>
      <input
        class="input-control"
        type="text"
        name={name}
        value={value}
        placeholder={placeholder ?? 'yyyy/mm/dd'}
        onFocus={onFocus}
        onBlur={onBlur}
        onInput={(e) => onChange?.((e.target as HTMLInputElement).value)}
        autocomplete="off"
      />
      <input
        ref={hiddenRef}
        type="date"
        min={minDate}
        max={maxDate}
        onChange={handleDateChange}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        tabIndex={-1}
      />
      <button type="button" class="input-date-trigger" onClick={openPicker} aria-label="Open date picker">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 1v2M11 1v2M1 6h14M3 3h10a2 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2V5a2 2 0 012-2z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </>
  );
}
