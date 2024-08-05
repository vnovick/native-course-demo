#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(CalculationsModule, NSObject)

RCT_EXTERN_METHOD(performIntensiveCalculations:(NSInteger)iterations resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
