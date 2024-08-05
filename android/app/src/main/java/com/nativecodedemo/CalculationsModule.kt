package com.nativecodedemo

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.util.concurrent.Executors

class CalculationsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val executor = Executors.newSingleThreadExecutor()


    override fun getName() = "CalculationsModule"


    @ReactMethod
    fun performIntensiveCalculations(iterations: Int, promise: Promise) {
        executor.execute {
            try {
                val results = performIntensiveCalculations(iterations)
                promise.resolve(Arguments.fromList(results))
            } catch (e: Exception) {
                promise.reject("Error", e)
            }
        }
    }
    private fun calculateFibonacci(num: Int): Int {
        if (num <= 1) return num
        return calculateFibonacci(num - 1) + calculateFibonacci(num - 2)
    }

    private fun performIntensiveCalculations(iterations: Int): List<Int> {
        val results = mutableListOf<Int>()
        for (i in 0 until iterations) {
            val result = calculateFibonacci(40) // High enough number to simulate intensive calculation
            results.add(result)
        }
        return results
    }

}