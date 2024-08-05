import Foundation

@objc(CalculationsModule)
class CalculationsModule: NSObject {
  
  @objc
  func performIntensiveCalculations(_ iterations: Int, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
      DispatchQueue.global(qos: .background).async {
          do {
              let results = self.performIntensiveCalculations(iterations)
              resolve(results)
          } catch let error {
              reject("Error", error.localizedDescription, error)
          }
      }
  }
  
  @objc static func requiresMainQueueSetup() -> Bool {
         return false
     }
  
  private func calculateFibonacci(_ num: Int) -> Int {
          if num <= 1 { return num }
          return calculateFibonacci(num - 1) + calculateFibonacci(num - 2)
      }
  
  
  private func performIntensiveCalculations(_ iterations: Int) -> [Int] {
          var results: [Int] = []
          for _ in 0..<iterations {
              let result = calculateFibonacci(40) // Simulate intensive calculation
              results.append(result)
          }
          return results
      }
}
