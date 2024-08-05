import Foundation
import os.log
import OSLog
import React

@objc(NativeLogsModule)
class NativeLogsModule: RCTEventEmitter {

  private var logging = false
  private var logThread: Thread?

  override static func requiresMainQueueSetup() -> Bool {
      return true
  }
  
  @available(iOS 15.0, *)
  @objc(startLogging)
  func startLogging() {
      if logging { return }
      logging = true

      self.sendLog("Logging started")
      logThread = Thread {
          self.fetchLogs()
      }
      logThread?.start()
  }
  
  @objc(stopLogging)
     func stopLogging() {
         self.sendLog("Logging stopped")
         if !logging { return }
         logging = false
         logThread?.cancel()
         logThread = nil
     }

  
  @available(iOS 15.0, *)
     private func fetchLogs() {
         guard let logStore = try? OSLogStore(scope: .currentProcessIdentifier) else { return }
         let position = logStore.position(timeIntervalSinceLatestBoot: 0)
         let logBuffer: StringBuffer = StringBuffer()

         while logging {
             do {
                 let entries = try logStore.getEntries(at: position)
                 for entry in entries {
                     if let logEntry = entry as? OSLogEntryLog {
                       if let logEntry = entry as? OSLogEntryLog, logEntry.category == "", logEntry.subsystem == "" {
                         logBuffer.append(logEntry.composedMessage + "\n")
                       }
                     }
                 }
             } catch {
                 print("Error fetching logs: \(error)")
             }

             Thread.sleep(forTimeInterval: 1)
             if logBuffer.isNotEmpty() {
                 self.sendLog(logBuffer.toString())
                 logBuffer.clear()
             }
         }
     }

  private func sendLog(_ message: String) {
    DispatchQueue.main.async {
      self.sendEvent(withName: "onNativeLog", body: ["log": message])
    }
  }
  
  override func supportedEvents() -> [String]! {
    return ["onNativeLog"]
  }
}


class StringBuffer {
    private var buffer: String = ""

    func append(_ string: String) {
        buffer += string
    }

    func toString() -> String {
        return buffer
    }

    func isNotEmpty() -> Bool {
        return !buffer.isEmpty
    }

    func clear() {
        buffer = ""
    }
}

