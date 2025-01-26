// Dashboard.js (or Dashboard.tsx)
import React, { Component, useState, useEffect } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList, Image,
  TouchableOpacity, Linking
} from 'react-native';
import _ from 'lodash';
import { TextInput } from 'react-native-paper';
import { MultipleSelectList } from 'react-native-dropdown-select-list';
import { NativeModules } from 'react-native';
const UsageStats = NativeModules.UsageStats;
export const width = Dimensions.get('window').width * 0.01;
export const height = Dimensions.get('window').height * 0.01;
import { styles } from '../Login/style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ProgressBar } from 'react-native-paper';
import moment from 'moment';
import { GetGroups } from '../../helperFunction/postRequest';
import { useSelector, useDispatch } from 'react-redux';
import { PostAnalyticsData } from '../../redux/actions/authActions';
import * as types from '../../redux/types';
import { request, openSettings } from 'react-native-permissions';
import { useNavigation } from '@react-navigation/native';
import BackgroundFetch from 'react-native-background-fetch';
import { getDateInfo, getDispatch, getLogsInfo } from '../../redux/store/reduxStore';
import HourlyUsageBarChart from './HourlyUsageBarChart';

export const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [durationInDays, setDurationInDays] = useState(1);
  const [selectedNames, setSelectedNames] = useState([]);
  const [filteredStats, setFilteredStats] = useState([]);
  const [hourlyUsageData, sethourlyUsageData] = useState([]);
  const [appName, setappName] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  // const fromDate = String(new Date('2024-05-01').getTime());
  // const toDate = String(new Date('2024-05-09').getTime());
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [fromDate, setFromDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [toDate, setToDate] = useState(new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate()));
  const token = useSelector(state => state.authReducer.token);
  const auth_data = useSelector(state => state.authReducer.auth);
  console.log("auth : ", auth_data);
  const date_info = useSelector(state => state.authReducer.info);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [permissionAccess, setPermissionAccess] = useState('');
  const navigation = useNavigation();

  const handleSelect = (name) => {
    setappName(name);
    setShowSuggestions(false);
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      UsageStats.requestUsageAccessPermission(
        () => {
          setPermissionAccess('denied');
          console.log('denied');
        },
        () => {
          setPermissionAccess('granted');
          performBackgroundSync();
          console.log('Permission granted');
        }
      );
    });

    return unsubscribe;
  }, [navigation]);


  // useEffect(() => {
  //   performBackgroundSync();
  // }, []);

  const getPermission = () => {
    UsageStats.getUsageAccessPermission();
    console.log('Permission settings opened');
  };

  const GetGroupData = async () => {
    try {
      const response = await GetGroups(token);
      return response;
    } catch (error) {
      console.error('Error fetching groups data:', error);
      throw error;
    }
  };
  const dispatch = useDispatch();

  const checkDataHitServer = async () => {
    console.log("checkDataHitServer called");
    const dispatch_date_info = getDateInfo();
    console.log("date info ", dispatch_date_info);
    try {
      const date_now = new Date();
      const yesterday_date = new Date(date_now);
      yesterday_date.setDate(yesterday_date.getDate());
      const start_date = new Date(yesterday_date.getFullYear(), yesterday_date.getMonth(), yesterday_date.getDate());
      const from_date = String(start_date.toISOString().slice(0, 10));
      const to_date = String(toDate.toISOString().slice(0, 10));
      dispatch({ type: types.UPDATES_DATES, payload: [start_date.toISOString().slice(0, 10)] });
      if (dispatch_date_info == undefined || !dispatch_date_info.includes(start_date.toISOString().slice(0, 10))) {
        let filter_data = [];
        console.log("dispatch date : ", start_date.toISOString().slice(0, 10));
        let hourly_data = [];
        const stats = await new Promise((resolve, reject) => {
          UsageStats.getStats(from_date, to_date, (message) => {
            const stats = parseStats(message, 'api');
            hourly_data = stats[1]
            resolve(stats[0]);
          });
        });
        filter_data = stats.filter(
          stat => stat.time > 60000
        );
        console.log("Hourly Data : " , hourly_data);
        const response = await dispatch(PostAnalyticsData(token, from_date, filter_data , hourly_data));

        console.log('Analytics data sent.');
        const logObject = {
          date: new Date().toISOString(),
          time: new Date().toLocaleTimeString(),
          status: "success",
          message: 'Api Hit',
          api_hit_date: from_date
        };
        const logsData = getLogsInfo() ?? [];
        const newLogsData = [...logsData, logObject]; // Create a new array with the existing logs and the new log
        console.log(newLogsData);
        dispatch({ type: types.LOGS, payload: newLogsData });
      } else {
        console.log('Analytics data already sent of yesterday.');
      }

    } catch (error) {
      console.error('Error checking data on server:', error);
      const logObject = {
        date: new Date().toISOString(),
        time: new Date().toLocaleTimeString(),
        status: "failed",
        message: error.message,
      };
      const logsData = getLogsInfo() ?? [];
      const newLogsData = [...logsData, logObject];
      console.log(newLogsData);

      dispatch({ type: types.LOGS, payload: newLogsData });
      rescheduleBackgroundSync();
    }
  };

  // const checkDataHitServer = async () => {
  //   console.log("checkDataHitServer called"); // Logging for debugging
  //   try {
  //     const group_data = await GetGroupData();
  //     if (group_data.groups.length) {
  //       let filter_data = [];
  //       // const date_now = new Date();
  //       // const yesterday_date = new Date(date_now);
  //       // yesterday_date.setDate(yesterday_date.getDate());
  //       // const start_date = new Date(yesterday_date.getFullYear(), yesterday_date.getMonth(), yesterday_date.getDate());
  //       // const end_date = new Date(start_date);
  //       // end_date.setDate(end_date.getDate() + 1);
  //       const from_date = String(toDate.toISOString().slice(0, 10));
  //       const to_date = String(toDate.toISOString().slice(0, 10));
  //       // console.log("date_info", date_info);
  //       // console.log(start_date, end_date);
  //       // dispatch({ type: types.UPDATES_DATES, payload: [start_date.toISOString().slice(0, 10)] });
  //       // console.log("date_info", from_date, to_date);
  //       // if (date_info == undefined || !date_info.includes(start_date.toISOString().slice(0, 10))) {
  //         const stats = await new Promise((resolve, reject) => {
  //           UsageStats.getStats(from_date, to_date, (message) => {
  //             const stats = parseStats(message);
  //             resolve(stats);
  //           });
  //         });
  //         filter_data = stats.filter(
  //           stat => stat.time > 60000
  //         );
  //         const response = await dispatch(PostAnalyticsData(token, from_date, filter_data));
  //         console.log(response);
  //       // } else {
  //         console.log('Analytics data sent.');
  //       // }
  //     }
  //   } catch (error) {
  //     console.error('Error checking data on server:', error);
  //   }
  // };

  useEffect(() => {
    getStats(fromDate, toDate);
    filterStats();
  }, [fromDate, toDate]);

  useEffect(() => {
    filterStats();
  }, [appName]);

  const updateDuration = (val) => {
    let newVal = val;
    if (!(parseInt(val) >= 0)) {
      newVal = '0';
    }
    setDurationInDays(parseInt(newVal));
  };

  const getStats = (fromDate, toDate) => {
    const from_date = String(toDate.toISOString().slice(0, 10));
    const to_date = String(toDate.toISOString().slice(0, 10));
    // console.log("js ");
    console.log(from_date, to_date);
    setStats([]);
    UsageStats.getStats(from_date, to_date, (message) => {
      console.log("message : ", message);
      const stats = parseStats(message, 'app');
      const filter_data = stats.filter(
        stat => stat.time > 60000
      );
      // console.log(filter_data);
      setStats(filter_data);
    });
  };
  const filterStats = () => {
    let filtered = stats;
    if (selectedNames.length > 0) {
      console.log(selectedNames);
      filtered = filtered.filter(stat => selectedNames.includes(stat.name));
    }
    if (appName.trim() !== '') {
      filtered = filtered.filter(stat => stat.name.toLowerCase().includes(appName.toLowerCase()));
    } else {
      setShowSuggestions(false);
    }
    setFilteredStats(filtered);
  };

  const parseStats = (unparsed, to) => {
    const [appsName, Usagestats, packageNames, Appicons, appOpenCounts, hourlyStats] = unparsed.split(';');
    const times = Usagestats.split(',').map(val => parseInt(val));
    const apps = appsName.split(',').map(name => name.split('.').pop());
    const packages = packageNames.split(',');
    const icons = Appicons.split(',');
    const session_count = appOpenCounts.split(',');
    const hourlyUsageArray = hourlyStats.split(',');

    const hourlyUsageData = hourlyUsageArray.map(entry => {
      const [hour, packageName, usageTime] = entry.split('-');
      return { hour, packageName, usageTime: Number(usageTime) };
    });
    console.log('Hourly Usage Data:', hourlyUsageData);
    sethourlyUsageData(hourlyUsageData.length > 1 ? hourlyUsageData : []);
    const stats = [];
    if (to == 'api') {
      for (let i = 0; i < apps.length; i++) {
        if (!packages[i].includes("launcher")) {
          stats.push({
            name: apps[i],
            package_name: packages[i],
            time: times[i],
            session_count: session_count[i],
          });
        }
      }
      return [stats , hourlyUsageData];

    } else {
      for (let i = 0; i < apps.length; i++) {
        if (!packages[i].includes("launcher")) {
          stats.push({
            name: apps[i],
            time: times[i],
            icon: icons[i],
            session_count: session_count[i],
          });
        }
      }
      return stats;
    }
  };


  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h : ${minutes}m`;
  };
  const handlePrevious = () => {
    const previousDate = new Date(fromDate);
    previousDate.setDate(previousDate.getDate() - 1);
    const nextDate = new Date(previousDate); // Create a new date object based on the previousDate
    nextDate.setDate(nextDate.getDate() + 1); // Add 1 day to the nextDate

    setFromDate(previousDate);
    setToDate(nextDate);
  };

  const handleNext = () => {
    const nextDate = new Date(fromDate);
    nextDate.setDate(nextDate.getDate() + 1);
    const toDate = new Date(nextDate); // Create a new date object based on the nextDate
    toDate.setDate(toDate.getDate() + 1); // Add 1 day to toDate

    setFromDate(nextDate);
    setToDate(toDate);
  };



  const performBackgroundSync = async () => {
    const group_data = await GetGroupData();
    const dispatch_l = getDispatch();

    if (group_data.groups.length) {
      BackgroundFetch.configure(
        {
          minimumFetchInterval: 15, // Set to a realistic interval
          enableHeadless: true,
          stopOnTerminate: false,
          startOnBoot: true,
          forceAlarmManager: true,
          requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
        },
        async (taskId) => {
          console.log("[BackgroundFetch] taskId: ", taskId);
          try {
            const result = await checkDataHitServer();
            console.log("[BackgroundFetch] Data sent to server successfully.");
            const logObject = {
              date: new Date().toISOString(),
              time: new Date().toLocaleTimeString(),
              status: "success",
              message: 'Service Call'
            };
            const logsData = getLogsInfo() ?? [];
            const newLogsData = [...logsData, logObject];
            console.log(newLogsData);

            dispatch_l({ type: types.LOGS, payload: newLogsData });
          } catch (error) {
            console.error("[BackgroundFetch] Error sending data to server:", error);
            const logObject = {
              date: new Date().toISOString(),
              time: new Date().toLocaleTimeString(),
              status: "failed",
              message: error.message,
            };
            const logsData = getLogsInfo() ?? [];
            const newLogsData = [...logsData, logObject];
            console.log(newLogsData);

            dispatch_l({ type: types.LOGS, payload: newLogsData });
            rescheduleBackgroundSync();
          }
          BackgroundFetch.finish(taskId);
        },
        (error) => {
          console.log("[BackgroundFetch] failed to start", error);
          const logObject = {
            date: new Date().toISOString(),
            time: new Date().toLocaleTimeString(),
            status: "failed",
            message: error.message,
          };
          const logsData = getLogsInfo() ?? [];
          const newLogsData = [...logsData, logObject]; // Create a new array with the existing logs and the new log
          console.log(newLogsData);

          dispatch_l({ type: types.LOGS, payload: newLogsData });
          // console.error('[BackgroundFetch HeadlessTask] Error sending data to server:', error);
        }
      );

      BackgroundFetch.status((status) => {
        switch (status) {
          case BackgroundFetch.STATUS_RESTRICTED:
            console.log("BackgroundFetch restricted");
            break;
          case BackgroundFetch.STATUS_DENIED:
            console.log("BackgroundFetch denied");
            break;
          case BackgroundFetch.STATUS_AVAILABLE:
            console.log("BackgroundFetch is enabled");
            break;
        }
      });
      // rescheduleBackgroundSync();
    }
  };

  const rescheduleBackgroundSync = () => {
    BackgroundFetch.scheduleTask({
      taskId: 'com.digitalwellbing.sync',
      delay: 5000, // 5 seconds
      enableHeadless: true,
      periodic: false,
      forceAlarmManager: true,
      stopOnTerminate: false,
      startOnBoot: true,
      requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
    });
  };

  // const getAppname = (app_name) => {
  //   UsageStats.getAppName(app_name, (message) => {
  //     console.log("appName : " , message);
  //   });
  //   console.log("working" , app_name)
  //   return app_name;
  // }



  const AppItem = React.memo(({ app_name, app_usage, app_icon, app_session }) => {
    const totalMilliseconds = durationInDays * 24 * 60 * 60 * 1000;
    const progressBarValue = app_usage / totalMilliseconds;

    // Decode the Base64 encoded icon data
    const iconUri = `data:image/png;base64,${app_icon}`;

    return (
      <View style={{ padding: 10 }}>
        <View style={styles.usageWrapper}>
          {/* Display the app icon */}
          <Image source={{ uri: iconUri }} style={{ width: 30, height: 30 }} />
          <View style={{ marginHorizontal: 10, width: width * 50 }}>
            <Text style={styles.courseChaptername}>{app_name}</Text>
            <Text style={{ fontSize: 10, color: 'black' }}>Sessions: {app_session} </Text>
          </View>
          <Text style={styles.courseChaptername}>{formatTime(app_usage)}</Text>
        </View>
        <ProgressBar
          animatedValue={progressBarValue}
          progress={progressBarValue}
          style={styles.progressBar}
          color='green'
        />
      </View>
    );
  });



  const getStatsComponents = () => {
    const statsToDisplay = appName.trim() !== '' || selectedNames.length > 0 ? filteredStats : stats;
    const sortedStats = _.sortBy(statsToDisplay, ['time']).reverse(); // Sort and slice stats array
    const filteredStatsGreaterThan60Seconds = sortedStats.filter(
      stat => stat.time > 60000,
    ); // Filter stats where time is greater than 60 seconds

    return (
      (filteredStatsGreaterThan60Seconds.length) ? (
        <FlatList
          data={filteredStatsGreaterThan60Seconds}
          // contentContainerStyle={{ justifyContent: 'center' }}
          numColumns={1}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <AppItem
              index={index}
              app_name={item.name}
              app_usage={item.time}
              app_icon={item.icon}
              app_session={item.session_count}
            />
          )}
          style={{ height: '45%' }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View>
          <Text style={{ textAlign: 'center', fontWeight: '900', fontSize: 16, color: 'black' }}>No Data Found!</Text>
        </View>
      )
    );
  };

  const sortedStats = _.sortBy(stats, ['time']).reverse(); // Sort and slice stats array
  const filteredStatsGreaterThan60Seconds = sortedStats.filter(
    stat => stat.time > 60000,
  ); // Filter stats where time is greater than 60 seconds

  const data = filteredStatsGreaterThan60Seconds.map((stat, idx) => ({
    key: `${idx}`,
    value: stat.name,
  }));

  const handleMenuClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };
  const getTotalUsageTime = () => {
    const statsToDisplay = appName.trim() !== '' || selectedNames.length > 0 ? filteredStats : stats;
    const totalMilliseconds = _.sumBy(statsToDisplay, 'time');
    if (isNaN(totalMilliseconds)) {
      return '0h 0m 0s';
    }
    const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);
    const formattedTime = `${hours}hr ${minutes}m ${seconds}s`;
    return formattedTime;
  };


  return (
    <View style={styles.container}>
      {/* <View>
        <Text style={styles.welcome}>Analytics</Text>
      </View> */}
      <View>
        {/* <TouchableOpacity onPress={handleMenuClick} style={{ backgroundColor: 'black', padding: 10, borderRadius: 50 }}>
          <Ionicons name="menu" size={20} color="white" />
        </TouchableOpacity> */}
        <View >
          <TextInput
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            underlineColorAndroid="transparent"
            style={styles.searchInput}
            value={appName}
            placeholder="Search Apps"
            theme={{
              roundness: 20,
              colors: {
                placeholder: 'grey',
                primary: 'grey',
              },
              fonts: { regular: { fontFamily: 'Poppins-Light' } },
            }}
            onChangeText={text => {
              setappName(text);
              setShowSuggestions(true);
            }}
            right={
              <TextInput.Icon
                icon={require('../../icons/search.png')}
              />
            }
          />
        </View>
        {showSuggestions && (
          <View style={styles.suggestionsWrapper}>
            <FlatList
              data={filteredStats}
              keyExtractor={(item) => item.name.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelect(item.name)}>
                  <Text style={styles.suggestionItem}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>

      {/* {isDropdownVisible && (
        <MultipleSelectList
          inputStyles={{ color: 'black' }}
          dropdownTextStyles={{ color: 'black' }}
          labelStyles={{ color: 'black' }}
          setSelected={val => setSelectedNames(val)} // Update selected names array
          data={data}
          save="value"
          label="App Name"
          search={false}
          placeholder="Select Apps"
        />

      )} */}
      {(permissionAccess == 'granted') ? (
        <HourlyUsageBarChart hourlyUsageData={hourlyUsageData} />
      ) : ''}

      <View style={{ margin: 15 }}>
        {(permissionAccess == 'denied') ? (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ color: 'black', width: width * 75 }}>Click This Button to get Acccess the Usage Stats Of your Mobile</Text>
            <TouchableOpacity style={{ marginLeft: 'auto', backgroundColor: '#438f7f', padding: 7, borderRadius: 50 }} onPress={() => getPermission()}>
              <Image
                style={{ width: 25, height: 25 }}
                source={require('../.././icons/permission.png')}
              />
              {/* <Ionicons name="share" size={20} color="white" /> */}
            </TouchableOpacity>
          </View>
        ) : ''}


        <View style={{flexDirection : 'row'}}>
          <Text style={{ fontSize: 20, fontWeight: '900', textAlign: 'center', color: 'black' }}>Total Usage:</Text>
          <Text style={{ fontSize: 20, fontWeight: '900', marginLeft: 'auto', color: '#438f7f' }}>{getTotalUsageTime()}</Text>
        </View>
      </View>
      <View>{getStatsComponents()}</View>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 8, borderRadius: 50, justifyContent: 'center', position: 'absolute', bottom: 5, left: 0, right: 0 }}>
        <TouchableOpacity onPress={handlePrevious} style={{ padding: 5, marginHorizontal: 20, backgroundColor: 'black', borderRadius: 50 }}>
          <Ionicons name="caret-back-circle-outline" size={25} color="white" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '900', color: '#438f7f' }}>{moment(fromDate).format('YYYY, MMMM DD')}</Text>
        <TouchableOpacity onPress={handleNext} style={{ padding: 5, marginHorizontal: 20, backgroundColor: 'black', borderRadius: 50 }} disabled={moment(fromDate).isSameOrAfter(moment(), 'day')}>
          <Ionicons name="caret-forward-circle-outline" size={25} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

