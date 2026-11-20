import { MobileLocale } from '../types.js';

export interface MobileTranslations {
  appName: string;
  onboardingTab: string;
  practiceTab: string;
  chartTab: string;
  settingsTab: string;

  // Onboarding
  onboardingTitle: string;
  onboardingSubtitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  openSettingsBtn: string;
  openedToast: string;

  // Practice
  practiceTitle: string;
  practiceNotice: string;
  practicePlaceholder: string;
  clearBtn: string;
  copyBtn: string;
  copiedToast: string;
  amharicActive: string;
  englishActive: string;
  toggleLangBtn: string;
  wordCount: string;
  charCount: string;

  // Rules Chart
  chartTitle: string;
  chartSubtitle: string;
  searchPlaceholder: string;
  vowelsSection: string;
  consonantsSection: string;

  // Settings
  settingsTitle: string;
  langSection: string;
  langAmharic: string;
  langEnglish: string;
  offlineTitle: string;
  offlineDesc: string;
  versionLabel: string;
}

export const mobileTranslations: Record<MobileLocale, MobileTranslations> = {
  am: {
    appName: 'የአማርኛ ኪቦርድ ረዳት',
    onboardingTab: 'ኪቦርድ ማብሪያ',
    practiceTab: 'የጽሑፍ ልምምድ',
    chartTab: 'የፊደል ደንቦች',
    settingsTab: 'ቅንብሮች',

    onboardingTitle: 'ኪቦርዱን በስልክዎ ላይ ያንቁ',
    onboardingSubtitle: 'በቴሌግራም፣ በዋትስአፕ እና በሌሎች መተግበሪያዎች ለመጠቀም የሲስተም ኪቦርዱን በስልክዎ ቅንብሮች (Settings) ውስጥ ያንቁ።',
    step1Title: 'ደረጃ 1: ቅንብሮችን ይክፈቱ',
    step1Desc: 'ከታች ያለውን "የስልክ ቅንብሮችን ክፈት" ቁልፍ በመጫን ወደ ስልክዎ የኪቦርድ ማስተካከያ ይሂዱ።',
    step2Title: 'ደረጃ 2: የአማርኛ ኪቦርድን ያብሩ',
    step2Desc: 'በዝርዝሩ ውስጥ "Amharic Phonetic Keyboard" ን አግኝተው ያብሩት።',
    step3Title: 'ደረጃ 3: ኪቦርዱን ይምረጡ',
    step3Desc: 'በየትኛውም የጽሑፍ ሳጥን ውስጥ ሲተይቡ የስፔስ ቁልፉን ወይም የግሎብ (🌐) ምልክቱን ተጭነው ኪቦርዱን ይቀይሩ።',
    openSettingsBtn: '⚙️ የስልክ ቅንብሮችን ክፈት',
    openedToast: 'ወደ ስልክ ቅንብሮች እየተጓዘ ነው...',

    practiceTitle: 'የመለማመጃ ሰሌዳ',
    practiceNotice: 'ማስታወሻ: ይህ የመጻፊያ ሳጥን በዚህ መተግበሪያ ውስጥ ብቻ ለመለማመድ የሚሰራ ነው። በመላው ስልክዎ ለመጠቀም በቅንብሮች ውስጥ የሲስተም ኪቦርዱን ያንቁ።',
    practicePlaceholder: 'በእንግሊዝኛ ፊደላት እዚህ ይጻፉ... (ለምሳሌ: selam -> ሰላም)',
    clearBtn: 'አጽዳ',
    copyBtn: 'ቅዳ',
    copiedToast: 'ጽሑፉ ተቀድቷል!',
    amharicActive: 'አማርኛ ነቅቷል',
    englishActive: 'English ነቅቷል',
    toggleLangBtn: 'ቋንቋ ቀይር',
    wordCount: 'ቃላት',
    charCount: 'ፊደላት',

    chartTitle: 'የአጻጻፍ ደንቦች ሰንጠረዥ',
    chartSubtitle: 'Addiyon ፎነቲክ የአጻጻፍ ስልት (7ቱ ድምፆች + 8ኛው ዋ/ua)',
    searchPlaceholder: 'ፊደል ይፈልጉ...',
    vowelsSection: 'አናባቢዎች (አ እና ዐ)',
    consonantsSection: 'ተነባቢዎች',

    settingsTitle: 'አጠቃላይ ቅንብሮች',
    langSection: 'የመተግበሪያው ቋንቋ',
    langAmharic: 'አማርኛ (ነባሪ)',
    langEnglish: 'English',
    offlineTitle: '100% ከመስመር ውጭ (Offline)',
    offlineDesc: 'ይህ መተግበሪያ እና ኪቦርዱ ሙሉ በሙሉ ያለ ኢንተርኔት ይሰራሉ። የትኛውንም የይለፍ ቃል፣ መልዕክት ወይም የኪቦርድ መረጃ ወደ አገልጋይ አይልክም ወይም አይመዘግብም።',
    versionLabel: 'ስሪት 1.0.0 (Addiyon Phonetic)',
  },
  en: {
    appName: 'Amharic Keyboard Companion',
    onboardingTab: 'Enable Keyboard',
    practiceTab: 'Practice Typing',
    chartTab: 'Rules Chart',
    settingsTab: 'Settings',

    onboardingTitle: 'Enable System-Wide Keyboard',
    onboardingSubtitle: 'To type in Telegram, WhatsApp, Notes, and other apps, enable the native keyboard in your phone settings.',
    step1Title: 'Step 1: Open Phone Settings',
    step1Desc: 'Tap the button below to navigate directly to your device keyboard input settings.',
    step2Title: 'Step 2: Toggle Amharic Keyboard ON',
    step2Desc: 'Find "Amharic Phonetic Keyboard" in the list of virtual keyboards and turn it on.',
    step3Title: 'Step 3: Switch to the Keyboard',
    step3Desc: 'While typing in any text box, hold the Spacebar or tap the Globe (🌐) icon to select it.',
    openSettingsBtn: '⚙️ Open System Settings',
    openedToast: 'Opening system settings...',

    practiceTitle: 'Typing Practice Sandbox',
    practiceNotice: 'Notice: This input box works only inside this companion app for preview. System-wide typing across other apps is handled by the native keyboard extension.',
    practicePlaceholder: 'Type phonetically here... (e.g. selam -> ሰላም)',
    clearBtn: 'Clear',
    copyBtn: 'Copy',
    copiedToast: 'Copied to clipboard!',
    amharicActive: 'Amharic Active',
    englishActive: 'English Active',
    toggleLangBtn: 'Toggle Language',
    wordCount: 'Words',
    charCount: 'Chars',

    chartTitle: 'Phonetic Reference Chart',
    chartSubtitle: 'Addiyon Scheme (7 vowel orders + 8th labialized column)',
    searchPlaceholder: 'Search character or key...',
    vowelsSection: 'Vowels (አ & ዐ rows)',
    consonantsSection: 'Consonants',

    settingsTitle: 'Companion Settings',
    langSection: 'Companion App Language',
    langAmharic: 'አማርኛ (Default)',
    langEnglish: 'English',
    offlineTitle: '100% Offline & Private',
    offlineDesc: 'Both this companion app and the native keyboard work completely offline. No telemetry, no keystroke recording, no network permission required.',
    versionLabel: 'Version 1.0.0 (Addiyon Phonetic)',
  },
};
