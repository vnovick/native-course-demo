package com.nativecodedemo

import android.util.Log
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class SimpleDemoModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "SimpleDemoModule"
    }

    @ReactMethod
    fun voidMethod() {
        Log.d("SimpleDemoModule", "Void method called")
    }

    @ReactMethod
    fun methodWithArgs(message: String) {
        Log.d("SimpleDemoModule", "Method with args called: $message") // Log to Android logcat
    }

    @ReactMethod
    fun methodReturningPromise(message: String, promise: Promise) {
        try {
            val result = "Received message: $message"
            promise.resolve(result) // Resolve the promise with the result
        } catch (e: Exception) {
            promise.reject("ERROR", e) // Reject the promise with an error
        }
    }

}