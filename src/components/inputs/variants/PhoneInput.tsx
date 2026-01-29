import { useState } from 'preact/hooks';
import type { InputProps } from '../types';

interface PhoneInputProps extends InputProps {
  onFocus: () => void;
  onBlur: () => void;
}

const COUNTRY_CODES = [
  { code: '+44', flag: '🇬🇧', label: 'UK' },
  { code: '+1', flag: '🇺🇸', label: 'US' },
  { code: '+353', flag: '🇮🇪', label: 'IE' },
  { code: '+91', flag: '🇮🇳', label: 'IN' },
  { code: '+61', flag: '🇦🇺', label: 'AU' },
];

export function PhoneInput({ name, value, placeholder, countryCode, onFocus, onBlur, onChange }: PhoneInputProps) {
  const [selectedCode, setSelectedCode] = useState(
    COUNTRY_CODES.find((c) => c.code === countryCode) ?? COUNTRY_CODES[0]
  );

  return (
    <>
      <select
        class="input-control"
        style={{
          flex: '0 0 auto',
          width: '72px',
          appearance: 'none',
          cursor: 'pointer',
          padding: '0',
          textAlign: 'center',
        }}
        value={selectedCode.code}
        onChange={(e) => {
          const found = COUNTRY_CODES.find((c) => c.code === (e.target as HTMLSelectElement).value);
          if (found) setSelectedCode(found);
        }}
        onFocus={onFocus}
        onBlur={onBlur}
      >
        {COUNTRY_CODES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.code}
          </option>
        ))}
      </select>
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
