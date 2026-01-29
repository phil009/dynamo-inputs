import type { InputProps } from '../types';

interface AddressInputProps extends InputProps {
  onFocus: () => void;
  onBlur: () => void;
}

export function AddressInput({ name, value, placeholder, icon, onFocus, onBlur, onChange }: AddressInputProps) {
  return (
    <>
      <input
        class="input-control"
        type="text"
        name={name}
        value={value}
        placeholder={placeholder ?? 'Start typing an address...'}
        onFocus={onFocus}
        onBlur={onBlur}
        onInput={(e) => onChange?.((e.target as HTMLInputElement).value)}
        autocomplete="street-address"
      />
      {icon ?? (
        <span class="input-icon">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 1C5.24 1 3 3.24 3 6c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5zm0 7a2 2 0 110-4 2 2 0 010 4z" fill="currentColor"/>
          </svg>
        </span>
      )}
    </>
  );
}
