import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Smartphone, PenLine } from 'lucide-react-native';
import { MobileTranslations } from '../utils/translations';
import { openKeyboardSettings } from '../utils/linking';

interface OnboardingScreenProps {
  t: MobileTranslations;
  onNavigateToPractice: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ t, onNavigateToPractice }) => {
  const [toast, setToast] = useState<string | null>(null);

  const handleOpenSettings = async () => {
    setToast(t.openedToast);
    await openKeyboardSettings();
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={styles.icon}>
          <Smartphone size={44} color="#2563eb" />
        </View>
        <Text style={styles.title}>{t.onboardingTitle}</Text>
        <Text style={styles.subtitle}>{t.onboardingSubtitle}</Text>
      </View>

      <View style={styles.platformBadge}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Smartphone size={14} color="#1d4ed8" />
          <Text style={styles.platformBadgeText}>
            {Platform.OS === 'ios' ? 'iOS Device' : 'Android Device'}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.step}>
          <Text style={styles.stepNumber}>1</Text>
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>{t.step1Title}</Text>
            <Text style={styles.stepDesc}>{t.step1Desc}</Text>
          </View>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>2</Text>
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>{t.step2Title}</Text>
            <Text style={styles.stepDesc}>{t.step2Desc}</Text>
          </View>
        </View>

        <View style={styles.step}>
          <Text style={styles.stepNumber}>3</Text>
          <View style={styles.stepTextContainer}>
            <Text style={styles.stepTitle}>{t.step3Title}</Text>
            <Text style={styles.stepDesc}>{t.step3Desc}</Text>
          </View>
        </View>
      </View>

      {toast && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.primaryButton} onPress={handleOpenSettings}>
        <Text style={styles.primaryButtonText}>{t.openSettingsBtn}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.secondaryButton} onPress={onNavigateToPractice}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <PenLine size={16} color="#2563eb" />
          <Text style={styles.secondaryButtonText}>{t.practiceTab}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 48,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },
  platformBadge: {
    alignSelf: 'center',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 16,
  },
  platformBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369a1',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563eb',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '700',
    marginRight: 12,
    fontSize: 14,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  toast: {
    backgroundColor: '#10b981',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  toastText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '600',
  },
});
