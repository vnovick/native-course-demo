
import Foundation
import React

@objc(SimpleDemoModule) // Annotation to expose this class to React Native
class SimpleDemoModule: NSObject {
  
    static func moduleName() -> String! {
       return "SimpleDemoModule"
    }

    // Function to log a message (equivalent to voidMethod in Kotlin)
    @objc
    func voidMethod() {
        NSLog("SimpleDemoModule: Void method called") // Log to iOS console
    }

    // Function to log a message with arguments
    @objc
    func methodWithArgs(_ message: String) {
        NSLog("SimpleDemoModule: Method with args called: \(message)") // Log to iOS console
    }

    // Function to return a promise
    @objc
    func methodReturningPromise(_ message: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
      do {
        let result = "Received message: \(message)"
        resolve(result) // Resolve the promise with the result
      } catch let error {
        reject("ERROR", error.localizedDescription, error) // Reject the promise with an error
      }
    }
  
    
    @objc
    static func requiresMainQueueSetup() -> Bool {
        return true // Indicates that this module should be initialized on the main thread
    }

}

