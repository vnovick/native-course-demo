package com.nativecodedemo

import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.view.View
import com.facebook.react.bridge.Arguments
import kotlin.math.atan2
import kotlin.math.cos
import kotlin.math.sin

class SensorDataView(context: Context) : View(context), SensorEventListener {

    private var accelerometerData: FloatArray = FloatArray(3)
    private var gyroscopeData: FloatArray = FloatArray(3)
    private var magnetometerData: FloatArray = FloatArray(3)
    private var speed: Float = 0f
    private var altitude: Float = 0f

    private val paint = Paint()
    private val compassPaint = Paint()
    private val barPaint = Paint()

    private var sensorManager: SensorManager? = null
    private var accelerometer: Sensor? = null
    private var barometer: Sensor? = null
    private var magnetometer: Sensor? = null

    private val sensorDataCalculator = SensorDataCalculator()

    init {
        paint.color = Color.WHITE
        paint.textSize = 40f

        compassPaint.color = Color.RED
        compassPaint.strokeWidth = 5f
        compassPaint.style = Paint.Style.STROKE

        barPaint.color = Color.GREEN

        sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        barometer = sensorManager?.getDefaultSensor(Sensor.TYPE_PRESSURE)
        magnetometer = sensorManager?.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD)


    }

    fun startTracking() {
        sensorManager?.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_NORMAL)
        sensorManager?.registerListener(this, magnetometer, SensorManager.SENSOR_DELAY_NORMAL)
        sensorManager?.registerListener(this, barometer, SensorManager.SENSOR_DELAY_NORMAL)
    }

    fun stopTracking() {
        sensorManager?.unregisterListener(this)
        sensorDataCalculator.reset()
    }

    fun updateAltitude(value: Float) {
        altitude = value
        invalidate()
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event == null) return

        when (event.sensor.type) {
            Sensor.TYPE_ACCELEROMETER -> {
                val currentTime = System.currentTimeMillis()
                speed = sensorDataCalculator.calculateAccelerometerData(event.values, currentTime)

                accelerometerData[0] = event.values[0]
                accelerometerData[1] = event.values[1]
                accelerometerData[2] = event.values[2]
                invalidate()
            }
            Sensor.TYPE_GYROSCOPE -> {
                gyroscopeData[0] = event.values[0]
                gyroscopeData[1] = event.values[1]
                gyroscopeData[2] = event.values[2]
                invalidate()
            }
            Sensor.TYPE_PRESSURE -> {
                altitude = sensorDataCalculator.calculateAltitude(event.values[0]).toFloat()
                invalidate()
            }

            Sensor.TYPE_MAGNETIC_FIELD -> {
                magnetometerData[0] = event.values[0]
                magnetometerData[1] = event.values[1]
                magnetometerData[2] = event.values[2]
                invalidate()
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // Handle accuracy changes if needed
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        canvas.drawColor(Color.BLACK)

        // Draw accelerometer data
        canvas.drawText("Accelerometer: ${accelerometerData.joinToString(", ")}", 10f, 50f, paint)
        canvas.drawText("Speed: $speed mph", 10f, 100f, paint)


        // Draw magnetometer data and compass
        val angle = atan2(magnetometerData[1], magnetometerData[0]) * (180 / Math.PI)
        canvas.drawText("Magnetometer: ${magnetometerData.joinToString(", ")}", 10f, 200f, paint)
        canvas.drawText("Angle: $angle", 10f, 250f, paint)

        val centerX = width / 2f
        val centerY = height / 2f
        canvas.drawCircle(centerX, centerY, 100f, compassPaint)
        canvas.drawLine(centerX, centerY, centerX + 100 * cos(Math.toRadians(angle)).toFloat(), centerY + 100 * sin(Math.toRadians(angle)).toFloat(), compassPaint)

        // Draw altitude bar
        canvas.drawText("Altitude: $altitude ft", 10f, 350f, paint)
        canvas.drawRect(10f, 400f, 60f, 400f - altitude, barPaint)

        // Draw speed bar
        canvas.drawText("Speed: $speed mph", 10f, 450f, paint)
        canvas.drawRect(70f, 500f, 70f + speed, 520f, barPaint)
    }
}
