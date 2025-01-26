package com.digitalwellbing.packages;


import android.graphics.Canvas;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.os.Build;
import android.util.Base64;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;

import java.util.List;
import java.util.Map;
import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
//import android.graphics.drawable.BitmapDrawable;
//import android.graphics.drawable.Drawable;
import android.provider.Settings;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

//import java.io.ByteArrayOutputStream;
import java.text.ParseException;
import java.util.List;
import android.app.usage.UsageStatsManager;
import android.app.usage.UsageStats;

import android.content.pm.ApplicationInfo;
import android.content.pm.PackageManager;
import android.util.ArrayMap;
import android.util.Base64;
import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.app.usage.UsageEvents;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;

import java.text.SimpleDateFormat;

import android.util.Log;

import java.util.Date;
import java.util.Locale;
import java.util.Map;
import java.util.HashMap;
import java.util.Calendar;
import java.util.List;
import java.util.ArrayList;
import java.lang.Long; // Import Long from java.lang
import java.util.TimeZone;

public class UsageStatsModule extends ReactContextBaseJavaModule {

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";

  public UsageStatsModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "UsageStats";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    // TODO: Add any necessary constants to the module here
    constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

  private static final SimpleDateFormat dateFormat = new SimpleDateFormat("M-d-yyyy HH:mm:ss");
  public static final String TAG = UsageStatsModule.class.getSimpleName();
  // @SuppressWarnings("ResourceType")
  // public static void getStats(Context context){
  //   UsageStatsManager usm = (UsageStatsManager) context.getSystemService("usagestats");
  //   int interval = UsageStatsManager.INTERVAL_YEARLY;
  //   Calendar calendar = Calendar.getInstance();
  //   long endTime = calendar.getTimeInMillis();
  //   calendar.add(Calendar.YEAR, -1);
  //   long startTime = calendar.getTimeInMillis();
  //
  //   Log.d(TAG, "Range start:" + dateFormat.format(startTime) );
  //   Log.d(TAG, "Range end:" + dateFormat.format(endTime));
  //
  //   UsageEvents uEvents = usm.queryEvents(startTime,endTime);
  //   while (uEvents.hasNextEvent()){
  //     UsageEvents.Event e = new UsageEvents.Event();
  //     uEvents.getNextEvent(e);
  //
  //     if (e != null){
  //       Log.d(TAG, "Event: " + e.getPackageName() + "\t" +  e.getTimeStamp());
  //     }
  //   }
  // }

  public static List getDates(int durationInDays){
    List dates = getDateRangeFromNow(Calendar.DATE, -(durationInDays));

    return dates;
  }

  public static List getDateRangeFromNow(int field, int amount){
  // public static List getDateRangeFromNow(int field, int amount){
    List dates = new ArrayList();
    Calendar calendar = Calendar.getInstance();
    long endTime = calendar.getTimeInMillis();
    calendar.add(field, amount);
    long startTime = calendar.getTimeInMillis();


    // TESTING 1 2 3...
    // SimpleDateFormat formatOne = new SimpleDateFormat("yyyy-MM-dd");
    // String dateOne = formatOne.format(startTime);
    // String dateTwo = formatOne.format(endTime);
    // Toast.makeText(getReactApplicationContext(), dateOne, Toast.LENGTH_SHORT).show();
    // Toast.makeText(getReactApplicationContext(), dateTwo, Toast.LENGTH_SHORT).show();

    dates.add(startTime);
    dates.add(endTime);

    return dates;
  }

   public static List<UsageStats> getUsageStatsList(Context context){
     UsageStatsManager usm = getUsageStatsManager(context);
     Calendar calendar = Calendar.getInstance();
     long endTime = calendar.getTimeInMillis();
     calendar.add(Calendar.YEAR, -1);
     long startTime = calendar.getTimeInMillis();

     Log.d(TAG, "Range start:" + dateFormat.format(startTime) );
     Log.d(TAG, "Range end:" + dateFormat.format(endTime));

     List<UsageStats> usageStatsList = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY,startTime,endTime);
     return usageStatsList;
   }

    private Map<String, Object> getAggregateStatsMap(Context context, String fromDate, String toDate) {
        UsageStatsManager usm = getUsageStatsManager(context);

        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
        long fromTime = 0;
        long toTime = 0;

        try {
            Calendar calendar = Calendar.getInstance();
            Date parsedDate = dateFormat.parse(fromDate);
            calendar.setTime(parsedDate);

            // Set fromTime to the start of the day
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            fromTime = calendar.getTimeInMillis();

            // Set toTime to the end of the day
            calendar.set(Calendar.HOUR_OF_DAY, 23);
            calendar.set(Calendar.MINUTE, 59);
            calendar.set(Calendar.SECOND, 59);
            calendar.set(Calendar.MILLISECOND, 999);
            toTime = calendar.getTimeInMillis();

            // Debugging: Log the from and to times
            Log.d(TAG, "UsageStats => From: " + fromTime + ", To: " + toTime + " parsedDate: " + parsedDate);

        } catch (ParseException e) {
            e.printStackTrace();
        }

        // Get the usage events for the given date range
        UsageEvents usageEvents = usm.queryEvents(fromTime, toTime);
        UsageEvents.Event event = new UsageEvents.Event();

        Map<String, Long> usageStatsMap = new HashMap<>();
        Map<String, Long> lastEventTimeMap = new HashMap<>();
        Map<String, Integer> appOpenCountMap = new HashMap<>();
        Map<String, Boolean> appForegroundStateMap = new HashMap<>();
        Map<String, Map<String, Long>> hourlyUsageStatsMap = new HashMap<>();

        while (usageEvents.hasNextEvent()) {
            usageEvents.getNextEvent(event);
            String packageName = event.getPackageName();
            long timeStamp = event.getTimeStamp();

            // Calculate the hour of the event
            Calendar eventCalendar = Calendar.getInstance();
            eventCalendar.setTimeInMillis(timeStamp);
            int eventHour = eventCalendar.get(Calendar.HOUR_OF_DAY);
            String hourKey = String.format("%02d:00", eventHour); // e.g., "13:00" for 1 PM

            // Initialize maps for each hour if not present
            if (!hourlyUsageStatsMap.containsKey(hourKey)) {
                hourlyUsageStatsMap.put(hourKey, new HashMap<>());
            }

            switch (event.getEventType()) {
                case UsageEvents.Event.MOVE_TO_FOREGROUND:
                    // Check if the app was not already in the foreground
                    lastEventTimeMap.put(packageName, timeStamp);
                    if (!Boolean.TRUE.equals(appForegroundStateMap.get(packageName))) {
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                            appOpenCountMap.put(packageName, appOpenCountMap.getOrDefault(packageName, 0) + 1);
                        }
                        appForegroundStateMap.put(packageName, true); // Mark the app as in foreground
                    }
                    break;

                case UsageEvents.Event.MOVE_TO_BACKGROUND:
                    Long lastForegroundTime = lastEventTimeMap.remove(packageName);
                    if (lastForegroundTime != null) {
                        long foregroundTime = timeStamp - lastForegroundTime;
                        Map<String, Long> hourStatsMap = hourlyUsageStatsMap.get(hourKey);
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                            hourStatsMap.put(packageName, hourStatsMap.getOrDefault(packageName, 0L) + foregroundTime);
                            usageStatsMap.put(packageName, usageStatsMap.getOrDefault(packageName, 0L) + foregroundTime);
                        }
                    }
                    appForegroundStateMap.put(packageName, false); // Mark the app as in background
                    break;
            }
        }

        // Combine usageStatsMap, appOpenCountMap, and phoneUnlockCount into a single result map
        Map<String, Object> result = new HashMap<>();
        result.put("usageStatsMap", usageStatsMap);
        result.put("hourlyUsageStatsMap", hourlyUsageStatsMap);
        result.put("appOpenCountMap", appOpenCountMap);
        // result.put("phoneUnlockCount", phoneUnlockCount);
        return result;
    }



    //  private Map<String, Object> getAggregateStatsMap(Context context, String fromDate, String toDate) {
//    UsageStatsManager usm = getUsageStatsManager(context);
//
//    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd", Locale.getDefault());
//    long fromTime = 0;
//    long toTime = 0;
//
//    try {
//      Calendar calendar = Calendar.getInstance();
//      Date parsedDate = dateFormat.parse(fromDate);
//      calendar.setTime(parsedDate);
//
//      // Set fromTime to the start of the day
//      calendar.set(Calendar.HOUR_OF_DAY, 0);
//      calendar.set(Calendar.MINUTE, 0);
//      calendar.set(Calendar.SECOND, 0);
//      calendar.set(Calendar.MILLISECOND, 0);
//      fromTime = calendar.getTimeInMillis();
//
//      // Set toTime to the end of the day
//      calendar.set(Calendar.HOUR_OF_DAY, 23);
//      calendar.set(Calendar.MINUTE, 59);
//      calendar.set(Calendar.SECOND, 59);
//      calendar.set(Calendar.MILLISECOND, 999);
//      toTime = calendar.getTimeInMillis();
//
//      // Debugging: Log the from and to times
//      Log.d(TAG, "UsageStats => From: " + fromTime + ", To: " + toTime + "parsedDate : " + parsedDate );
//
//    } catch (ParseException e) {
//      e.printStackTrace();
//    }
//
//    // Get the usage events for the given date range
//    UsageEvents usageEvents = usm.queryEvents(fromTime, toTime);
//    UsageEvents.Event event = new UsageEvents.Event();
//
//    Map<String, Long> usageStatsMap = new HashMap<>();
//    Map<String, Long> lastEventTimeMap = new HashMap<>();
//    Map<String, Integer> appOpenCountMap = new HashMap<>();
//    int phoneUnlockCount = 0;
//
//    while (usageEvents.hasNextEvent()) {
//      usageEvents.getNextEvent(event);
//      String packageName = event.getPackageName();
//      long timeStamp = event.getTimeStamp();
//
//      switch (event.getEventType()) {
//        case UsageEvents.Event.MOVE_TO_FOREGROUND:
//          lastEventTimeMap.put(packageName, timeStamp);
//          appOpenCountMap.put(packageName, appOpenCountMap.getOrDefault(packageName, 0) + 1);
//          break;
//        case UsageEvents.Event.MOVE_TO_BACKGROUND:
//          Long lastForegroundTime = lastEventTimeMap.remove(packageName);
//          if (lastForegroundTime != null) {
//            long foregroundTime = timeStamp - lastForegroundTime;
//            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
//              usageStatsMap.put(packageName, usageStatsMap.getOrDefault(packageName, 0L) + foregroundTime);
//            }
//          }
//          break;
//        case UsageEvents.Event.USER_PRESENT:
//          phoneUnlockCount++;
//          break;
//      }
//    }
//
//    // Combine usageStatsMap, appOpenCountMap, and phoneUnlockCount into a single result map
//    Map<String, Object> result = new HashMap<>();
//    result.put("usageStatsMap", usageStatsMap);
//    result.put("appOpenCountMap", appOpenCountMap);
//    result.put("phoneUnlockCount", phoneUnlockCount);
//
//    return result;
//  }



  // See here for more help:
  // https://github.com/ColeMurray/UsageStatsSample/blob/master/app/src/main/java/com/murraycole/appusagesample/UStats.java
   public static String printUsageStats(List<UsageStats> usageStatsList){
     String statsString = new String();
     statsString = statsString + "hello";
     for (UsageStats u : usageStatsList){
       // statsString = statsString + "Pkg: " + u.getPackageName() +  "\t" + "ForegroundTime: "
       //   + u.getTotalTimeInForeground() + "\n";
       statsString = statsString + "!";
     }
     return statsString;
   }

   public static void printCurrentUsageStatus(Context context){
     printUsageStats(getUsageStatsList(context));
   }
   @SuppressWarnings("ResourceType")
   private static UsageStatsManager getUsageStatsManager(Context context){
     UsageStatsManager usm = (UsageStatsManager) context.getSystemService("usagestats");
     return usm;
   }

  public String getStatsString(Map<String, Object> aggregateStatsMap) {
    PackageManager pm = getReactApplicationContext().getPackageManager();
    Map<String, Long> usageStatsMap = (Map<String, Long>) aggregateStatsMap.get("usageStatsMap");
    Map<String, Integer> appOpenCountMap = (Map<String, Integer>) aggregateStatsMap.get("appOpenCountMap");
    Map<String, Map<String, Long>> hourlyUsageStatsMap = (Map<String, Map<String, Long>>) aggregateStatsMap.get("hourlyUsageStatsMap");

    List<String> statsCollection = new ArrayList<>();
    List<String> appsCollection = new ArrayList<>();
    List<String> packageCollection = new ArrayList<>();
    List<String> iconsCollection = new ArrayList<>();
    List<String> appOpenCountCollection = new ArrayList<>();
    List<String> hourlyStatsCollection = new ArrayList<>();

    for (Map.Entry<String, Long> entry : usageStatsMap.entrySet()) {
      String packageName = entry.getKey();

      try {
        // Ensure the package is visible to this app
        ApplicationInfo appInfo = pm.getApplicationInfo(packageName, PackageManager.GET_META_DATA);

        // Skip apps with total foreground time less than 1 minute (60000 milliseconds)
        if (entry.getValue() <= 60000) {
          continue;
        }

        String appName = pm.getApplicationLabel(appInfo).toString();

        // Get the app icon drawable
        Drawable appIcon = pm.getApplicationIcon(appInfo);

        // Convert the app icon to Base64 encoded string
        String iconBase64 = convertDrawableToBase64(appIcon);

        // Add the app name, usage stats, and icon to their respective collections
        appsCollection.add(appName);
        packageCollection.add(packageName);
        statsCollection.add(String.valueOf(entry.getValue()));
        iconsCollection.add(iconBase64);

        // Get the app open count
        int appOpenCount = 0;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
          appOpenCount = appOpenCountMap.getOrDefault(packageName, 0);
        }
        appOpenCountCollection.add(String.valueOf(appOpenCount));

        // Log the details
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
          Log.d(TAG, "AppName: " + appName + " Foreground: " + entry.getValue() + " PackageName: " + packageName + " OpenCount: " + appOpenCount);
        }
      } catch (PackageManager.NameNotFoundException e) {
        e.printStackTrace();
        appsCollection.add(packageName);
        statsCollection.add(String.valueOf(entry.getValue()));
        iconsCollection.add(""); // Add empty string for icon if not found
        appOpenCountCollection.add("0");
      }
    }

    // Process the hourly usage stats map
    for (Map.Entry<String, Map<String, Long>> hourEntry : hourlyUsageStatsMap.entrySet()) {
      String hour = hourEntry.getKey();
      Map<String, Long> hourlyStats = hourEntry.getValue();

      for (Map.Entry<String, Long> hourlyStat : hourlyStats.entrySet()) {
        String packageName = hourlyStat.getKey();
        long usageTime = hourlyStat.getValue();
        hourlyStatsCollection.add(hour + "-" + packageName + "-" + usageTime);
      }
    }

    // Join the collections into single strings
    String stats = joinStringList(",", statsCollection);
    String apps = joinStringList(",", appsCollection);
    String package_name = joinStringList(",", packageCollection);
    String icons = joinStringList(",", iconsCollection);
    String appOpenCounts = joinStringList(",", appOpenCountCollection);
    String hourlyStats = joinStringList(",", hourlyStatsCollection);

    // Return the concatenated result
    return apps + ";" + stats + ";" + package_name + ";" + icons + ";" + appOpenCounts + ";" + hourlyStats;
  }
  private String convertDrawableToBase64(Drawable drawable) {
    Bitmap bitmap;
    if (drawable instanceof BitmapDrawable) {
      // If it's a BitmapDrawable, we can directly extract the Bitmap
      bitmap = ((BitmapDrawable) drawable).getBitmap();
    } else {
      // For other types of Drawables, we need to draw them onto a Bitmap
      int width = drawable.getIntrinsicWidth();
      int height = drawable.getIntrinsicHeight();

      // Create a Bitmap with appropriate width and height
      bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888);

      // Create a canvas to draw the drawable onto the Bitmap
      Canvas canvas = new Canvas(bitmap);
      drawable.setBounds(0, 0, canvas.getWidth(), canvas.getHeight());
      drawable.draw(canvas);
    }
    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
    bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
    byte[] byteArray = byteArrayOutputStream.toByteArray();
    return Base64.encodeToString(byteArray, Base64.DEFAULT);
  }

  public static String joinStringList(String joiner, List<String> items) {
    StringBuilder joined = new StringBuilder();

    for (int i = 0; i < items.size(); i++) {
      joined.append(items.get(i));
      if (i < items.size() - 1) {
        joined.append(joiner);
      }
    }

    return joined.toString();
  }
  @ReactMethod
  public void getStats(String fromDate, String toDate, Callback successCallback) {
    try {
      String stats = getStatsString(getAggregateStatsMap(getReactApplicationContext(), fromDate, toDate));
      successCallback.invoke(stats);
    } catch (Exception e) {
      String errorMessage = e.getMessage();
      Toast.makeText(getReactApplicationContext(), errorMessage, Toast.LENGTH_SHORT).show();
    }
  }
  @ReactMethod
  private void getAppIcon(String packageName , Callback successCallback) {
    PackageManager pm = getReactApplicationContext().getPackageManager();
    try {
      ApplicationInfo appInfo = pm.getApplicationInfo(packageName, PackageManager.GET_META_DATA);
      Drawable appIcon = pm.getApplicationIcon(appInfo);
      String iconBase64 = convertDrawableToBase64(appIcon);
      successCallback.invoke(iconBase64);
    } catch (PackageManager.NameNotFoundException e) {
      e.printStackTrace();
    }
  }

  @ReactMethod
  private void getAppName(String packageName , Callback successCallback) {
    PackageManager pm = getReactApplicationContext().getPackageManager();
    try {
      ApplicationInfo appInfo = pm.getApplicationInfo(packageName, PackageManager.GET_META_DATA);
      String appName = pm.getApplicationLabel(appInfo).toString();
      successCallback.invoke(appName);
    } catch (PackageManager.NameNotFoundException e) {
      e.printStackTrace();
    }
  }

  @ReactMethod
  public void requestUsageAccessPermission(Callback errorCallback, Callback successCallback) {
    Activity currentActivity = getCurrentActivity();
    if (currentActivity != null) {
      UsageStatsManager usm = (UsageStatsManager) currentActivity.getSystemService(Context.USAGE_STATS_SERVICE);
      if (getUsageStatsList(getReactApplicationContext()).isEmpty()) {
//        Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
//        currentActivity.startActivity(intent);
        errorCallback.invoke("denied");
      } else {
        successCallback.invoke("granted");
      }
    } else {
      errorCallback.invoke("Activity is null");
    }
  }

  @ReactMethod
  public void getUsageAccessPermission() {
    Activity currentActivity = getCurrentActivity();
      Intent intent = new Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS);
      currentActivity.startActivity(intent);
  }

  private boolean hasUsageAccessPermission(UsageStatsManager usm) {
    long currentTime = System.currentTimeMillis();
    List<UsageStats> stats = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY, currentTime - 1000 * 10, currentTime);
    return stats != null && !stats.isEmpty();
  }
  @ReactMethod
  public void testToast(
    int duration) {
      String test = "It works!";
      Toast.makeText(getReactApplicationContext(), test, duration).show();
    }
}
