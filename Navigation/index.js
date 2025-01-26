import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginPage } from '../src/Screens/Login';

import DashboardNavigator from '../src/Screens/Dashboard/DashboardNavigator';
import React from 'react';
import { useSelector } from 'react-redux';
import { CoursesTopics } from '../src/Screens/Dashboard/Modules';
import { VideoDisplay } from '../src/Screens/Setting/VideoDisplay';
import { SignUpPage } from '../src/Screens/SignUp';

const Auth = createNativeStackNavigator();
const App = createNativeStackNavigator();
const Root = createNativeStackNavigator();


export const AuthStack = () => {
  return (
    <Auth.Navigator
      headerMode="screen"
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}>
      <Auth.Screen name="Login" component={LoginPage} />
      <Auth.Screen name="SignUp" component={SignUpPage} />
      {/* <Auth.Screen name="ForgotPassword" component={ForgotPassword} /> */}
    </Auth.Navigator>
  );
};
export const AppStack = () => {
  return (
    <App.Navigator
      headerMode="screen"
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <App.Screen name="DashboardNavigator" component={DashboardNavigator} />
    </App.Navigator>
  );
};
export const RootStack = () => {
  const token = useSelector(state => state?.authReducer?.token);

  return (
    <Root.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <Root.Screen name="AppStack" component={AppStack} />
      ) : (
        <Root.Screen name="AuthStack" component={AuthStack} />
      )}
    </Root.Navigator>
  );
};

