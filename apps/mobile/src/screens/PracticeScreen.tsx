import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { MobileTranslations } from '../utils/translations';
import { AmharicTextInput } from '../components/AmharicTextInput';

interface PracticeScreenProps {
  t: MobileTranslations;
}

export const PracticeScreen: React.FC<PracticeScreenProps> = ({ t }) => {
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  const handleCopy = () => {
    if (!text) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>✍️ {t.practiceTitle}</Text>

      {/* Honesty Banner */}
      <View style={styles.noticeCard}>
        <Text style={styles.noticeIcon}>ℹ️</Text>
        <Text style={styles.noticeText}>{t.practiceNotice}</Text>
      </View>

      <View style={styles.card}>
        <AmharicTextInput
          value={text}
          onChangeText={setText}
          placeholder={t.practicePlaceholder}
          style={styles.textInput}
        />

        <View style={styles.metricsRow}>
          <Text style={styles.metricText}>
            {t.wordCount}: <Text style={styles.metricVal}>{wordCount}</Text>
          </Text>
          <Text style={styles.metricText}>
            {t.charCount}: <Text style={styles.metricVal}>{charCount}</Text>
          </Text>
        </View>

        <View style={styles.actionsRow}>
          {copied && (
            <Text style={styles.copiedMsg}>✓ {t.copiedToast}</Text>
          )}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.clearBtn]}
              onPress={handleClear}
              disabled={!text}
            >
              <Text style={styles.clearBtnText}>{t.clearBtn}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.copyBtn]}
              onPress={handleCopy}
              disabled={!text}
            >
              <Text style={styles.copyBtnText}>{t.copyBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  noticeCard: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    borderWidth: 1,
    borderColor: '#fde68a',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  noticeIcon: {
    fontSize: 16,
    marginRight: 8,
    marginTop: 1,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: '#92400e',
    lineHeight: 18,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textInput: {
    minHeight: 140,
    marginBottom: 12,
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metricText: {
    fontSize: 13,
    color: '#64748b',
  },
  metricVal: {
    fontWeight: '700',
    color: '#0f172a',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  copiedMsg: {
    color: '#10b981',
    fontWeight: '600',
    fontSize: 13,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 'auto',
  },
  actionBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },
  clearBtn: {
    backgroundColor: '#f1f5f9',
  },
  clearBtnText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 13,
  },
  copyBtn: {
    backgroundColor: '#2563eb',
  },
  copyBtnText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
});
