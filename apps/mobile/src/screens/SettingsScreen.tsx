import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SlidersHorizontal, Lock, Info } from 'lucide-react-native';
import { MobileLocale } from '../types';
import { MobileTranslations } from '../utils/translations';

interface SettingsScreenProps {
  t: MobileTranslations;
  locale: MobileLocale;
  onToggleLocale: (locale: MobileLocale) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  t,
  locale,
  onToggleLocale,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <SlidersHorizontal size={20} color="#0f172a" />
        <Text style={[styles.title, { marginBottom: 0 }]}>{t.settingsTitle}</Text>
      </View>

      {/* Language Section */}
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>{t.langSection}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.langBtn, locale === 'am' && styles.activeLangBtn]}
            onPress={() => onToggleLocale('am')}
          >
            <Text style={[styles.langBtnText, locale === 'am' && styles.activeLangBtnText]}>
              {t.langAmharic}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.langBtn, locale === 'en' && styles.activeLangBtn]}
            onPress={() => onToggleLocale('en')}
          >
            <Text style={[styles.langBtnText, locale === 'en' && styles.activeLangBtnText]}>
              {t.langEnglish}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Privacy & Offline Section */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Lock size={16} color="#0f172a" />
          <Text style={[styles.sectionHeader, { marginBottom: 0 }]}>{t.offlineTitle}</Text>
        </View>
        <Text style={styles.desc}>{t.offlineDesc}</Text>
      </View>

      {/* App Version Info */}
      <View style={styles.card}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Info size={16} color="#0f172a" />
          <Text style={[styles.sectionHeader, { marginBottom: 0 }]}>{t.appName}</Text>
        </View>
        <Text style={styles.desc}>{t.versionLabel}</Text>
        <Text style={[styles.desc, { marginTop: 8, fontWeight: '600', color: '#0f172a' }]}>
          Developed by Eyob Begashaw
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/eyobbegashaw')}>
          <Text style={[styles.desc, { marginTop: 4, color: '#2563eb', fontWeight: '600' }]}>
            https://github.com/eyobbegashaw
          </Text>
        </TouchableOpacity>
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
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 10,
  },
  desc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  langBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  activeLangBtn: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  langBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  activeLangBtnText: {
    color: '#ffffff',
  },
});
