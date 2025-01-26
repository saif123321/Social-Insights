package com.digitalwellbing

import android.content.Intent
import android.os.Bundle
import android.provider.Settings
import com.digitalwellbing.packages.*
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import org.devio.rn.splashscreen.SplashScreen

class MainActivity : ReactActivity() {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  override fun getMainComponentName(): String = "DigitalWellbing"

  /**
   * Returns the instance of the [ReactActivityDelegate]. We use [DefaultReactActivityDelegate]
   * which allows you to enable New Architecture with a single boolean flags [fabricEnabled]
   */
  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
  override fun onCreate(savedInstanceState: Bundle?) {
    SplashScreen.show(this) // here
    super.onCreate(savedInstanceState)

    //Check if permission enabled
//    if (UsageStatsModule.getUsageStatsList(this).isEmpty()) {
//      val intent = Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS)
//      startActivity(intent)
//    }
  }

}
