import SwiftUI

struct ContentView: View {
    @State private var isAmharic: Bool = true
    @State private var practiceText: String = ""
    @State private var singleLineText: String = ""

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 24) {
                    // Header Brand Card
                    headerCard

                    // Onboarding Steps Card
                    onboardingCard

                    // Interactive Practice Area
                    practiceCard

                    // Privacy Statement Card
                    privacyCard

                    // Quick Rules Card
                    rulesCard
                }
                .padding()
            }
            .navigationTitle(isAmharic ? "አማርኛ ኪቦርድ" : "Amharic Keyboard")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: { isAmharic.toggle() }) {
                        HStack(spacing: 4) {
                            Image(systemName: "globe")
                            Text(isAmharic ? "English" : "አማርኛ")
                                .fontWeight(.semibold)
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(Color.accentColor.opacity(0.12))
                        .cornerRadius(8)
                    }
                }
            }
        }
    }

    // MARK: - Header Card
    private var headerCard: some View {
        VStack(spacing: 10) {
            Image(systemName: "keyboard.fill")
                .resizable()
                .scaledToFit()
                .frame(width: 50, height: 50)
                .foregroundColor(.accentColor)

            Text(isAmharic ? "የአማርኛ ፎኔቲክ ኪቦርድ" : "Amharic Phonetic Keyboard")
                .font(.title2)
                .fontWeight(.bold)
                .multilineTextAlignment(.center)

            Text(isAmharic
                 ? "በስልክዎ በማንኛውም መተግበሪያ (Telegram, WhatsApp, Notes) ውስጥ አማርኛን በቀላሉ ይተይቡ።"
                 : "Type Amharic naturally inside any app on your iPhone or iPad using Latin letters.")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding()
        .frame(maxWidth: .infinity)
        .background(Color(UIColor.secondarySystemBackground))
        .cornerRadius(14)
    }

    // MARK: - Onboarding Card
    private var onboardingCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                Image(systemName: "gearshape.fill")
                    .foregroundColor(.accentColor)
                Text(isAmharic ? "ኪቦርዱን እንዴት ማብራት ይቻላል?" : "How to Enable the Keyboard")
                    .font(.headline)
            }

            VStack(alignment: .leading, spacing: 12) {
                stepRow(number: "1", text: isAmharic ? "የስልክዎን «ቅንብሮች» (Settings) ይክፈቱ" : "Open iOS Settings")
                stepRow(number: "2", text: isAmharic ? "ወደ «አጠቃላይ > ኪቦርድ > ኪቦርዶች» ይሂዱ" : "Go to General > Keyboard > Keyboards")
                stepRow(number: "3", text: isAmharic ? "«አዲስ ኪቦርድ ጨምር...» (Add New Keyboard) ይንኩ" : "Tap Add New Keyboard...")
                stepRow(number: "4", text: isAmharic ? "«Amharic Phonetic» የሚለውን ይምረጡ" : "Select 'Amharic Phonetic'")
            }

            Button(action: openSystemSettings) {
                HStack {
                    Image(systemName: "arrow.up.forward.app.fill")
                    Text(isAmharic ? "ቅንብሮችን ክፈት" : "Open Settings")
                        .fontWeight(.semibold)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 12)
                .background(Color.accentColor)
                .foregroundColor(.white)
                .cornerRadius(10)
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(UIColor.secondarySystemBackground))
        .cornerRadius(14)
    }

    // MARK: - Interactive Practice Card
    private var practiceCard: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Image(systemName: "pencil.and.outline")
                    .foregroundColor(.accentColor)
                Text(isAmharic ? "የአጻጻፍ መለማመጃ" : "Practice Area")
                    .font(.headline)
            }

            Text(isAmharic
                 ? "እዚህ ጋር በመንካት አዲሱን ኪቦርድ ይሞክሩት (ለምሳሌ፦ «selam» ብለው ይተይቡ)፦"
                 : "Tap below to test your newly enabled keyboard (e.g. type 'selam')")
                .font(.footnote)
                .foregroundColor(.secondary)

            TextField(isAmharic ? "አንድ መስመር ይተይቡ..." : "Single-line test...", text: $singleLineText)
                .padding(12)
                .background(Color(UIColor.systemBackground))
                .cornerRadius(8)
                .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.secondary.opacity(0.3)))

            TextEditor(text: $practiceText)
                .frame(minHeight: 100)
                .padding(8)
                .background(Color(UIColor.systemBackground))
                .cornerRadius(8)
                .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.secondary.opacity(0.3)))

            if !practiceText.isEmpty || !singleLineText.isEmpty {
                Button(action: {
                    practiceText = ""
                    singleLineText = ""
                }) {
                    HStack {
                        Image(systemName: "trash")
                        Text(isAmharic ? "አጽዳ" : "Clear")
                    }
                    .font(.footnote)
                    .foregroundColor(.red)
                }
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(UIColor.secondarySystemBackground))
        .cornerRadius(14)
    }

    // MARK: - Privacy Statement Card
    private var privacyCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                Image(systemName: "lock.shield.fill")
                    .foregroundColor(.green)
                Text(isAmharic ? "የግል ደህንነት እና ነፃነት (Privacy)" : "Privacy & Security")
                    .font(.headline)
            }

            Text(isAmharic
                 ? "• ሙሉ ፈቃድ (Full Access) አያስፈልግም፦ ይህ ኪቦርድ ወደ ኢንተርኔት አይገናኝም።\n• ምንም አይነት የተየቡት ጽሑፍ፣ የይለፍ ቃል ወይም የግል መረጃ አይቀመጥም እንዲሁም አይላክም።\n• ሁሉም ስራዎች በስልክዎ ላይ ብቻ (100% On-Device) ይከናወናሉ።"
                 : "• No Full Access Required: This keyboard does not request or require network access.\n• Zero Logging: No keystrokes, personal details, or sensitive input are ever recorded or transmitted.\n• 100% On-Device: All transliterations are executed purely locally in memory.")
                .font(.footnote)
                .foregroundColor(.secondary)
                .lineSpacing(4)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(UIColor.secondarySystemBackground))
        .cornerRadius(14)
    }

    // MARK: - Quick Rules Card
    private var rulesCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Image(systemName: "textformat")
                    .foregroundColor(.accentColor)
                Text(isAmharic ? "የአዲዮን (Addiyon) አጻጻፍ ደንቦች" : "Addiyon Typing Rules")
                    .font(.headline)
            }

            VStack(alignment: .leading, spacing: 6) {
                ruleRow(latin: "he -> ሀ", desc: isAmharic ? "1ኛ ግዕዝ" : "1st order")
                ruleRow(latin: "hu -> ሁ", desc: isAmharic ? "2ኛ ካዕብ" : "2nd order")
                ruleRow(latin: "hi -> ሂ", desc: isAmharic ? "3ኛ ሣልስ" : "3rd order")
                ruleRow(latin: "ha -> ሃ", desc: isAmharic ? "4ኛ ራብዕ" : "4th order")
                ruleRow(latin: "hie -> ሄ", desc: isAmharic ? "5ኛ ኃምስ" : "5th order")
                ruleRow(latin: "h -> ህ", desc: isAmharic ? "6ኛ ሳድስ" : "6th order")
                ruleRow(latin: "ho -> ሆ", desc: isAmharic ? "7ኛ ሳብዕ" : "7th order")
                ruleRow(latin: "hua -> ኋ", desc: isAmharic ? "8ኛ ዲቃላ/ላቢያል" : "8th labial")
                ruleRow(latin: "s'h -> ስህ", desc: isAmharic ? "በአፖስትሮፊ መክፈል" : "Escape digraph")
            }
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(UIColor.secondarySystemBackground))
        .cornerRadius(14)
    }

    // MARK: - Helpers
    private func stepRow(number: String, text: String) -> some View {
        HStack(alignment: .top, spacing: 10) {
            Text(number)
                .font(.footnote)
                .fontWeight(.bold)
                .foregroundColor(.white)
                .frame(width: 22, height: 22)
                .background(Circle().fill(Color.accentColor))

            Text(text)
                .font(.subheadline)
        }
    }

    private func ruleRow(latin: String, desc: String) -> some View {
        HStack {
            Text(latin)
                .font(.system(.footnote, design: .monospaced))
                .fontWeight(.bold)
                .foregroundColor(.accentColor)
            Spacer()
            Text(desc)
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }

    private func openSystemSettings() {
        if let url = URL(string: UIApplication.openSettingsURLString),
           UIApplication.shared.canOpenURL(url) {
            UIApplication.shared.open(url)
        }
    }
}
