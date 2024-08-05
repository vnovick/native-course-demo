package com.nativecodedemo

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp

class SensorDataViewManager : SimpleViewManager<SensorDataView>() {

    override fun getName() = "SensorDataView"

    override fun createViewInstance(reactContext: ThemedReactContext): SensorDataView {
        val view = SensorDataView(reactContext)
        view.startTracking()
        return view
    }

    override fun onDropViewInstance(view: SensorDataView) {
        super.onDropViewInstance(view)
        view.stopTracking()
    }

}
