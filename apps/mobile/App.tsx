import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { ScreenName, MobileLocale } from './src/types.js';
import { mobileTranslations } from './src/utils/translations.js';
import { OnboardingScreen } from './src/screens/OnboardingScreen.js';
import { PracticeScreen } from './src/screens/PracticeScreen.js';
import { RulesChartScreen } from './src/screens/RulesChartScreen.js';
import { SettingsScreen } from './src/screens/SettingsScreen.js';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('onboarding');
  const [locale, setLocale] = useState<MobileLocale>('am');

  const t = mobileTranslations[locale];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Top Header */}
      <View style={styles.topHeader}>
        <Text style={styles.appTitle}>⌨️ {t.appName}</Text>
      </View>

      {/* Screen Body */}
      <View style={styles.body}>
        {currentScreen === 'onboarding' && (
          <OnboardingScreen
            t={t}
            onNavigateToPractice={() => setCurrentScreen('practice')}
          />
        )}
        {currentScreen === 'practice' && <PracticeScreen t={t} />}
        {currentScreen === 'chart' && <RulesChartScreen t={t} />}
        {currentScreen === 'settings' && (
          <SettingsScreen
            t={t}
            locale={locale}
            onToggleLocale={setLocale}
          />
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentScreen('onboarding')}
        >
          <Text style={[styles.navIcon, currentScreen === 'onboarding' && styles.activeNavIcon]}>
            ⚙️
          </Text>
          <Text style={[styles.navText, currentScreen === 'onboarding' && styles.activeNavText]}>
            {t.onboardingTab}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentScreen('practice')}
        >
          <Text style={[styles.navIcon, currentScreen === 'practice' && styles.activeNavIcon]}>
            ✍️
          </Text>
          <Text style={[styles.navText, currentScreen === 'practice' && styles.activeNavText]}>
            {t.practiceTab}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentScreen('chart')}
        >
          <Text style={[styles.navIcon, currentScreen === 'chart' && styles.activeNavIcon]}>
            📖
          </Text>
          <Text style={[styles.navText, currentScreen === 'chart' && styles.activeNavText]}>
            {t.chartTab}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setCurrentScreen('settings')}
        >
          <Text style={[styles.navIcon, currentScreen === 'settings' && styles.activeNavIcon]}>
            🔧
          </Text>
          <Text style={[styles.navText, currentScreen === 'settings' && styles.activeNavText]}>
            {t.settingsTab}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  body: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 18,
    marginBottom: 2,
    opacity: 0.6,
  },
  activeNavIcon: {
    opacity: 1,
  },
  navText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
  },
  activeNavText: {
    color: '#2563eb',
    fontWeight: '700',
  },
});
