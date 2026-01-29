import type { InputProps } from '../types';

interface TextInputProps extends InputProps {
  onFocus: () => void;
  onBlur: () => void;
}

export function TextInput({ name, value, placeholder, prefix, suffix, icon, onFocus, onBlur, onChange }: TextInputProps) {
  return (
    <>
      {prefix && <span class="input-prefix">{prefix}</span>}
      {icon && <span class="input-icon">{icon}</span>}
      <input
        class="input-control"
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        onFocus={onFocus}
        onBlur={onBlur}
        onInput={(e) => onChange?.((e.target as HTMLInputElement).value)}
        autocomplete="off"
      />
      {suffix && <span class="input-suffix">{suffix}</span>}
    </>
  );
}
