import Foundation
import CoreBluetooth

@objc(BluetoothModule)
class BluetoothModule: RCTEventEmitter, CBCentralManagerDelegate, CBPeripheralDelegate {
  var centralManager: CBCentralManager?
  var discoveredPeripherals: [CBPeripheral] = []
  var connectedPeripheral: CBPeripheral?
  var connectResolve: RCTPromiseResolveBlock?
  var connectReject: RCTPromiseRejectBlock?
  var services: [[String: Any]] = []
  
  override init() {
    super.init()
    self.centralManager = CBCentralManager(delegate: self, queue: nil)
  }
  
  override func supportedEvents() -> [String]! {
    return ["scanStarted", "scanStopped", "deviceFound", "deviceConnected", "serviceDiscovered", "characteristicDiscovered"]
  }
  
  func centralManagerDidUpdateState(_ central: CBCentralManager) {
          switch central.state {
          case .poweredOn:
              print("Bluetooth is powered on")
          case .poweredOff:
              print("Bluetooth is powered off")
          default:
              print("Bluetooth state is other")
          }
    }
  
  @objc
      func startScan(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
          guard let centralManager = centralManager else {
              reject("NoCentralManager", "Central Manager is not initialized", nil)
              return
          }
          if centralManager.state == .poweredOn {
              centralManager.scanForPeripherals(withServices: nil, options: nil)
              sendEvent(withName: "scanStarted", body: nil)
              resolve(nil)
          } else {
              reject("BluetoothNotPoweredOn", "Bluetooth is not powered on", nil)
          }
      }
  
      @objc
      func stopScan(_ resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
          guard let centralManager = centralManager else {
              reject("NoCentralManager", "Central Manager is not initialized", nil)
              return
          }
          centralManager.stopScan()
          sendEvent(withName: "scanStopped", body: nil)
          resolve(nil)
      }

  
  @objc
  func connectToDevice(_ uuidString: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
      guard let centralManager = centralManager else {
          reject("NoCentralManager", "Central Manager is not initialized", nil)
          return
      }
      if let peripheral = discoveredPeripherals.first(where: { $0.identifier.uuidString == uuidString }) {
          self.connectResolve = resolve
          self.connectReject = reject
          self.connectedPeripheral = peripheral
          centralManager.connect(peripheral, options: nil)
      } else {
          reject("DeviceNotFound", "Device with UUID \(uuidString) not found", nil)
      }
  }
  
  func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String : Any], rssi RSSI: NSNumber) {
         discoveredPeripherals.append(peripheral)
         let deviceInfo: [String: Any] = ["id": peripheral.identifier.uuidString, "name": peripheral.name ?? "Unknown"]
         sendEvent(withName: "deviceFound", body: deviceInfo)
     }
  
  func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
         sendEvent(withName: "deviceConnected", body: ["id": peripheral.identifier.uuidString])
         peripheral.delegate = self
         peripheral.discoverServices(nil)
     }
  
  
  func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
      if let error = error {
          connectReject?("ServiceDiscoveryError", error.localizedDescription, error)
          return
      }
      if let services = peripheral.services {
          var serviceList: [[String: Any]] = []
          for service in services {
              let serviceInfo: [String: Any] = ["id": service.uuid.uuidString, "uuid": service.uuid.uuidString, "characteristics": []]
              serviceList.append(serviceInfo)
              peripheral.discoverCharacteristics(nil, for: service)
          }
          self.services = serviceList
      } else {
          connectReject?("NoServices", "No services found for peripheral", nil)
      }
  }

  
  func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
      if let error = error {
          connectReject?("CharacteristicDiscoveryError", error.localizedDescription, error)
          return
      }
      if let characteristics = service.characteristics {
          var characteristicList: [[String: Any]] = []
          for characteristic in characteristics {
              let characteristicInfo: [String: Any] = ["id": characteristic.uuid.uuidString, "uuid": characteristic.uuid.uuidString, "value": ""]
              characteristicList.append(characteristicInfo)
          }
          if let index = self.services.firstIndex(where: { $0["uuid"] as? String == service.uuid.uuidString }) {
              self.services[index]["characteristics"] = characteristicList
          }
      }
      // Resolve the promise once all characteristics are discovered
      if let connectedPeripheral = connectedPeripheral, connectedPeripheral.services?.last?.uuid == service.uuid {
          connectResolve?(self.services)
      }
  }

  
}
