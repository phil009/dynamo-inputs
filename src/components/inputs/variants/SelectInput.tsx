import type { InputProps } from '../types';

interface SelectInputProps extends InputProps {
  onFocus: () => void;
  onBlur: () => void;
}

export function SelectInput({ name, value, options, onFocus, onBlur, onChange }: SelectInputProps) {
  return (
    <>
      <select
        class="input-select-native"
        name={name}
        value={value}
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={(e) => onChange?.((e.target as HTMLSelectElement).value)}
      >
        <option value="" disabled hidden />
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span class="select-chevron">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
    </>
  );
}
