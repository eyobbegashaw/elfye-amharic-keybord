export type Locale = 'am' | 'en';

export interface DesktopTranslations {
  appTitle: string;
  dashboardTab: string;
  practiceTab: string;
  chartTab: string;
  imeGuideTab: string;
  settingsTab: string;

  // Dashboard
  dashboardTitle: string;
  dashboardSubtitle: string;
  osLabel: string;
  imeStatusLabel: string;
  userProfileLabel: string;
  binaryStatusLabel: string;
  statusInstalled: string;
  statusNotInstalled: string;
  statusActive: string;
  statusInactive: string;
  statusReady: string;
  statusMissingBin: string;
  quickInstallBtn: string;
  repairBtn: string;
  openOsSettingsBtn: string;
  refreshBtn: string;
  supportedAppsTitle: string;
  supportedAppsDesc: string;

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

  // Installation Manager
  imeTitle: string;
  imeSubtitle: string;
  currentPlatformBadge: string;
  linuxTab: string;
  macosTab: string;
  windowsTab: string;
  installBtn: string;
  uninstallBtn: string;
  installingText: string;
  uninstallingText: string;
  manualGuideTitle: string;
  linuxSteps: string[];
  macosSteps: string[];
  windowsSteps: string[];

  // Settings & Updates
  settingsTitle: string;
  themeLabel: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  langLabel: string;
  startupLabel: string;
  startupDesc: string;
  inputPrefsLabel: string;
  allowWaLabel: string;
  convertPunctLabel: string;
  convertDigitsLabel: string;
  hotkeyLabel: string;
  hotkeyDesc: string;
  updatesLabel: string;
  checkUpdatesBtn: string;
  checkingUpdates: string;
  currentVersionLabel: string;
  upToDateText: string;
  updateAvailableText: string;
  aboutLabel: string;
  aboutDesc: string;
}

export const translations: Record<Locale, DesktopTranslations> = {
  am: {
    appTitle: 'እልፍዬ (Elfye) ኪቦርድ',
    dashboardTab: 'ዋና ገጽ',
    practiceTab: 'የመጻፊያ ልምምድ',
    chartTab: 'የፊደላት ሰንጠረዥ',
    imeGuideTab: 'ኪቦርድ መጫኛ',
    settingsTab: 'ቅንብሮች',

    dashboardTitle: 'የሲስተም ኪቦርድ ሁኔታ (System-Wide IME)',
    dashboardSubtitle:
      'በዎርድ፣ ክሮም፣ ቴሌግራም፣ ዋትስአፕ እና በማንኛውም የኮምፒውተር መተግበሪያ ውስጥ አማርኛ ለመጻፍ የሲስተም ኪቦርዱን ይጫኑ እና ያስተዳድሩ።',
    osLabel: 'ኦፕሬቲንግ ሲስተም',
    imeStatusLabel: 'የሲስተም IME ሁኔታ',
    userProfileLabel: 'የቋንቋ መምረጫ (Win+Space / IBus)',
    binaryStatusLabel: 'የመጫኛ ፋይሎች',
    statusInstalled: 'ተጭኗል እና ተመዝግቧል',
    statusNotInstalled: 'አልተጫነም',
    statusActive: 'ነቅቷል',
    statusInactive: 'አልነቃም',
    statusReady: 'ዝግጁ ነው',
    statusMissingBin: 'ፋይሉ አልተገኘም',
    quickInstallBtn: 'በሲስተሙ ላይ ጫን (Install)',
    repairBtn: 'ጥገና አድርግ (Repair)',
    openOsSettingsBtn: 'የሲስተም ቋንቋ ቅንብር ክፈት',
    refreshBtn: 'ሁኔታ አድስ',
    supportedAppsTitle: 'የሚሰራባቸው መተግበሪያዎች',
    supportedAppsDesc:
      'Microsoft Word • Google Chrome • Microsoft Edge • Telegram • WhatsApp • VS Code • Notepad',

    practiceTitle: 'የአማርኛ ጽሑፍ መለማመጃ',
    practiceSubtitle:
      'በዚህ ሳጥን ውስጥ በእንግሊዝኛ ፊደላት ይተይቡ፤ ወዲያውኑ ወደ አማርኛ ይቀየራል። (ለምሳሌ: selam -> ሰላም)',
    placeholder: 'እዚህ ይጻፉ... (ለምሳሌ: selam , endiet nesh -> ሰላም ፣ እንዴት ነሽ)',
    clearBtn: 'አጽዳ',
    copyBtn: 'ጽሑፉን ቅዳ',
    copiedToast: 'ጽሑፉ ተቀድቷል!',
    statusAmharic: 'አማርኛ ነቅቷል',
    statusEnglish: 'English (ላቲን)',
    toggleHint: 'ቋንቋ ለመቀየር Ctrl + Space ይጫኑ',
    wordsCount: 'ቃላት',
    charsCount: 'ፊደላት',

    imeTitle: 'የሲስተም ኪቦርድ መጫኛ እና ማስተዳደሪያ',
    imeSubtitle:
      'የእርስዎን ኮምፒውተር አይነት መርጠው የአማርኛ ኪቦርዱን በቀጥታ ይጫኑ፣ ይጠግኑ ወይም ያስወግዱ።',
    currentPlatformBadge: 'የእርስዎ ሲስተም',
    linuxTab: 'Linux (IBus)',
    macosTab: 'macOS (InputMethodKit)',
    windowsTab: 'Windows (TSF)',
    installBtn: 'ኪቦርዱን ጫን',
    uninstallBtn: 'ኪቦርዱን አስወግድ (Uninstall)',
    installingText: 'በመጫን ላይ ነው...',
    uninstallingText: 'በማስወገድ ላይ ነው...',
    manualGuideTitle: 'ተጨማሪ መመሪያ እና የመላ መፈለጊያ ደረጃዎች',

    linuxSteps: [
      'የ IBus Amharic ሞተርን ይጫኑ: cd apps/desktop-ime/linux/ibus-amharic && ./install.sh',
      'የ IBus ዲሞንን እንደገና ያስጀምሩ: ibus restart',
      'ወደ Settings > Keyboard > Input Sources ይሂዱና "+" ይጫኑ',
      'Elfye Amharic (Addiyon Phonetic) ን ይምረጡና ይጨምሩ',
      'ኪቦርዱን ለመቀየር Super + Space ወይም Ctrl + Space ይጠቀሙ',
    ],
    macosSteps: [
      'Amharic.app ን ወደ ~/Library/Input Methods/ ይጫኑ: ./build.sh --install',
      'ከኮምፒውተርዎ Log out ብለው ይመለሱ',
      'System Settings > Keyboard > Text Input > Input Sources > Edit ይክፈቱ',
      'በግራ በኩል "+" ይጫኑና "Elfye Amharic Phonetic" ን ይጨምሩ',
      'በ Menu Bar ወይም በ Ctrl + Space ኪቦርዱን ይቀያይሩ',
    ],
    windowsSteps: [
      'የዊንዶውስ TSF DLL ፋይሎችን በ build.bat ያዘጋጁ (x64 እና x86)',
      'ከላይ "ኪቦርዱን ጫን" ሲጫኑ የ Administrator (UAC) ፈቃድ ይስጡ',
      'Win + Space በመጫን "Elfye Amharic Phonetic" ን ይምረጡ',
      'በWord, Chrome, Telegram, VS Code እና Notepad ውስጥ በአማርኛ ይተይቡ',
    ],

    settingsTitle: 'አጠቃላይ ቅንብሮች እና ማዘመኛ',
    themeLabel: 'የመተግበሪያው ገጽታ (Theme)',
    themeLight: 'ብርሃን (Light)',
    themeDark: 'ጨለማ (Dark)',
    themeSystem: 'እንደ ሲስተሙ (System)',
    langLabel: 'የመተግበሪያው ቋንቋ',
    startupLabel: 'ኮምፒውተር ሲከፈት አብሮ ይጀምር',
    startupDesc: 'ሲስተሙ ሲበራ የእልፍዬ ረዳት መተግበሪያ በራስ-ሰር ይከፈታል።',
    inputPrefsLabel: 'የመጻፊያ ምርጫዎች (ለልምምድ ሳጥን)',
    allowWaLabel: 'ለ8ኛ ፊደላት "wa" ን ፍቀድ (ለምሳሌ kwa = ኳ)',
    convertPunctLabel: 'ሥርዓተ ነጥብን ወደ ግዕዝ ቀይር (, -> ፣ , . -> ።)',
    convertDigitsLabel: 'ቁጥሮችን ወደ ግዕዝ ቁጥር ቀይር (1 -> ፩)',
    hotkeyLabel: 'የቋንቋ መቀየሪያ አቋራጭ ቁልፍ (Hotkey)',
    hotkeyDesc:
      'የሲስተሙ ነባሪ መቀየሪያ Ctrl + Space ነው። እንዲሁም Win + Space (Windows) ወይም Super + Space (Linux) መጠቀም ይችላሉ።',
    updatesLabel: 'የስሪት እና የማዘመኛ መቆጣጠሪያ (Update Manager)',
    checkUpdatesBtn: 'አዲስ ስሪት ፈልግ',
    checkingUpdates: 'በመፈተሽ ላይ...',
    currentVersionLabel: 'አሁን ያለው ስሪት',
    upToDateText: 'አዲሱን ስሪት እየተጠቀሙ ነው።',
    updateAvailableText: 'አዲስ ስሪት ተገኝቷል!',
    aboutLabel: 'ስለ መተግበሪያው',
    aboutDesc:
      'እልፍዬ (Elfye) የአማርኛ ፎነቲክ ኪቦርድ — ሙሉ በሙሉ ከመስመር ውጭ (Offline) የሚሰራ፣ ደህንነቱ የተጠበቀ እና የግል መረጃ የማይሰበስብ።',
  },
  en: {
    appTitle: 'Elfye Keyboard',
    dashboardTab: 'Dashboard',
    practiceTab: 'Typing Practice',
    chartTab: 'Layout Chart',
    imeGuideTab: 'Install Manager',
    settingsTab: 'Settings',

    dashboardTitle: 'System-Wide Keyboard Status',
    dashboardSubtitle:
      'Install and manage native OS Input Method (IME) integration so you can type Amharic in Word, Chrome, Edge, Telegram, WhatsApp, VS Code, and Notepad.',
    osLabel: 'Operating System',
    imeStatusLabel: 'Native IME Status',
    userProfileLabel: 'OS Language Switcher',
    binaryStatusLabel: 'IME Binaries',
    statusInstalled: 'Installed & Registered',
    statusNotInstalled: 'Not Installed',
    statusActive: 'Enabled in Profile',
    statusInactive: 'Not Added Yet',
    statusReady: 'Ready',
    statusMissingBin: 'Missing Binaries',
    quickInstallBtn: 'Install System Keyboard',
    repairBtn: 'Repair Installation',
    openOsSettingsBtn: 'Open OS Language Settings',
    refreshBtn: 'Refresh Status',
    supportedAppsTitle: 'Supported System-Wide Applications',
    supportedAppsDesc:
      'Microsoft Word • Google Chrome • Microsoft Edge • Telegram • WhatsApp • VS Code • Notepad',

    practiceTitle: 'Live Typing Practice Area',
    practiceSubtitle:
      'Type Latin phonetic keys in this box; it transliterates into Ethiopic in real time. (e.g. selam -> ሰላም)',
    placeholder: 'Type here... (e.g., selam , endiet nesh -> ሰላም ፣ እንዴት ነሽ)',
    clearBtn: 'Clear',
    copyBtn: 'Copy Text',
    copiedToast: 'Text copied to clipboard!',
    statusAmharic: 'Amharic Active',
    statusEnglish: 'English (Latin)',
    toggleHint: 'Press Ctrl + Space to toggle language',
    wordsCount: 'Words',
    charsCount: 'Characters',

    imeTitle: 'Native IME Installation Manager',
    imeSubtitle:
      'Install, repair, or uninstall the native Input Method for your operating system with real OS registration.',
    currentPlatformBadge: 'Detected OS',
    linuxTab: 'Linux (IBus)',
    macosTab: 'macOS (InputMethodKit)',
    windowsTab: 'Windows (TSF)',
    installBtn: 'Install Keyboard',
    uninstallBtn: 'Uninstall Keyboard',
    installingText: 'Installing...',
    uninstallingText: 'Uninstalling...',
    manualGuideTitle: 'Manual Setup & Troubleshooting Steps',

    linuxSteps: [
      'Build & install IBus engine: cd apps/desktop-ime/linux/ibus-amharic && ./install.sh',
      'Restart the IBus daemon: ibus restart',
      'Open Settings > Keyboard > Input Sources and click "+"',
      'Search and select "Elfye Amharic (Addiyon Phonetic)"',
      'Switch input sources via Super + Space or Ctrl + Space',
    ],
    macosSteps: [
      'Build & copy Amharic.app to ~/Library/Input Methods/: ./build.sh --install',
      'Log out and log back in to macOS',
      'Open System Settings > Keyboard > Text Input > Input Sources > Edit',
      'Click "+" in the bottom-left and add "Elfye Amharic Phonetic"',
      'Switch input source from the menu bar or press Ctrl + Space',
    ],
    windowsSteps: [
      'Ensure AmharicTSF64.dll and AmharicTSF32.dll are built (build.bat)',
      'Click "Install Keyboard" above and approve the Windows Administrator (UAC) prompt',
      'Press Win + Space and choose "Elfye Amharic Phonetic (Addiyon)"',
      'Type Amharic phonetically in Word, Chrome, Edge, Telegram, VS Code, or Notepad',
    ],

    settingsTitle: 'Settings & Update Manager',
    themeLabel: 'Application Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
    langLabel: 'Interface Language',
    startupLabel: 'Launch at System Startup',
    startupDesc: 'Automatically start Elfye Desktop when you sign in to your computer.',
    inputPrefsLabel: 'Phonetic Input Preferences (Practice Area)',
    allowWaLabel: 'Enable "wa" alias for 8th labialized forms (e.g. kwa = ኳ)',
    convertPunctLabel: 'Convert punctuation to Ethiopic (, -> ፣ , . -> ።)',
    convertDigitsLabel: 'Convert numbers to Ethiopic numerals (1 -> ፩)',
    hotkeyLabel: 'Language Toggle Shortcut',
    hotkeyDesc:
      'Press Ctrl + Space inside the IME to switch between Amharic and English, or Win + Space (Windows) / Super + Space (Linux) to switch OS input sources.',
    updatesLabel: 'Version & Update Manager',
    checkUpdatesBtn: 'Check for Updates',
    checkingUpdates: 'Checking...',
    currentVersionLabel: 'Current Version',
    upToDateText: 'You are on the latest version.',
    updateAvailableText: 'A new release is available!',
    aboutLabel: 'About Elfye',
    aboutDesc:
      'Elfye Amharic Phonetic Keyboard (Addiyon Scheme) — 100% offline, privacy-first, zero telemetry.',
  },
};
