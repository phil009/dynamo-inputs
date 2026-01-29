import type { InputProps } from '../types';

interface CurrencyInputProps extends InputProps {
  onFocus: () => void;
  onBlur: () => void;
}

export function CurrencyInput({ name, value, placeholder, prefix, suffix, onFocus, onBlur, onChange }: CurrencyInputProps) {
  return (
    <>
      {prefix && <span class="input-prefix">{prefix}</span>}
      <input
        class="input-control"
        type="text"
        inputMode="decimal"
        name={name}
        value={value}
        placeholder={placeholder ?? '0'}
        onFocus={onFocus}
        onBlur={onBlur}
        onInput={(e) => onChange?.((e.target as HTMLInputElement).value)}
        autocomplete="off"
      />
      {suffix && (
        <div class="currency-suffix-group">
          <span class="input-suffix">{suffix}</span>
        </div>
      )}
    </>
  );
}
