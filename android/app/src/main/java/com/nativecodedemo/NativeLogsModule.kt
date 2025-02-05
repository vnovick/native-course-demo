package com.nativecodedemo

import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule
import java.io.BufferedReader
import java.io.InputStreamReader

class NativeLogsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    @Volatile
    private var logging = false // Volatile variable to ensure visibility across threads
    private var logThread: Thread? = null // Thread for running the logging process

    override fun getName() = "NativeLogsModule" // Name of the module for React Native

    @ReactMethod
    fun startLogging() {
        if (logging) return // If already logging, do nothing
        logging = true // Set logging to true

        Log.d("NativeLogsModule", "Logging started") // Log to Android logcat
        sendLog("Logging started") // Send log to JavaScript

        logThread = Thread {
            try {
                // Execute logcat command to get system logs with timestamp
                val process = Runtime.getRuntime().exec("logcat -v time com.nativecodedemo:*")
                val bufferedReader = BufferedReader(InputStreamReader(process.inputStream))
                var line: String? = null // Initialize line variable
                val logBuffer = StringBuffer() // Buffer to collect logs
                while (logging && bufferedReader.readLine().also { line = it } != null) {
                    line?.let {
                        // Filter out logs generated by this module to prevent infinite logging loop
                        if (!it.contains("NativeLogsModule")) {
                            logBuffer.append(it).append("\n") // Append log to buffer
                        }
                    }
                    // Sleep for a second before sending logs
                    Thread.sleep(1000)
                    if (logBuffer.isNotEmpty()) {
                        sendLog(logBuffer.toString()) // Send buffered logs to JavaScript
                        logBuffer.setLength(0) // Clear the buffer
                    }
                }
                bufferedReader.close() // Close the bufferedReader
            } catch (e: Exception) {
                Log.e("NativeLogsModule", "Logging interrupted", e) // Log error to Android logcat
            }
        }
        logThread?.start() // Start the logging thread
    }

    @ReactMethod
    fun stopLogging() {
        if (!logging) return // If not logging, do nothing
        logging = false // Set logging to false
        logThread?.interrupt() // Interrupt the logging thread
        logThread = null // Set the thread to null

        Log.d("NativeLogsModule", "Logging stopped") // Log to Android logcat
        sendLog("Logging stopped") // Send log to JavaScript
    }

    private fun sendLog(message: String) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onNativeLog", message) // Emit event to JavaScript
    }
}
