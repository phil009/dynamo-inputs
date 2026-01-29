import type { ValidationRule, ValidationResult, InputVariant } from './types';

/** Built-in rules applied automatically per variant (unless overridden) */
const BUILTIN_RULES: Partial<Record<InputVariant, ValidationRule[]>> = {
  phone: [
    {
      type: 'pattern',
      value: /^\+?[\d\s\-()]{7,20}$/,
      message: 'Enter a valid phone number',
    },
  ],
  date: [
    {
      type: 'pattern',
      value: /^\d{4}[\/\-]\d{2}[\/\-]\d{2}$/,
      message: 'Enter a valid date (yyyy/mm/dd)',
    },
  ],
  address: [
    {
      type: 'minLength',
      value: 16,
      message: 'Minimum 16 characters',
    },
  ],
  currency: [
    {
      type: 'pattern',
      value: /^-?\d+(\.\d{1,4})?$/,
      message: 'Enter a valid number',
    },
  ],
};

function runRule(rule: ValidationRule, value: string): string | null {
  const severity = rule.severity ?? 'error';
  switch (rule.type) {
    case 'required':
      return value.trim() === '' ? rule.message : null;
    case 'minLength':
      return value.length < (rule.value as number) ? rule.message : null;
    case 'maxLength':
      return value.length > (rule.value as number) ? rule.message : null;
    case 'pattern': {
      const re = rule.value instanceof RegExp ? rule.value : new RegExp(rule.value as string);
      return value !== '' && !re.test(value) ? rule.message : null;
    }
    case 'min':
      return value !== '' && Number(value) < (rule.value as number) ? rule.message : null;
    case 'max':
      return value !== '' && Number(value) > (rule.value as number) ? rule.message : null;
    case 'fileType': {
      if (!value) return null;
      const allowed = rule.value as string[];
      const ext = value.split('.').pop()?.toLowerCase() ?? '';
      return !allowed.includes(ext) ? rule.message : null;
    }
    case 'fileSize':
      // File size is validated in the component; this is a placeholder
      return null;
    case 'custom':
      // Custom rules should use pattern or be handled externally
      return null;
    default:
      return null;
  }
}

export function validate(
  value: string,
  variant: InputVariant,
  customRules?: ValidationRule[]
): ValidationResult {
  const builtIn = BUILTIN_RULES[variant] ?? [];
  const allRules = [...builtIn, ...(customRules ?? [])];

  const messages: ValidationResult['messages'] = [];

  for (const rule of allRules) {
    const msg = runRule(rule, value);
    if (msg) {
      messages.push({ text: msg, severity: rule.severity ?? 'error' });
    }
  }

  const hasError = messages.some((m) => m.severity === 'error');
  const hasWarning = messages.some((m) => m.severity === 'warning');

  return {
    valid: !hasError,
    state: hasError ? 'error' : hasWarning ? 'warning' : null,
    messages,
  };
}

/** Check list style validation (e.g. "✓ Minimum 16 characters") */
export function validateChecklist(
  value: string,
  rules: ValidationRule[]
): { text: string; passed: boolean }[] {
  return rules.map((rule) => ({
    text: rule.message,
    passed: runRule(rule, value) === null,
  }));
}
