import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { BookOpen } from 'lucide-react-native';
import { MobileTranslations } from '../utils/translations';

interface RulesChartScreenProps {
  t: MobileTranslations;
}

interface RuleItem {
  latin: string;
  amharic: string;
  order: string;
  desc?: string;
}

const SAMPLE_RULES: RuleItem[] = [
  // 7 orders
  { latin: 'he', amharic: 'ሀ', order: '1ኛ (ግዕዝ)', desc: 'he -> ሀ' },
  { latin: 'hu', amharic: 'ሁ', order: '2ኛ (ካዕብ)', desc: 'hu -> ሁ' },
  { latin: 'hi', amharic: 'ሂ', order: '3ኛ (ሣልስ)', desc: 'hi -> ሂ' },
  { latin: 'ha', amharic: 'ሃ', order: '4ኛ (ራብዕ)', desc: 'ha -> ሃ' },
  { latin: 'hie', amharic: 'ሄ', order: '5ኛ (ኃምስ)', desc: 'hie -> ሄ' },
  { latin: 'h', amharic: 'ህ', order: '6ኛ (ሳድስ)', desc: 'h -> ህ' },
  { latin: 'ho', amharic: 'ሆ', order: '7ኛ (ሳብዕ)', desc: 'ho -> ሆ' },
  { latin: 'hua', amharic: 'ኋ', order: '8ኛ (ዲቃላ)', desc: 'hua / hwa -> ኋ' },

  // Multigraphs
  { latin: 'she', amharic: 'ሸ', order: 'sh' },
  { latin: 'che', amharic: 'ቸ', order: 'ch' },
  { latin: 'gne', amharic: 'ኘ', order: 'gn' },
  { latin: 'khe', amharic: 'ኸ', order: 'kh' },
  { latin: 'zhe', amharic: 'ዠ', order: 'zh' },
  { latin: 'tse', amharic: 'ጸ', order: 'ts' },
  { latin: 'Tse', amharic: 'ፀ', order: 'Ts (ጽኑ)' },
  { latin: 'hhe', amharic: 'ኀ', order: 'hh / x' },

  // Lone vowels
  { latin: 'a', amharic: 'አ', order: 'Lone Vowel' },
  { latin: 'aa', amharic: 'ኣ', order: 'Lone 4th' },
  { latin: 'A', amharic: 'ዐ', order: 'Pharyngeal 1st' },
  { latin: 'Aa', amharic: 'ዓ', order: 'Pharyngeal 4th' },
  { latin: 'Aie', amharic: 'ዔ', order: 'Pharyngeal 5th' },
  { latin: 'ea', amharic: 'ኧ', order: '8th of አ' },

  // Punctuation
  { latin: ':: / .', amharic: '።', order: 'አራት ነጥብ (Full Stop)' },
  { latin: ',', amharic: '፣', order: 'ነጠላ ሰረዝ (Comma)' },
  { latin: ';', amharic: '፤', order: 'ድርብ ሰረዝ (Semicolon)' },
  { latin: ':', amharic: '፡', order: 'ሁለት ነጥብ (Word Separator)' },
];

export const RulesChartScreen: React.FC<RulesChartScreenProps> = ({ t }) => {
  const [search, setSearch] = useState('');

  const filtered = SAMPLE_RULES.filter(
    (r) =>
      r.latin.toLowerCase().includes(search.toLowerCase()) ||
      r.amharic.includes(search) ||
      r.order.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <BookOpen size={20} color="#0f172a" />
        <Text style={[styles.title, { marginBottom: 0 }]}>{t.chartTitle}</Text>
      </View>
      <Text style={styles.subtitle}>{t.chartSubtitle}</Text>

      <TextInput
        style={styles.searchBar}
        placeholder={t.searchPlaceholder}
        placeholderTextColor="#94a3b8"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.grid}>
        {filtered.map((item, idx) => (
          <View key={idx} style={styles.card}>
            <Text style={styles.char}>{item.amharic}</Text>
            <Text style={styles.latin}>{item.latin}</Text>
            <Text style={styles.order}>{item.order}</Text>
          </View>
        ))}
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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  card: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  char: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  latin: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 2,
  },
  order: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
});
