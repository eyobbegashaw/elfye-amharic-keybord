import { Linking, Platform } from 'react-native';

/**
 * Deep-links directly to the OS keyboard settings page:
 * - Android: android.settings.INPUT_METHOD_SETTINGS
 * - iOS: app-settings:
 */
export async function openKeyboardSettings(): Promise<boolean> {
  try {
    if (Platform.OS === 'android') {
      // React Native Linking.sendIntent for Android Settings action
      if ('sendIntent' in Linking) {
        await (Linking as unknown as { sendIntent: (action: string) => Promise<void> }).sendIntent(
          'android.settings.INPUT_METHOD_SETTINGS',
        );
        return true;
      }
    } else if (Platform.OS === 'ios') {
      const url = 'app-settings:';
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
        return true;
      }
    }

    // Universal fallback: open app settings
    await Linking.openSettings();
    return true;
  } catch (err) {
    console.warn('Failed to open keyboard settings, falling back to openSettings:', err);
    try {
      await Linking.openSettings();
      return true;
    } catch {
      return false;
    }
  }
}
