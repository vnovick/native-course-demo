package com.nativecodedemo

import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class AmbientSensorModule(reactContext: ReactApplicationContext): ReactContextBaseJavaModule(reactContext), SensorEventListener {
    private val sensorManager: SensorManager = reactContext.getSystemService(ReactApplicationContext.SENSOR_SERVICE) as SensorManager
    private var lightSensor: Sensor? = sensorManager.getDefaultSensor(Sensor.TYPE_LIGHT)
    override fun getName(): String {
        return "AmbientSensorModule"
    }

    @ReactMethod
    fun start() {
        lightSensor?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_NORMAL)
        }
    }

    @ReactMethod
    fun stop() {
        sensorManager.unregisterListener(this)
    }

    override fun onSensorChanged(event: SensorEvent) {
        if (event.sensor.type == Sensor.TYPE_LIGHT) {
            val lightLevel = event.values[0]
            sendLightLevel(lightLevel)
        }
    }

    private fun sendLightLevel(lightLevel: Float) {
        reactApplicationContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java).emit("onLightSensorChange", lightLevel)
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {

    }
}