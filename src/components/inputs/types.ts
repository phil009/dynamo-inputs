import type { ComponentChildren } from 'preact';

export type InputVariant = 'text' | 'phone' | 'date' | 'file' | 'address' | 'select' | 'currency';
export type InputState = 'default' | 'active' | 'error' | 'warning' | 'idle';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'min' | 'max' | 'fileType' | 'fileSize' | 'custom';
  value?: string | number | RegExp | string[];
  message: string;
  /** 'error' by default */
  severity?: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  state: 'error' | 'warning' | null;
  messages: { text: string; severity: 'error' | 'warning' }[];
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface InputProps {
  variant: InputVariant;
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: ComponentChildren;
  prefix?: string;
  suffix?: string;
  validationRules?: ValidationRule[];
  /** For select variant */
  options?: SelectOption[];
  /** For file variant */
  accept?: string;
  /** For date variant */
  minDate?: string;
  maxDate?: string;
  /** For phone variant — default country code */
  countryCode?: string;
  onChange?: (value: string) => void;
  onValidate?: (result: ValidationResult) => void;
}
