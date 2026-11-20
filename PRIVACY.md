# Elfye Keyboard Privacy Policy (የግል መረጃ ጥበቃ ፖሊሲ)

**Last Updated**: 2026

At **Elfye Keyboard** (እልፍዬ ፎነቲክ ኪቦርድ), your privacy is not a preference—it is a fundamental architectural constraint.

---

## 1. Zero Keystroke Logging
- **Elfye NEVER logs, records, or stores what you type.**
- The transliteration algorithm is a stateless, in-memory greedy matcher. Keystrokes are converted to Ethiopic characters in RAM and immediately passed to the host operating system text field.
- No history, keystroke buffer, or typed content is saved to disk or persistent storage.

## 2. Zero Network Connectivity
- **Elfye NEVER transmits typed text, metrics, or telemetry across a network.**
- **100% Offline**: The application and all platform engines run entirely on-device without requiring an internet connection.
- **Android**: The keyboard does **NOT** declare `android.permission.INTERNET`. The operating system enforces that the keyboard cannot make HTTP requests or open network sockets.
- **iOS**: The keyboard extension does **NOT** request `RequestsOpenAccess` (Full Access). It operates inside the locked iOS keyboard sandbox with zero access to the network or location services.
- **Desktop IMEs (Windows, macOS, Linux)**: The input method engines are local in-process modules (`.dll`, `.so`, `.app`) without telemetry libraries, external tracking SDKs, or background daemons.

## 3. Zero Analytics & Tracking
- Elfye contains no tracking SDKs (e.g. Firebase, Mixpanel, Google Analytics).
- No device identifiers, IP addresses, location data, or usage metrics are collected.

## 4. Open Source Verification
The entire codebase for Elfye—across TypeScript, Java, Swift, C, and C++—is open source. Anyone can inspect, build, and verify that no network requests or logging calls exist in the software.
