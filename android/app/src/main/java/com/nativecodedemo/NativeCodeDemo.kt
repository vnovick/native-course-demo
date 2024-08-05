package com.nativecodedemo

import android.view.View
import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ReactShadowNode
import com.facebook.react.uimanager.ViewManager

class NativeCodeDemo: ReactPackage {
    override fun createNativeModules(reactContext: ReactApplicationContext): MutableList<NativeModule> = listOf(
        SimpleDemoModule(reactContext),
        AmbientSensorModule(reactContext),
        CalculationsModule(reactContext),
        NativeLogsModule(reactContext),
        SensorsModule(reactContext),
        ImagePickerModule(reactContext)
    ).toMutableList()

    override fun createViewManagers(reactContext: ReactApplicationContext): MutableList<SensorDataViewManager> {
        return mutableListOf(SensorDataViewManager())
    }
}