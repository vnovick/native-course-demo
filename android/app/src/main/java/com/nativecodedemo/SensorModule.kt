package com.nativecodedemo

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class SensorsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext),
    SensorEventListener {

    private var sensorManager: SensorManager? = null
    private var accelerometer: Sensor? = null
    private var barometer: Sensor? = null
    private var magnetometer: Sensor? = null
    private var isTracking = false
    private val sensorDataCalculator = SensorDataCalculator()
    override fun getName() = "SensorsModule"

    init {
        sensorManager = reactContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        barometer = sensorManager?.getDefaultSensor(Sensor.TYPE_PRESSURE)
        magnetometer = sensorManager?.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD)
    }

    @ReactMethod
    fun startTracking() {
        if (isTracking) return
        isTracking = true

        sensorManager?.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_NORMAL)
        sensorManager?.registerListener(this, barometer, SensorManager.SENSOR_DELAY_NORMAL)
        sensorManager?.registerListener(this, magnetometer, SensorManager.SENSOR_DELAY_NORMAL)
    }

    @ReactMethod
    fun stopTracking() {
        if (!isTracking) return
        isTracking = false

        sensorManager?.unregisterListener(this)
        sensorDataCalculator.reset()
    }
    override fun onSensorChanged(event: SensorEvent?) {
        if (!isTracking || event == null) return

        when (event.sensor.type) {
            Sensor.TYPE_ACCELEROMETER -> {
                val currentTime = System.currentTimeMillis()
                val speed = sensorDataCalculator.calculateAccelerometerData(event.values, currentTime)

                val data = Arguments.createMap()
                data.putDouble("x", event.values[0].toDouble())
                data.putDouble("y", event.values[1].toDouble())
                data.putDouble("z", event.values[2].toDouble())
                data.putDouble("speed", speed.toDouble())
                sendEvent("accelerometerData", data)
            }
            Sensor.TYPE_PRESSURE -> {
                val altitude = sensorDataCalculator.calculateAltitude(event.values[0])
                val data = Arguments.createMap()
                data.putDouble("altitude", altitude)
                sendEvent("altitudeData", data)
                invalidate()
            }

            Sensor.TYPE_MAGNETIC_FIELD -> {
                val data = Arguments.createMap()
                data.putDouble("x", event.values[0].toDouble())
                data.putDouble("y", event.values[1].toDouble())
                data.putDouble("z", event.values[2].toDouble())
                sendEvent("magnetometerData", data)
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {

    }
    private fun sendEvent(eventName: String, params: WritableMap) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}