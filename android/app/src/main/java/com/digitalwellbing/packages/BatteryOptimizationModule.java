package com.digitalwellbing.packages;

import android.content.Context;
import android.os.PowerManager;
import android.provider.Settings;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;

public class BatteryOptimizationModule extends ReactContextBaseJavaModule {

    private static ReactApplicationContext reactContext;

    BatteryOptimizationModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;
    }

    @Override
    public String getName() {
        return "BatteryOptimizationModule";
    }

    @ReactMethod
    public void isIgnoringBatteryOptimizations(Promise promise) {
        PowerManager pm = (PowerManager) reactContext.getSystemService(Context.POWER_SERVICE);
        String packageName = reactContext.getPackageName();
        if (pm.isIgnoringBatteryOptimizations(packageName)) {
            promise.resolve(true);
        } else {
            promise.resolve(false);
        }
    }
}
