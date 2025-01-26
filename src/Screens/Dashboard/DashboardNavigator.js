import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { Dashboard } from './Dashboard';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SettingScreenNavigator } from '../Setting/SettingScreenNavigator';
import { GroupScreen } from '../Group/GroupScreen';
import { GroupDetails } from '../Group/GroupDetails';
import { GroupUserDetails } from '../Group/GroupUserDetails';
import { DistractedApps } from '../Group/DistractedApps';
import { ShowLogs } from '../Setting/ShowLogs';
import { ShowLogsDetails } from '../Setting/ShowLogsDetails';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const SettingScreen = () => (
  <Stack.Navigator initialRouteName="SettingScreenNavigator" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SettingScreenNavigator" component={SettingScreenNavigator} />
    <Stack.Screen name="ShowLogs" component={ShowLogs} />
    <Stack.Screen name="ShowLogsDetails" component={ShowLogsDetails} />
  </Stack.Navigator>
);

const DashboardScreen = () => (
  <Stack.Navigator initialRouteName="DashboardNavigator" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="DashboardNavigator" component={Dashboard} />
  </Stack.Navigator>
);

const GroupScreens = () => (
  <Stack.Navigator initialRouteName="GroupScreen" screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GroupScreen" component={GroupScreen} />
    <Stack.Screen name="GroupDetails" component={GroupDetails} />
    <Stack.Screen name="GroupUserDetails" component={GroupUserDetails} />
    <Stack.Screen name="DistractedApps" component={DistractedApps} />
  </Stack.Navigator>
);


const DashboardNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#438f7f',
        headerShown: false,
        // header: ({ navigation, route, options }) => (
        //   <View style={styles.navigationHeader}>
        //     <Image
        //       source={require('../../images/logo.png')}
        //       style={styles.headerLogo}
        //     />
        //     <Text>{options.title}</Text>
        //   </View>
        // ),
      }}
      initialRouteName="Analytics"
    >
      <Tab.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../icons/setting.png')}
              style={{ tintColor: color, width: size, height: size }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../icons/dashboard_icon.png')}
              style={{ tintColor: color, width: size, height: size }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Groups"
        component={GroupScreens}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../../icons/progress_icon.png')}
              style={{ tintColor: color, width: size, height: size }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
export default DashboardNavigator;
