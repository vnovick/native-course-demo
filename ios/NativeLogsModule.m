// NativeLogsModule.m
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(NativeLogsModule, RCTEventEmitter)

RCT_EXTERN_METHOD(startLogging)
RCT_EXTERN_METHOD(stopLogging)

@end

