import React, { useState, useRef, useCallback } from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
} from 'react-native';
import { LiveTypingEngine } from '@amharic-keyboard/core';

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
 * Built directly on @amharic-keyboard/core (LiveTypingEngine).
 * Note: Works exclusively inside this companion application for testing and preview.
 * System-wide typing in other apps is powered by the native keyboard extensions.
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
  const [selection, setSelection] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
  const [isAmharic, setIsAmharic] = useState(enabled);

  const engineRef = useRef(new LiveTypingEngine());
  const textValue = controlledValue !== undefined ? controlledValue : internalValue;

  const updateText = useCallback(
    (newText: string) => {
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
    setSelection(e.nativeEvent.selection);
  };

  const handleChangeText = (newText: string) => {
    if (!isAmharic) {
      updateText(newText);
      return;
    }

    const prevText = textValue;

    // Detection: deletion / backspace
    if (newText.length < prevText.length) {
      if (engineRef.current.getBuffer().length > 0) {
        // Progressive backspace on composing syllable
        engineRef.current.backspace();
      }
      updateText(newText);
      return;
    }

    // Detection: character addition at cursor
    const addedCount = newText.length - prevText.length;
    const insertPos = Math.max(0, selection.start);
    const addedChars = newText.slice(insertPos, insertPos + addedCount);

    if (!addedChars) {
      updateText(newText);
      return;
    }

    // Process through LiveTypingEngine
    let resultCommitted = '';
    let resultComposing = '';

    for (const ch of addedChars) {
      const res = engineRef.current.input(ch);
      resultCommitted += res.committed;
      resultComposing = res.composing;
    }

    // Reconstruct string with transliterated output
    const before = prevText.slice(0, insertPos);
    const after = prevText.slice(insertPos);
    const transformed = before + resultCommitted + resultComposing + after;

    updateText(transformed);
  };

  const handleToggle = () => {
    const next = !isAmharic;
    setIsAmharic(next);
    engineRef.current.reset();
    onToggleEnabled?.(next);
  };

  return (
    <View style={styles.container}>
      {showToggle && (
        <View style={styles.toolbar}>
          <View style={styles.badgeContainer}>
            <View style={[styles.statusDot, { backgroundColor: isAmharic ? '#10b981' : '#94a3b8' }]} />
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
  },
});
