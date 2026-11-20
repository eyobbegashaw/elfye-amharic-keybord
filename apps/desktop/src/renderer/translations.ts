export type Locale = 'am' | 'en';

export interface DesktopTranslations {
  appTitle: string;
  practiceTab: string;
  chartTab: string;
  imeGuideTab: string;
  settingsTab: string;
  
  // Practice Area
  practiceTitle: string;
  practiceSubtitle: string;
  placeholder: string;
  clearBtn: string;
  copyBtn: string;
  copiedToast: string;
  statusAmharic: string;
  statusEnglish: string;
  toggleHint: string;
  wordsCount: string;
  charsCount: string;

  // IME Guide
  imeTitle: string;
  imeSubtitle: string;
  currentPlatformBadge: string;
  linuxTab: string;
  macosTab: string;
  windowsTab: string;
  linuxSteps: string[];
  macosSteps: string[];
  windowsSteps: string[];

  // Settings
  settingsTitle: string;
  themeLabel: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  langLabel: string;
  hotkeyLabel: string;
  hotkeyDesc: string;
  aboutLabel: string;
  aboutDesc: string;
}

export const translations: Record<Locale, DesktopTranslations> = {
  am: {
    appTitle: 'የአማርኛ ኪቦርድ ረዳት መተግበሪያ',
    practiceTab: 'የመጻፊያ ልምምድ',
    chartTab: 'የፊደላት ሰንጠረዥ',
    imeGuideTab: 'ኪቦርድ መጫኛ መመሪያ',
    settingsTab: 'ቅንብሮች',

    practiceTitle: 'የአማርኛ ጽሑፍ መለማመጃ',
    practiceSubtitle: 'በዚህ ሳጥን ውስጥ በእንግሊዝኛ ፊደላት ይተይቡ፤ ወዲያውኑ ወደ አማርኛ ይቀየራል። (ለምሳሌ: selam -> ሰላም)',
    placeholder: 'እዚህ ይጻፉ... (ለምሳሌ: selam , endiet nesh -> ሰላም ፣ እንዴት ነሽ)',
    clearBtn: 'አጽዳ',
    copyBtn: 'ጽሑፉን ቅዳ',
    copiedToast: 'ጽሑፉ ተቀድቷል!',
    statusAmharic: 'አማርኛ ነቅቷል',
    statusEnglish: 'English (ላቲን)',
    toggleHint: 'ቋንቋ ለመቀየር Ctrl + Space ይጫኑ',
    wordsCount: 'ቃላት',
    charsCount: 'ፊደላት',

    imeTitle: 'በመላው ኮምፒውተርዎ ላይ አማርኛ ለመጻፍ',
    imeSubtitle: 'ይህ መተግበሪያ የመለማመጃ እና የማስተካከያ ረዳት ብቻ ነው። በቴሌግራም፣ በዎርድ፣ በብሮውዘር ወዘተ አማርኛ ለመጻፍ የሲስተም ኪቦርዱን (IME) ያንቁ።',
    currentPlatformBadge: 'የእርስዎ ሲስተም',
    linuxTab: 'Linux (IBus)',
    macosTab: 'macOS (InputMethodKit)',
    windowsTab: 'Windows (TSF)',

    linuxSteps: [
      'የ IBus Amharic ጥቅልን ይጫኑ: cd apps/desktop-ime/linux/ibus-amharic && ./install.sh',
      'የ IBus ዲሞንን እንደገና ያስጀምሩ: ibus restart',
      'ወደ Settings > Keyboard > Input Sources ይሂዱና "+" ይጫኑ',
      'Amharic (Addiyon Phonetic) ን ይምረጡና ይጨምሩ',
      'ኪቦርዱን ለመቀየር Super + Space ወይም የቋንቋ መምረጫውን ይጠቀሙ'
    ],
    macosSteps: [
      'Amharic.app ን ወደ ~/Library/Input Methods/ ይቅዱ: ./build.sh install',
      'ከኮምፒውተርዎ Log out ብለው ይመለሱ',
      'System Settings > Keyboard > Text Input > Input Sources > Edit ይክፈቱ',
      'በግራ በኩል "+" ይጫኑና "Amharic Phonetic" ን ይጨምሩ',
      'በ Menu Bar ወይም በ Ctrl + Space ኪቦርዱን ይቀያይሩ'
    ],
    windowsSteps: [
      'የዊንዶውስ TSF ፋይሎችን በ Administrator ያዘጋጁ: build.bat',
      'register.bat ን በ Run as Administrator ያሂዱ',
      'የዊንዶውስ ቋንቋ መቀየሪያን (Win + Space) በመጫን "Amharic Phonetic Keyboard" ን ይምረጡ',
      'በየትኛውም ፕሮግራም (Word, Chrome, Telegram) ውስጥ በአማርኛ ይተይቡ'
    ],

    settingsTitle: 'አጠቃላይ ቅንብሮች',
    themeLabel: 'የመተግበሪያው ገጽታ (Theme)',
    themeLight: 'ብርሃን (Light)',
    themeDark: 'ጨለማ (Dark)',
    themeSystem: 'እንደ ሲስተሙ (System)',
    langLabel: 'የመተግበሪያው ቋንቋ',
    hotkeyLabel: 'የቋንቋ መቀየሪያ አቋራጭ ቁልፍ (Hotkey)',
    hotkeyDesc: 'የሲስተሙ ነባሪ መቀየሪያ Ctrl + Space ነው። እንዲሁም Win + Space (Windows) ወይም Super + Space (Linux) መጠቀም ይችላሉ።',
    aboutLabel: 'ስለ መተግበሪያው',
    aboutDesc: 'የአማርኛ ፎነቲክ ኪቦርድ (Addiyon Scheme) ስሪት 1.0.0 — ሙሉ በሙሉ ከመስመር ውጭ (Offline) የሚሰራ፣ ደህንነቱ የተጠበቀ እና የግል መረጃ የማይሰበስብ።'
  },
  en: {
    appTitle: 'Amharic Keyboard Companion',
    practiceTab: 'Typing Practice',
    chartTab: 'Reference Chart',
    imeGuideTab: 'Enable Native IME',
    settingsTab: 'Settings',

    practiceTitle: 'Live Typing Practice Area',
    practiceSubtitle: 'Type Latin phonetic keys in this box; it transliterates into Ethiopic in real time. (e.g. selam -> ሰላም)',
    placeholder: 'Type here... (e.g., selam , endiet nesh -> ሰላም ፣ እንዴት ነሽ)',
    clearBtn: 'Clear',
    copyBtn: 'Copy Text',
    copiedToast: 'Text copied to clipboard!',
    statusAmharic: 'Amharic Active',
    statusEnglish: 'English (Latin)',
    toggleHint: 'Press Ctrl + Space to toggle language',
    wordsCount: 'Words',
    charsCount: 'Characters',

    imeTitle: 'Enable System-Wide Amharic Typing',
    imeSubtitle: 'This companion app is for practice and instructions only. System-wide typing in Telegram, Chrome, Word, etc. is handled by enabling the native OS Input Method (IME).',
    currentPlatformBadge: 'Detected OS',
    linuxTab: 'Linux (IBus)',
    macosTab: 'macOS (InputMethodKit)',
    windowsTab: 'Windows (TSF)',

    linuxSteps: [
      'Install the IBus engine: cd apps/desktop-ime/linux/ibus-amharic && ./install.sh',
      'Restart the IBus daemon: ibus restart',
      'Open Settings > Keyboard > Input Sources and click "+"',
      'Search and select "Amharic (Addiyon Phonetic)"',
      'Switch input sources via Super + Space or your tray indicator'
    ],
    macosSteps: [
      'Copy Amharic.app to ~/Library/Input Methods/: ./build.sh install',
      'Log out and log back in to macOS',
      'Open System Settings > Keyboard > Text Input > Input Sources > Edit',
      'Click "+" in the bottom-left and add "Amharic Phonetic"',
      'Switch input source from the menu bar or press Ctrl + Space'
    ],
    windowsSteps: [
      'Build the TSF Text Service: build.bat',
      'Run register.bat as Administrator (registers AmharicTSF64.dll & AmharicTSF32.dll)',
      'Press Win + Space and choose "Amharic Phonetic Keyboard"',
      'Type Amharic phonetically in any application (Word, Chrome, Telegram, Terminal)'
    ],

    settingsTitle: 'Application Settings',
    themeLabel: 'App Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System Default',
    langLabel: 'Companion Language',
    hotkeyLabel: 'Toggle Hotkey Display',
    hotkeyDesc: 'The native IME uses Ctrl + Space to toggle Latin pass-through. OS layout switcher: Win + Space (Win) / Super + Space (Linux).',
    aboutLabel: 'About',
    aboutDesc: 'Amharic Phonetic Keyboard (Addiyon Scheme) v1.0.0. 100% offline, zero network requests, zero telemetry, privacy guaranteed.'
  }
};
