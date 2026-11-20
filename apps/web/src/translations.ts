export type Locale = 'am' | 'en';

export interface Translations {
  title: string;
  subtitle: string;
  schemeBadge: string;
  langToggle: string;
  themeToggle: string;
  lightMode: string;
  darkMode: string;
  amharicEnabled: string;
  englishEnabled: string;
  toggleShortcutHint: string;
  textareaPlaceholder: string;
  charCount: string;
  wordCount: string;
  copyBtn: string;
  copiedToast: string;
  clearBtn: string;
  practiceTitle: string;
  practiceSubtitle: string;
  practicePromptLabel: string;
  practiceInputPlaceholder: string;
  practiceSuccess: string;
  practiceNext: string;
  chartTitle: string;
  chartSubtitle: string;
  chartSearchPlaceholder: string;
  chartClickHint: string;
  order1: string;
  order2: string;
  order3: string;
  order4: string;
  order5: string;
  order6: string;
  order7: string;
  order8: string;
  installTitle: string;
  installSubtitle: string;
  androidTitle: string;
  androidDesc: string;
  iosTitle: string;
  iosDesc: string;
  desktopTitle: string;
  desktopDesc: string;
  downloadPlaceholder: string;
}

export const translations: Record<Locale, Translations> = {
  am: {
    title: 'የአማርኛ ፎኔቲክ ኪቦርድ',
    subtitle: 'በላቲን ፊደላት አማርኛን በቀላሉ፣ በፍጥነት እና በትክክል ይተይቡ',
    schemeBadge: 'አዲዮን (Addiyon) ሥርዓት',
    langToggle: 'English',
    themeToggle: 'ገጽታ ቀይር',
    lightMode: 'ብርሃን',
    darkMode: 'ጨለማ',
    amharicEnabled: 'አማርኛ በርቷል',
    englishEnabled: 'እንግሊዝኛ በርቷል',
    toggleShortcutHint: 'ለመቀያየር Ctrl + Space ይጫኑ',
    textareaPlaceholder: 'እዚህ ይተይቡ (ለምሳሌ፦ selam, endiet nesh)...',
    charCount: 'ፊደላት',
    wordCount: 'ቃላት',
    copyBtn: 'ኮፒ አድርግ',
    copiedToast: 'ተቀድቷል!',
    clearBtn: 'አጽዳ',
    practiceTitle: 'ተለማመዱ',
    practiceSubtitle: 'የአጻጻፍ ልምምድ በማድረግ የፎኔቲክ አጻጻፉን ይልመዱ',
    practicePromptLabel: 'የሚከተለውን በላቲን ይተይቡ፦',
    practiceInputPlaceholder: 'እዚህ ይለማመዱ...',
    practiceSuccess: 'ትክክል ነው! 🎉 ድንቅ ስራ!',
    practiceNext: 'ቀጣይ ልምምድ',
    chartTitle: 'የፊደል ገበታ እና የአጻጻፍ ሕጎች',
    chartSubtitle: 'የአዲዮን ኪቦርድ ሙሉ የፊደላት ሰንጠረዥ (ፊደሉን ጠቅ በማድረግ ወደ ጽሑፉ ማስገባት ይችላሉ)',
    chartSearchPlaceholder: 'ፊደል ይፈልጉ (ለምሳሌ፦ h, se, ሸ, ጨ)...',
    chartClickHint: 'ማንኛውንም ፊደል ጠቅ ሲያደርጉ ወደ ጽሑፍ ሳጥኑ ይገባል',
    order1: '1ኛ (ግዕዝ - e)',
    order2: '2ኛ (ካዕብ - u)',
    order3: '3ኛ (ሣልስ - i)',
    order4: '4ኛ (ራብዕ - a)',
    order5: '5ኛ (ኃምስ - ie)',
    order6: '6ኛ (ሳድስ - ባዶ)',
    order7: '7ኛ (ሳብዕ - o)',
    order8: '8ኛ (ዲቃላ - ua/wa)',
    installTitle: 'በስልክዎ እና በኮምፒውተርዎ ላይ ይጫኑ',
    installSubtitle: 'በማንኛውም መተግበሪያ (Telegram, WhatsApp, Word) ውስጥ አማርኛ ለመተየብ',
    androidTitle: 'አንድሮይድ (Android)',
    androidDesc: 'እንደ ዋና ኪቦርድ በቅንብሮች (Settings → System → Languages & Input) ውስጥ በማብራት ይጠቀሙ።',
    iosTitle: 'አይኦኤስ (iOS / iPhone)',
    iosDesc: 'በቅንብሮች (Settings → General → Keyboard → Add New Keyboard) በኩል ይጨምሩ።',
    desktopTitle: 'ዴስክቶፕ (Windows / macOS / Linux)',
    desktopDesc: 'በስርዓተ-አሰራር (OS) ደረጃ በቋንቋ መምረጫ ውስጥ በቀጥታ ይካተታል።',
    downloadPlaceholder: 'በቅርቡ ይለቀቃል (Phase 3-5)',
  },
  en: {
    title: 'Amharic Phonetic Keyboard',
    subtitle: 'Type Amharic naturally, quickly, and accurately using Latin letters',
    schemeBadge: 'Addiyon Scheme',
    langToggle: 'አማርኛ',
    themeToggle: 'Toggle Theme',
    lightMode: 'Light',
    darkMode: 'Dark',
    amharicEnabled: 'Amharic ON',
    englishEnabled: 'English ON',
    toggleShortcutHint: 'Press Ctrl + Space to toggle',
    textareaPlaceholder: 'Type here (e.g. selam, endiet nesh)...',
    charCount: 'Characters',
    wordCount: 'Words',
    copyBtn: 'Copy Text',
    copiedToast: 'Copied to clipboard!',
    clearBtn: 'Clear',
    practiceTitle: 'Practice Area',
    practiceSubtitle: 'Type the Latin prompt to practice your Amharic phonetic typing',
    practicePromptLabel: 'Type this prompt in Latin:',
    practiceInputPlaceholder: 'Type here to practice...',
    practiceSuccess: 'Correct! 🎉 Great job!',
    practiceNext: 'Next Practice',
    chartTitle: 'Phonetic Reference Chart',
    chartSubtitle: 'Full Addiyon transliteration chart generated from core rules (click any cell to insert)',
    chartSearchPlaceholder: 'Search consonant or letter (e.g. h, se, ሸ, ጨ)...',
    chartClickHint: 'Click any cell to insert that character into the editor',
    order1: '1st (Ge\'ez - e)',
    order2: '2nd (Ka\'eb - u)',
    order3: '3rd (Sals - i)',
    order4: '4th (Rabe - a)',
    order5: '5th (Hames - ie)',
    order6: '6th (Sadis - bare)',
    order7: '7th (Sabe - o)',
    order8: '8th (Labial - ua/wa)',
    installTitle: 'Install System-Wide',
    installSubtitle: 'Type Amharic inside any app (Telegram, WhatsApp, Notes, etc.)',
    androidTitle: 'Android Keyboard',
    androidDesc: 'Enable as an Input Method in Settings → System → Languages & Input.',
    iosTitle: 'iOS Keyboard',
    iosDesc: 'Enable via Settings → General → Keyboard → Keyboards → Add New Keyboard.',
    desktopTitle: 'Desktop (Windows / macOS / Linux)',
    desktopDesc: 'Native OS-level input method engine (TSF / InputMethodKit / IBus).',
    downloadPlaceholder: 'Coming Soon (Phase 3-5)',
  },
};
