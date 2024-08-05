package com.nativecodedemo

import kotlin.math.pow
import kotlin.math.sqrt

class SensorDataCalculator {

    private var lastAccelValues = FloatArray(3) { 0f }
    private var lastAccelTimestamp = 0L
    private var speed = 0f

    fun calculateAccelerometerData(eventValues: FloatArray, currentTime: Long): Float {
        if (lastAccelTimestamp == 0L) {
            lastAccelTimestamp = currentTime
            lastAccelValues = eventValues.clone()
            return speed
        }

        val dt = (currentTime - lastAccelTimestamp) / 1000.0f // Time difference in seconds
        val dx = eventValues[0] - lastAccelValues[0]
        val dy = eventValues[1] - lastAccelValues[1]
        val dz = eventValues[2] - lastAccelValues[2]
        val acceleration = sqrt((dx * dx + dy * dy + dz * dz).toDouble()).toFloat()

        // Apply damping factor to prevent speed from increasing indefinitely
        if (acceleration > 1) { // Threshold to filter out minor vibrations
            speed += (acceleration - 1) * dt * 2.23694f // Convert m/s to mph
        } else {
            speed -= speed * 0.9f * dt // Reduce speed gradually
            if (speed < 0.9f) speed = 0f // Set speed to zero if it's very low
        }

        lastAccelValues = eventValues.clone()
        lastAccelTimestamp = currentTime

        return speed
    }

    fun calculateAltitude(pressure: Float): Double {
        // Using the barometric formula to calculate altitude from pressure
        val seaLevelPressure = 1013.25f // hPa
        return (1 - (pressure / seaLevelPressure).toDouble().pow(0.190284)) * 44307.694f // Altitude in feet
    }

    fun reset() {
        lastAccelValues = FloatArray(3) { 0f }
        lastAccelTimestamp = 0L
        speed = 0f
    }
}
