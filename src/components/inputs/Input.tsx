import { useState, useCallback, useRef } from 'preact/hooks';
import type { InputProps, InputState, ValidationResult } from './types';
import { validate } from './validation';
import { TextInput } from './variants/TextInput';
import { PhoneInput } from './variants/PhoneInput';
import { DateInput } from './variants/DateInput';
import { FileInput } from './variants/FileInput';
import { AddressInput } from './variants/AddressInput';
import { SelectInput } from './variants/SelectInput';
import { CurrencyInput } from './variants/CurrencyInput';

export function Input(props: InputProps) {
  const {
    variant,
    label,
    name,
    value: controlledValue,
    required,
    disabled,
    validationRules,
    onChange,
    onValidate,
  } = props;

  const [internalValue, setInternalValue] = useState(controlledValue ?? '');
  const [state, setState] = useState<InputState>(disabled ? 'idle' : 'default');
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [touched, setTouched] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);

  const currentValue = controlledValue !== undefined ? controlledValue : internalValue;
  const hasValue = currentValue.length > 0;

  const handleChange = useCallback(
    (val: string) => {
      setInternalValue(val);
      onChange?.(val);

      // Re-validate on change if already touched
      if (touched) {
        const allRules = [...(required ? [{ type: 'required' as const, message: 'This field is required' }] : []), ...(validationRules ?? [])];
        const result = validate(val, variant, allRules);
        setValidation(result);
        setState(result.state ?? 'active');
        onValidate?.(result);
      }
    },
    [touched, required, validationRules, variant, onChange, onValidate]
  );

  const handleFocus = useCallback(() => {
    if (disabled) return;
    setState('active');
  }, [disabled]);

  const handleBlur = useCallback(() => {
    if (disabled) return;
    setTouched(true);
    const allRules = [...(required ? [{ type: 'required' as const, message: 'This field is required' }] : []), ...(validationRules ?? [])];
    const result = validate(currentValue, variant, allRules);
    setValidation(result);
    onValidate?.(result);

    if (result.state) {
      setState(result.state);
    } else {
      setState(hasValue ? 'idle' : 'default');
    }
  }, [disabled, required, validationRules, currentValue, variant, hasValue, onValidate]);

  const dataState = disabled ? 'disabled' : state;

  const variantProps = {
    ...props,
    value: currentValue,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };

  const renderVariant = () => {
    switch (variant) {
      case 'phone':
        return <PhoneInput {...variantProps} />;
      case 'date':
        return <DateInput {...variantProps} />;
      case 'file':
        return <FileInput {...variantProps} />;
      case 'address':
        return <AddressInput {...variantProps} />;
      case 'select':
        return <SelectInput {...variantProps} />;
      case 'currency':
        return <CurrencyInput {...variantProps} />;
      case 'text':
      default:
        return <TextInput {...variantProps} />;
    }
  };

  const firstMessage = touched && validation?.messages?.[0];

  return (
    <div class="input-wrapper">
      <div
        ref={fieldRef}
        class={`input-field variant-${variant}`}
        data-state={dataState}
        data-float={true}
      >
        <span class="input-label">{label}{required ? '' : ''}</span>
        {renderVariant()}
      </div>
      {firstMessage && (
        <div class="input-message" data-severity={firstMessage.severity}>
          {firstMessage.text}
        </div>
      )}
    </div>
  );
}
