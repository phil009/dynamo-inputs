import { useRef } from 'preact/hooks';
import type { InputProps } from '../types';

interface FileInputProps extends InputProps {
  onFocus: () => void;
  onBlur: () => void;
}

export function FileInput({ name, value, placeholder, accept, onFocus, onBlur, onChange }: FileInputProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: Event) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      onChange?.(file.name);
    }
  };

  return (
    <>
      <div class="input-file-trigger" onClick={() => fileRef.current?.click()}>
        <span>{value || placeholder || 'Choose file...'}</span>
      </div>
      <input
        ref={fileRef}
        type="file"
        name={name}
        accept={accept}
        onChange={handleFileSelect}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        tabIndex={-1}
      />
      <button type="button" class="input-file-btn" onClick={() => fileRef.current?.click()} aria-label="Upload file">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 1v12M1 7h12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </>
  );
}
