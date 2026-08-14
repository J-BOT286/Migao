import SwiftUI

@main
struct ZheBuDeShouSiApp: App {
    @StateObject private var appState = AppState()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
        }
        #if os(macOS)
        .windowResizability(.contentSize)
        .defaultSize(width: 520, height: 860)
        #endif
    }
}
