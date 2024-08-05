#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(SimpleDemoModule, NSObject)

RCT_EXTERN_METHOD(voidMethod)
RCT_EXTERN_METHOD(methodWithArgs:(NSString *)message)
RCT_EXTERN_METHOD(methodReturningPromise:(NSString *)message resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
