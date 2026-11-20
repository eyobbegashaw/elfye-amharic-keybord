import { TransliterationOptions } from '@elfye/core';

export interface UseAmharicOptions {
  /**
   * Initial enabled state when uncontrolled.
   * Default: true.
   */
  defaultEnabled?: boolean;

  /**
   * Controlled enabled state.
   */
  enabled?: boolean;

  /**
   * Callback fired when enabled state changes.
   */
  onEnabledChange?: (enabled: boolean) => void;

  /**
   * Core transliteration options (escape character, punctuation, digits, etc.).
   */
  options?: TransliterationOptions;

  /**
   * Keyboard shortcut to toggle English / Amharic.
   * Default: Ctrl+Space (or Cmd+Space on macOS).
   */
  toggleKey?: string;

  /**
   * Whether to enable the shortcut key toggle.
   * Default: true.
   */
  enableShortcut?: boolean;
}

export interface UseAmharicReturn<T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement | HTMLTextAreaElement> {
  /**
   * Ref to attach to the input or textarea element.
   */
  ref: React.RefObject<T | null>;

  /**
   * Current value of the input or textarea element.
   */
  value: string;

  /**
   * Direct setter for the value.
   */
  setValue: React.Dispatch<React.SetStateAction<string>>;

  /**
   * Whether Amharic transliteration is currently enabled.
   */
  enabled: boolean;

  /**
   * Set the enabled state.
   */
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;

  /**
   * Toggle between English and Amharic.
   */
  toggleEnabled: () => void;

  /**
   * Resets the composing engine buffer.
   */
  reset: () => void;

  /**
   * Event handlers to attach to the input/textarea.
   */
  onBeforeInput: (e: React.FormEvent<T>) => void;
  onKeyDown: (e: React.KeyboardEvent<T>) => void;
  onSelect: (e: React.SyntheticEvent<T>) => void;
  onPaste: (e: React.ClipboardEvent<T>) => void;
  onCompositionStart: (e: React.CompositionEvent<T>) => void;
  onCompositionUpdate: (e: React.CompositionEvent<T>) => void;
  onCompositionEnd: (e: React.CompositionEvent<T>) => void;
  onBlur: (e: React.FocusEvent<T>) => void;
  onChange: (e: React.ChangeEvent<T>) => void;

  /**
   * Helper bundle of all handlers and ref to spread onto `<input {...bind} />`.
   */
  bind: {
    ref: React.RefObject<T | null>;
    value?: string;
    onBeforeInput: (e: React.FormEvent<T>) => void;
    onKeyDown: (e: React.KeyboardEvent<T>) => void;
    onSelect: (e: React.SyntheticEvent<T>) => void;
    onPaste: (e: React.ClipboardEvent<T>) => void;
    onCompositionStart: (e: React.CompositionEvent<T>) => void;
    onCompositionUpdate: (e: React.CompositionEvent<T>) => void;
    onCompositionEnd: (e: React.CompositionEvent<T>) => void;
    onBlur: (e: React.FocusEvent<T>) => void;
    onChange: (e: React.ChangeEvent<T>) => void;
  };
}
