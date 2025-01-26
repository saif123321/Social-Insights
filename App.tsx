import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {RootStack} from './Navigation';
import {Dimensions, Alert, Platform, PermissionsAndroid} from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {ToastProvider} from 'react-native-toast-notifications';
import InAppUpdates, {IAUUpdateKind} from 'sp-react-native-in-app-updates';
import IntentLauncher, {IntentConstant} from 'react-native-intent-launcher';
import DeviceInfo from 'react-native-device-info';
import isIgnoringBatteryOptimizations from './BatteryOptimization';

export const width = Dimensions.get('window').width * 0.01;
export const height = Dimensions.get('window').height * 0.01;

// Set this to true to simulate in-app updates in development mode
const IS_DEV_MODE = false;

function App(): React.JSX.Element {
  const [isIgnoringBatteryOpt, setIsIgnoringBatteryOpt] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      checkBatteryOptimization();
    }
  }, []);

  const checkBatteryOptimization = async () => {
    const isIgnoring = await isIgnoringBatteryOptimizations();
    console.log('isIgnoring', isIgnoring);

    if (!isIgnoring) {
      Alert.alert(
        'Battery Optimization',
        'Please disable battery optimization for this app to ensure smooth background processing.',
        [
          {text: 'Cancel', style: 'cancel'},
          {text: 'OK', onPress: requestIgnoreBatteryOptimization},
        ],
        {cancelable: false},
      );
    }
  };

  const requestIgnoreBatteryOptimization = async () => {
    if (Platform.OS === 'android') {
      const packageName = DeviceInfo.getBundleId();
      try {
        await IntentLauncher.startActivity({
          action: 'android.settings.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS',
          data: `package:${packageName}`,
        });
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    const checkForUpdate = async () => {
      if (Platform.OS === 'android') {
        if (IS_DEV_MODE) {
          setTimeout(() => {
            Alert.alert(
              'Update Available (Mock)',
              'A new update is available (simulated). Would you like to update now?',
              [
                {text: 'Later', style: 'cancel'},
                {
                  text: 'Update',
                  onPress: () => console.log('Update process started (mock)'),
                },
              ],
              {cancelable: false},
            );
          }, 1000); // Simulate a delay for checking updates
        } else {
          const inAppUpdates = new InAppUpdates(false); // Set to true if you are in debug mode

          try {
            const result = await inAppUpdates.checkNeedsUpdate();
            if (result.shouldUpdate) {
              Alert.alert(
                'Update Available',
                'A new update is available. Would you like to update now?',
                [
                  {text: 'Later', style: 'cancel'},
                  {
                    text: 'Update',
                    onPress: () =>
                      inAppUpdates.startUpdate({
                        updateType: IAUUpdateKind.IMMEDIATE,
                      }),
                  },
                ],
                {cancelable: false},
              );
            }
          } catch (error) {
            if (error.message.includes('ERROR_APP_NOT_OWNED')) {
              console.error(
                'In-app update error: The app is not owned by any user on this device.',
              );
              Alert.alert(
                'Update Check Failed',
                'The app is not installed from the Google Play Store. Please install the app from the Play Store to receive updates.',
                [{text: 'OK'}],
                {cancelable: false},
              );
            } else {
              console.error('Error checking for update:', error);
            }
          }
        }
      }
    };
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
    // checkForUpdate();
  }, []);

  return (
    <ToastProvider>
      <SafeAreaProvider>
        <Provider store={store}>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </Provider>
      </SafeAreaProvider>
    </ToastProvider>
  );
}

export default App;
