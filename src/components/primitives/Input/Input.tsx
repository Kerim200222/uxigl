import React, { useId, useState } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';
import type {
  FormControlContract,
  IconSlotProps,
} from '../../../core/contracts/ComponentContracts';

/**
 * ============================================================================
 * uxiGL PRIMITIVE — INPUT (STANDARD, MASKED, VALIDATED, PREFIX/SUFFIX)
 * ============================================================================
 * Hybrid of Apple Spotlight translucent input & Material M3 Outlined/Filled field.
 *
 * SOLID Principles Applied:
 * - [LSP] Implements `FormControlContract<string>`, enabling seamless swap with
 *   any other uxiGL text control.
 * - [OCP] Extensible via `mask`, `validationState`, `prefixText`, `suffixText`,
 *   `leadingIcon`, `trailingIcon`, and `clearable`.
 */

export type InputSurfaceStyle = 'glass' | 'tonal' | 'outlined';

export type InputValidationState = 'default' | 'success' | 'warning' | 'error';

export type InputMaskPreset =
  | 'none'
  | 'phone'
  | 'iban'
  | 'tax-id'
  | 'credit-card'
  | 'date-mask';

export function applyInputMask(raw: string, mask?: InputMaskPreset): string {
  if (!mask || mask === 'none') return raw;

  if (mask === 'phone') {
    const digits = raw.replace(/\D/g, '').replace(/^90/, '').slice(0, 10);
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    if (digits.length <= 8) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)} ${digits.slice(
      6,
      8
    )} ${digits.slice(8, 10)}`;
  }

  if (mask === 'iban') {
    const clean = raw
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .replace(/^TR/, '');
    const digits = clean.replace(/\D/g, '').slice(0, 24);
    const full = `TR${digits}`;
    return full.replace(/(.{4})/g, '$1 ').trim();
  }

  if (mask === 'tax-id') {
    const digits = raw.replace(/\D/g, '').slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  }

  if (mask === 'credit-card') {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  }

  if (mask === 'date-mask') {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
    return `${digits.slice(0, 2)}.${digits.slice(2, 4)}.${digits.slice(4, 8)}`;
  }

  return raw;
}

export interface InputProps
  extends FormControlContract<string>,
    IconSlotProps {
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'number' | 'url' | 'tel';
  surface?: InputSurfaceStyle;
  clearable?: boolean;
  maxLength?: number;
  showCount?: boolean;
  shortcutHint?: string;
  autoFocus?: boolean;
  /** Enterprise mask formatting ('phone' | 'iban' | 'tax-id' | 'credit-card' | 'date-mask') */
  mask?: InputMaskPreset;
  /** Semantic validation state */
  validationState?: InputValidationState;
  successText?: string;
  warningText?: string;
  /** Optional prefix & suffix badges inside the field */
  prefixText?: string;
  suffixText?: string;
  /** Allows toggling password visibility when type === 'password' */
  revealablePassword?: boolean;
  /** Accessible label when no visible label element is provided */
  'aria-label'?: string;
}

export const Input: React.FC<InputProps> = ({
  id,
  className = '',
  style,
  value,
  onChange,
  label,
  helperText,
  errorText,
  successText,
  warningText,
  validationState,
  required = false,
  disabled = false,
  size = 'md',
  placeholder,
  type = 'text',
  surface = 'glass',
  leadingIcon,
  trailingIcon,
  clearable = false,
  maxLength,
  showCount = false,
  shortcutHint,
  name,
  autoFocus = false,
  mask = 'none',
  prefixText,
  suffixText,
  revealablePassword = false,
  'aria-label': ariaLabel,
}) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [showPassword, setShowPassword] = useState(false);

  const resolvedValidation: InputValidationState = validationState
    ? validationState
    : errorText
    ? 'error'
    : warningText
    ? 'warning'
    : successText
    ? 'success'
    : 'default';

  const hasError = resolvedValidation === 'error';

  const wrapperClasses = [
    'uxu-field',
    `uxu-field--${size}`,
    disabled ? 'uxu-field--disabled' : '',
    resolvedValidation !== 'default'
      ? `uxu-field--${resolvedValidation}`
      : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const controlClasses = [
    'uxu-input-box',
    `uxu-input-box--${surface}`,
    `uxu-input-box--${size}`,
    resolvedValidation !== 'default'
      ? `uxu-input-box--${resolvedValidation}`
      : '',
    disabled ? 'uxu-input-box--disabled' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const formatted =
      mask && mask !== 'none' ? applyInputMask(rawVal, mask) : rawVal;
    onChange(formatted);
  };

  const renderValidationIcon = () => {
    if (resolvedValidation === 'success') {
      return (
        <span className="uxu-input-box__status uxu-input-box__status--success">
          <CheckCircle2 size={15} />
        </span>
      );
    }
    if (resolvedValidation === 'warning') {
      return (
        <span className="uxu-input-box__status uxu-input-box__status--warning">
          <AlertTriangle size={15} />
        </span>
      );
    }
    if (resolvedValidation === 'error') {
      return (
        <span className="uxu-input-box__status uxu-input-box__status--error">
          <AlertCircle size={15} />
        </span>
      );
    }
    return null;
  };

  const feedbackMessage =
    resolvedValidation === 'error'
      ? errorText ?? helperText
      : resolvedValidation === 'warning'
      ? warningText ?? helperText
      : resolvedValidation === 'success'
      ? successText ?? helperText
      : helperText;

  const effectiveInputType =
    type === 'password' && revealablePassword && showPassword ? 'text' : type;

  return (
    <div className={wrapperClasses} style={style}>
      {(label || (showCount && maxLength) || (mask && mask !== 'none')) && (
        <div className="uxu-field__header">
          {label && (
            <label htmlFor={inputId} className="uxu-field__label">
              {label}
              {required && <span className="uxu-field__required">*</span>}
            </label>
          )}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {mask && mask !== 'none' && (
              <span className="uxu-field__mask-badge">
                MASK: {mask.toUpperCase()}
              </span>
            )}
            {showCount && maxLength && (
              <span className="uxu-field__counter">
                {value.length}/{maxLength}
              </span>
            )}
          </div>
        </div>
      )}

      <div className={controlClasses}>
        {leadingIcon && (
          <span className="uxu-input-box__icon uxu-input-box__icon--leading">
            {leadingIcon}
          </span>
        )}

        {prefixText && (
          <span className="uxu-input-box__affix uxu-input-box__affix--prefix">
            {prefixText}
          </span>
        )}

        <input
          id={inputId}
          name={name}
          type={effectiveInputType}
          value={value}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          placeholder={placeholder}
          aria-label={
            ariaLabel ?? (typeof label === 'string' ? undefined : placeholder)
          }
          autoFocus={autoFocus}
          aria-invalid={hasError}
          onChange={handleInputChange}
          className={`uxu-input-box__native ${
            mask && mask !== 'none' ? 'uxu-input-box__native--mono' : ''
          }`}
        />

        {suffixText && (
          <span className="uxu-input-box__affix uxu-input-box__affix--suffix">
            {suffixText}
          </span>
        )}

        {type === 'password' && revealablePassword && !disabled && (
          <button
            type="button"
            className="uxu-input-box__clear"
            onClick={() => setShowPassword((p) => !p)}
            aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
          >
            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}

        {clearable && value.length > 0 && !disabled && (
          <button
            type="button"
            className="uxu-input-box__clear"
            onClick={() => onChange('')}
            aria-label="Metni temizle"
          >
            <X size={14} />
          </button>
        )}

        {renderValidationIcon()}

        {shortcutHint && !value && (
          <kbd className="uxu-input-box__kbd">{shortcutHint}</kbd>
        )}

        {trailingIcon && (
          <span className="uxu-input-box__icon uxu-input-box__icon--trailing">
            {trailingIcon}
          </span>
        )}
      </div>

      {feedbackMessage && (
        <div
          className={`uxu-field__helper ${
            resolvedValidation !== 'default'
              ? `uxu-field__helper--${resolvedValidation}`
              : ''
          }`}
        >
          {feedbackMessage}
        </div>
      )}
    </div>
  );
};
