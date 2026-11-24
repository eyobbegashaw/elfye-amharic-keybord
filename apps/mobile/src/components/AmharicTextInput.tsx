import React, { useState, useRef, useCallback } from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
} from 'react-native';
import { LiveTypingEngine } from '@elfye/core';

export interface AmharicTextInputProps extends Omit<TextInputProps, 'onChangeText'> {
  value?: string;
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  enabled?: boolean;
  onToggleEnabled?: (enabled: boolean) => void;
  showToggle?: boolean;
}

/**
 * Mobile companion AmharicTextInput component.
 *
 * Built directly on @elfye/core (LiveTypingEngine).
 * High-performance, low-latency live phonetic input matching web and desktop speed.
 */
export const AmharicTextInput: React.FC<AmharicTextInputProps> = ({
  value: controlledValue,
  defaultValue = '',
  onChangeText,
  enabled = true,
  onToggleEnabled,
  showToggle = true,
  style,
  placeholder,
  ...restProps
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [isAmharic, setIsAmharic] = useState(enabled);

  const textValue = controlledValue !== undefined ? controlledValue : internalValue;
  const textRef = useRef(textValue);
  textRef.current = textValue;

  const selectionRef = useRef({ start: textValue.length, end: textValue.length });
  const composingSpanRef = useRef<{ start: number; end: number } | null>(null);
  const engineRef = useRef(new LiveTypingEngine());

  const updateText = useCallback(
    (newText: string) => {
      textRef.current = newText;
      if (controlledValue === undefined) {
        setInternalValue(newText);
      }
      onChangeText?.(newText);
    },
    [controlledValue, onChangeText],
  );

  const handleSelectionChange = (
    e: NativeSyntheticEvent<TextInputSelectionChangeEventData>,
  ) => {
    const sel = e.nativeEvent.selection;
    selectionRef.current = sel;

    // If user tapped elsewhere outside the active composing syllable, commit buffer
    if (composingSpanRef.current !== null) {
      const span = composingSpanRef.current;
      if (sel.start < span.start || sel.start > span.end) {
        engineRef.current.commitCurrent();
        composingSpanRef.current = null;
      }
    }
  };

  const handleChangeText = (incomingText: string) => {
    if (!isAmharic) {
      composingSpanRef.current = null;
      engineRef.current.reset();
      updateText(incomingText);
      return;
    }

    const prev = textRef.current;
    if (incomingText === prev) return;

    // Case 1: Deletion / Backspace
    if (incomingText.length < prev.length) {
      if (composingSpanRef.current !== null && engineRef.current.getBuffer().length > 0) {
        const span = composingSpanRef.current;
        const res = engineRef.current.backspace();
        const before = prev.slice(0, span.start);
        const after = prev.slice(span.end);

        if (res.composing) {
          const transformed = before + res.composing + after;
          composingSpanRef.current = {
            start: span.start,
            end: span.start + res.composing.length,
          };
          updateText(transformed);
          return;
        } else {
          const transformed = before + after;
          composingSpanRef.current = null;
          updateText(transformed);
          return;
        }
      }

      // Normal deletion outside active composing syllable
      engineRef.current.reset();
      composingSpanRef.current = null;
      updateText(incomingText);
      return;
    }

    // Case 2: Character addition / typing
    let before = '';
    let after = '';
    let addedChars = '';

    if (composingSpanRef.current !== null) {
      const span = composingSpanRef.current;
      before = prev.slice(0, span.start);
      after = prev.slice(span.end);

      // Part of incomingText corresponding to replacement zone
      const middle = incomingText.slice(before.length, incomingText.length - after.length);
      const prevComposing = prev.slice(span.start, span.end);

      if (middle.startsWith(prevComposing)) {
        addedChars = middle.slice(prevComposing.length);
      } else {
        addedChars = middle;
      }
    } else {
      const caret = Math.max(0, Math.min(selectionRef.current.start, prev.length));
      before = prev.slice(0, caret);
      after = prev.slice(caret);
      const addedCount = incomingText.length - prev.length;
      addedChars = incomingText.slice(caret, caret + addedCount);
    }

    if (!addedChars) {
      updateText(incomingText);
      return;
    }

    // Fast-path processing via LiveTypingEngine
    let committedOutput = '';
    let currentComposing = '';

    for (let i = 0; i < addedChars.length; i++) {
      const ch = addedChars[i];
      const res = engineRef.current.input(ch);
      committedOutput += res.committed;
      currentComposing = res.composing;
    }

    const replacement = committedOutput + currentComposing;
    const transformed = before + replacement + after;

    if (currentComposing.length > 0) {
      const compStart = before.length + committedOutput.length;
      composingSpanRef.current = {
        start: compStart,
        end: compStart + currentComposing.length,
      };
      selectionRef.current = {
        start: compStart + currentComposing.length,
        end: compStart + currentComposing.length,
      };
    } else {
      composingSpanRef.current = null;
      const newPos = before.length + replacement.length;
      selectionRef.current = {
        start: newPos,
        end: newPos,
      };
    }

    updateText(transformed);
  };

  const handleToggle = () => {
    const next = !isAmharic;
    setIsAmharic(next);
    engineRef.current.reset();
    composingSpanRef.current = null;
    onToggleEnabled?.(next);
  };

  return (
    <View style={styles.container}>
      {showToggle && (
        <View style={styles.toolbar}>
          <View style={styles.badgeContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: isAmharic ? '#10b981' : '#94a3b8' },
              ]}
            />
            <Text style={styles.statusText}>
              {isAmharic ? 'አማርኛ (Phonetic)' : 'English (Latin)'}
            </Text>
          </View>
          <TouchableOpacity style={styles.toggleBtn} onPress={handleToggle}>
            <Text style={styles.toggleBtnText}>
              {isAmharic ? 'Switch to English' : 'ወደ አማርኛ ቀይር'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TextInput
        style={[styles.input, style]}
        value={textValue}
        onChangeText={handleChangeText}
        onSelectionChange={handleSelectionChange}
        placeholder={placeholder ?? 'በእንግሊዝኛ ይተይቡ... (selam -> ሰላም)'}
        placeholderTextColor="#94a3b8"
        multiline
        autoCapitalize="none"
        autoCorrect={false}
        spellCheck={false}
        keyboardType="default"
        {...restProps}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  toggleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#e2e8f0',
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    lineHeight: 24,
    color: '#0f172a',
    backgroundColor: '#ffffff',
    textAlignVertical: 'top',
    minHeight: 120,
    fontFamily: Platform.select({
      web: "'Noto Serif Ethiopic', 'Nyala', serif",
      default: undefined,
    }),
  },
});
