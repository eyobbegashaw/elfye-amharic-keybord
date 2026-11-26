import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { LiveTypingEngine, transliterate } from '@elfye/core';
import { UseAmharicOptions, UseAmharicReturn } from './types.js';

/**
 * Safely inserts or replaces text at a specific range in an input/textarea element.
 * Prioritizes document.execCommand('insertText') to preserve the native Undo stack.
 */
function insertTextAtRange(
  el: HTMLInputElement | HTMLTextAreaElement,
  replacement: string,
  start: number,
  end: number,
): number {
  el.focus();
  el.setSelectionRange(start, end);

  let success = false;
  try {
    if (typeof document !== 'undefined' && typeof document.execCommand === 'function') {
      success = document.execCommand('insertText', false, replacement);
    }
  } catch {
    success = false;
  }

  const newCaret = start + replacement.length;

  if (!success) {
    const val = el.value;
    const nextVal = val.slice(0, start) + replacement + val.slice(end);

    // Call native prototype setter to notify React's internal value tracker
    const prototype = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
    const nativeSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
    if (nativeSetter) {
      nativeSetter.call(el, nextVal);
    } else {
      el.value = nextVal;
    }

    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.setSelectionRange(newCaret, newCaret);
  }

  return newCaret;
}

/**
 * React hook for live Amharic phonetic transliteration on any input or textarea.
 */
export function useAmharic<T extends HTMLInputElement | HTMLTextAreaElement = HTMLInputElement | HTMLTextAreaElement>(
  options: UseAmharicOptions = {},
): UseAmharicReturn<T> {
  const {
    defaultEnabled = true,
    enabled: controlledEnabled,
    onEnabledChange,
    options: coreOptions,
    toggleKey = 'Space',
    enableShortcut = true,
  } = options;

  const [uncontrolledEnabled, setUncontrolledEnabled] = useState(defaultEnabled);
  const isEnabled = controlledEnabled !== undefined ? controlledEnabled : uncontrolledEnabled;

  const [value, setValue] = useState('');

  const ref = useRef<T | null>(null);
  const engineRef = useRef<LiveTypingEngine>(new LiveTypingEngine(coreOptions));

  // Range [start, end] of the current composing syllable in the element's text
  const composingSpanRef = useRef<[number, number] | null>(null);

  // Caret position to restore in useLayoutEffect
  const targetCaretRef = useRef<number | null>(null);

  // Track native composition (Android Chrome / virtual keyboards)
  const isNativeComposingRef = useRef(false);

  // Update engine only when coreOptions values actually change (avoid resetting buffer on inline object renders)
  const prevOptionsRef = useRef(coreOptions);
  const prev = prevOptionsRef.current;
  if (
    prev?.allowWaForLabial !== coreOptions?.allowWaForLabial ||
    prev?.convertPunctuation !== coreOptions?.convertPunctuation ||
    prev?.convertDigits !== coreOptions?.convertDigits ||
    prev?.enableSeraAliases !== coreOptions?.enableSeraAliases ||
    prev?.escapeChar !== coreOptions?.escapeChar
  ) {
    prevOptionsRef.current = coreOptions;
    engineRef.current = new LiveTypingEngine(coreOptions);
    composingSpanRef.current = null;
  }

  const setEnabled = useCallback(
    (valOrFn: React.SetStateAction<boolean>) => {
      const next = typeof valOrFn === 'function' ? valOrFn(isEnabled) : valOrFn;
      if (controlledEnabled === undefined) {
        setUncontrolledEnabled(next);
      }
      onEnabledChange?.(next);
      if (!next) {
        engineRef.current.reset();
        composingSpanRef.current = null;
      }
    },
    [controlledEnabled, isEnabled, onEnabledChange],
  );

  const toggleEnabled = useCallback(() => {
    setEnabled((prev) => !prev);
  }, [setEnabled]);

  const reset = useCallback(() => {
    engineRef.current.reset();
    composingSpanRef.current = null;
  }, []);

  // Restore caret position after DOM updates
  useLayoutEffect(() => {
    if (targetCaretRef.current !== null && ref.current) {
      const pos = targetCaretRef.current;
      targetCaretRef.current = null;
      ref.current.setSelectionRange(pos, pos);
    }
  });

  const commitCurrentSpan = useCallback(() => {
    engineRef.current.commitCurrent();
    composingSpanRef.current = null;
  }, []);

  const handleInputText = useCallback(
    (text: string, el: T) => {
      if (!text) return;

      const engine = engineRef.current;
      let start = el.selectionStart ?? el.value.length;
      let end = el.selectionEnd ?? el.value.length;

      // If we have an active composing syllable span
      if (composingSpanRef.current !== null) {
        [start, end] = composingSpanRef.current;
      }

      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const res = engine.input(char);

        if (res.committed && res.composing) {
          // Both committed (previous syllable) and new composing syllable
          const fullInsert = res.committed + res.composing;
          const newCaret = insertTextAtRange(el, fullInsert, start, end);
          const newSpanStart = start + res.committed.length;
          const newSpanEnd = newCaret;
          composingSpanRef.current = [newSpanStart, newSpanEnd];
          start = newSpanStart;
          end = newSpanEnd;
          targetCaretRef.current = newCaret;
        } else if (res.composing) {
          // Only composing syllable updated (e.g. 's' -> 'e' -> 'ሰ')
          const newCaret = insertTextAtRange(el, res.composing, start, end);
          composingSpanRef.current = [start, newCaret];
          end = newCaret;
          targetCaretRef.current = newCaret;
        } else if (res.committed) {
          // Character/syllable finalized (e.g. space, punctuation)
          const newCaret = insertTextAtRange(el, res.committed, start, end);
          composingSpanRef.current = null;
          start = newCaret;
          end = newCaret;
          targetCaretRef.current = newCaret;
        } else {
          // Empty result (e.g. escape char consumed)
          composingSpanRef.current = null;
        }
      }

      setValue(el.value);
    },
    [],
  );

  const handleBackspace = useCallback((el: T): boolean => {
    const engine = engineRef.current;
    if (composingSpanRef.current === null || engine.getBuffer().length === 0) {
      // Nothing in composing buffer: let browser perform native deletion
      return false;
    }

    const [start, end] = composingSpanRef.current;
    const res = engine.backspace();

    if (res.composing) {
      // Replaced with previous form (e.g. ሰ -> ስ)
      const newCaret = insertTextAtRange(el, res.composing, start, end);
      composingSpanRef.current = [start, newCaret];
      targetCaretRef.current = newCaret;
    } else {
      // Buffer became empty -> delete composing char
      const newCaret = insertTextAtRange(el, '', start, end);
      composingSpanRef.current = null;
      targetCaretRef.current = newCaret;
    }

    setValue(el.value);
    return true;
  }, []);

  // Shared beforeinput event processor
  const handleBeforeInputEvent = useCallback(
    (e: Event | React.FormEvent<T>, el: T) => {
      if (!isEnabled) return;

      const rawEvent = 'nativeEvent' in e ? e.nativeEvent : e;
      // If React synthesized onBeforeInput from compositionend, do not insert text again
      if ((rawEvent as any).type === 'compositionend') {
        commitCurrentSpan();
        return;
      }

      // Prevent duplicate processing if both native and synthetic handlers trigger
      if ((rawEvent as any)._amharicHandled) return;
      (rawEvent as any)._amharicHandled = true;

      const inputType =
        (rawEvent as any).inputType ||
        (e as any).inputType ||
        'insertText';

      const data =
        (rawEvent as any).data !== undefined
          ? (rawEvent as any).data
          : (e as any).data !== undefined
          ? (e as any).data
          : '';

      if (inputType === 'insertText' || inputType === 'insertCompositionText') {
        if (data) {
          if (typeof e.preventDefault === 'function') {
            e.preventDefault();
          }
          handleInputText(data, el);
        }
      } else if (inputType === 'deleteContentBackward') {
        const handled = handleBackspace(el);
        if (handled && typeof e.preventDefault === 'function') {
          e.preventDefault();
        }
      } else if (inputType === 'insertFromPaste') {
        // Handled in onPaste
      }
    },
    [isEnabled, handleInputText, handleBackspace],
  );

  // Attach native beforeinput listener to ref.current to guarantee capture
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onNativeBeforeInput = (e: Event) => {
      handleBeforeInputEvent(e, el);
    };

    el.addEventListener('beforeinput', onNativeBeforeInput);
    return () => {
      el.removeEventListener('beforeinput', onNativeBeforeInput);
    };
  }, [handleBeforeInputEvent]);

  // -------------------------------------------------------------
  // Event Handlers for React props / bind
  // -------------------------------------------------------------

  const onBeforeInput = useCallback(
    (e: React.FormEvent<T>) => {
      const el = (e.target as T) || ref.current;
      if (!el) return;
      handleBeforeInputEvent(e, el);
    },
    [handleBeforeInputEvent],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<T>) => {
      // Keyboard shortcut to toggle English / Amharic (Ctrl+Space or Cmd+Space)
      if (enableShortcut && (e.ctrlKey || e.metaKey) && (e.code === toggleKey || e.key === ' ')) {
        e.preventDefault();
        toggleEnabled();
        return;
      }

      if (!isEnabled) return;
      const el = e.currentTarget;

      if (e.key === 'Escape') {
        commitCurrentSpan();
        return;
      }

      // Enter, Tab, Arrow keys move caret -> commit current buffer
      if (
        e.key === 'Enter' ||
        e.key === 'Tab' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'Home' ||
        e.key === 'End'
      ) {
        commitCurrentSpan();
        return;
      }

      // Fallback for environments where beforeinput deleteContentBackward does not fire
      if (e.key === 'Backspace' && composingSpanRef.current !== null && engineRef.current.getBuffer().length > 0) {
        const handled = handleBackspace(el);
        if (handled) {
          e.preventDefault();
        }
      }
    },
    [enableShortcut, toggleKey, isEnabled, toggleEnabled, commitCurrentSpan, handleBackspace],
  );

  const onSelect = useCallback(
    (e: React.SyntheticEvent<T>) => {
      const el = e.currentTarget;
      if (composingSpanRef.current !== null) {
        const [start, end] = composingSpanRef.current;
        const selStart = el.selectionStart ?? 0;
        const selEnd = el.selectionEnd ?? 0;
        // If caret moved outside the active composing syllable, commit it
        if (selStart < start || selEnd > end) {
          commitCurrentSpan();
        }
      }
    },
    [commitCurrentSpan],
  );

  const onPaste = useCallback(
    (e: React.ClipboardEvent<T>) => {
      if (!isEnabled) return;
      const text = e.clipboardData.getData('text/plain');
      if (!text) return;

      e.preventDefault();
      commitCurrentSpan();

      const el = e.currentTarget;
      const transliterated = transliterate(text, coreOptions);
      const start = el.selectionStart ?? el.value.length;
      const end = el.selectionEnd ?? el.value.length;

      const newCaret = insertTextAtRange(el, transliterated, start, end);
      targetCaretRef.current = newCaret;
      setValue(el.value);
    },
    [isEnabled, commitCurrentSpan, coreOptions],
  );

  // Android Chrome / Virtual Keyboard Composition Handlers
  const onCompositionStart = useCallback(() => {
    isNativeComposingRef.current = true;
  }, []);

  const onCompositionUpdate = useCallback(() => {
    // Monitored via beforeinput insertCompositionText
  }, []);

  const onCompositionEnd = useCallback(
    (e: React.CompositionEvent<T>) => {
      isNativeComposingRef.current = false;
      // If virtual keyboard completed composition with final characters
      if (isEnabled && e.data && composingSpanRef.current === null) {
        // Already finalized
      }
    },
    [isEnabled],
  );

  const onBlur = useCallback(() => {
    commitCurrentSpan();
  }, [commitCurrentSpan]);

  const onChange = useCallback((e: React.ChangeEvent<T>) => {
    setValue(e.currentTarget.value);
  }, []);

  const bind = {
    ref,
    onBeforeInput,
    onKeyDown,
    onSelect,
    onPaste,
    onCompositionStart,
    onCompositionUpdate,
    onCompositionEnd,
    onBlur,
    onChange,
  };

  return {
    ref,
    value,
    setValue,
    enabled: isEnabled,
    setEnabled,
    toggleEnabled,
    reset,
    onBeforeInput,
    onKeyDown,
    onSelect,
    onPaste,
    onCompositionStart,
    onCompositionUpdate,
    onCompositionEnd,
    onBlur,
    onChange,
    bind,
  };
}
