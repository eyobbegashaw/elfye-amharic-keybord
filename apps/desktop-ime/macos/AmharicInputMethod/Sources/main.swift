import Cocoa
import InputMethodKit

let kConnectionName = "Amharic_1_Connection"

class AppDelegate: NSObject, NSApplicationDelegate {
    var server: IMKServer?

    func applicationDidFinishLaunching(_ notification: Notification) {
        guard let bundleID = Bundle.main.bundleIdentifier else {
            fatalError("Could not retrieve bundle identifier")
        }
        server = IMKServer(name: kConnectionName, bundleIdentifier: bundleID)
    }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.run()
