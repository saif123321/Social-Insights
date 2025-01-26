/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import BackgroundFetch from 'react-native-background-fetch';
import { NativeModules } from 'react-native';
const UsageStats = NativeModules.UsageStats;
import { useSelector, useDispatch } from 'react-redux';
import { PostAnalyticsData } from './src/redux/actions/authActions';
import { GetGroups } from './src/helperFunction/postRequest';
import { getToken, getDispatch, getDateInfo, getLogsInfo } from './src/redux/store/reduxStore';
import NetInfo from '@react-native-community/netinfo';
import * as types from './src/redux/types';

const parseStats = (unparsed) => {
    const [appsName, Usagestats, packageNames, Appicons, appOpenCounts, hourlyStats] = unparsed.split(';');
    const times = Usagestats.split(',').map(val => parseInt(val));
    const apps = appsName.split(',').map(name => name.split('.').pop());
    const packages = packageNames.split(',');
    // const icons = Appicons.split(',');
    const session_count = appOpenCounts.split(',');
    const hourlyUsageArray = hourlyStats.split(',');

    const hourlyUsageData = hourlyUsageArray.map(entry => {
        const [hour, packageName, usageTime] = entry.split('-');
        return { hour, packageName, usageTime: Number(usageTime) };
    });
    console.log('Hourly Usage Data:', hourlyUsageData);
    const stats = [];
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
    return [stats, hourlyUsageData];
};

const GetGroupData = async (token) => {
    try {
        const response = await GetGroups(token);
        return response;
    } catch (error) {
        console.error('Error fetching groups data:', error);
        const logObject = {
            date: new Date().toISOString(),
            time: new Date().toLocaleTimeString(),
            status: "failed",
            message: error.message,
        };
        const dispatch = getDispatch();
        const logsData = getLogsInfo() ?? [];
        const newLogsData = [...logsData, logObject];
        console.log(newLogsData);

        dispatch({ type: types.LOGS, payload: newLogsData });
        throw error;
    }
};

const checkDataHitServer = async (token, dispatch, date_info) => {
    console.log("checkDataHitServer called");
    try {
        console.log("date info ", date_info);
        const date_now = new Date();
        const yesterday_date = new Date(date_now);
        yesterday_date.setDate(yesterday_date.getDate());
        const start_date = new Date(yesterday_date.getFullYear(), yesterday_date.getMonth(), yesterday_date.getDate());
        const from_date = String(start_date.toISOString().slice(0, 10));
        const to_date = String(start_date.toISOString().slice(0, 10));
        console.log(start_date, "start_date");
        dispatch({ type: types.UPDATES_DATES, payload: [start_date.toISOString().slice(0, 10)] });
        if (date_info == undefined || !date_info.includes(start_date.toISOString().slice(0, 10))) {
            let filter_data = [];
            let hourly_data = [];
            const stats = await new Promise((resolve, reject) => {
                UsageStats.getStats(from_date, to_date, (message) => {
                    const stats = parseStats(message);
                    hourly_data = stats[1];
                    resolve(stats[0]);
                });
            });
            filter_data = stats.filter(
                stat => stat.time > 60000
            );
            const response = await dispatch(PostAnalyticsData(token, start_date, filter_data , hourly_data));
            console.log('Analytics data sent.');
            const logObject = {
                date: new Date().toISOString(),
                time: new Date().toLocaleTimeString(),
                status: "success",
                message: 'Api Hit',
                api_hit_date: start_date
            };
            const logsData = getLogsInfo() ?? [];
            const newLogsData = [...logsData, logObject];
            console.log(newLogsData);
            dispatch({ type: types.LOGS, payload: newLogsData });

        } else {
            console.log('Analytics data already sent of yesterday.');
        }
    } catch (error) {
        const logObject = {
            date: new Date().toISOString(),
            time: new Date().toLocaleTimeString(),
            status: "failed",
            message: error.message,
        };
        const logsData = getLogsInfo() ?? [];
        const newLogsData = [...logsData, logObject]; // Create a new array with the existing logs and the new log
        console.log(newLogsData);

        dispatch({ type: types.LOGS, payload: newLogsData });
        console.error('Error checking data on server:', error);
    }
};

const rescheduleBackgroundSync = () => {
    BackgroundFetch.scheduleTask({
        taskId: 'com.digitalwellbing.sync',
        delay: 10000, // 5 minutes
        enableHeadless: true,
        periodic: false,
        forceAlarmManager: true,
        stopOnTerminate: false,
        startOnBoot: true,
        requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
    });
};

MyHeadlessTask = async (event) => {
    let taskId = event.taskId;
    console.log('[BackgroundFetch HeadlessTask] start: ', taskId);
    const handleConnectivityChange = async (state) => {
        console.log("handleConnectivityChange", state);
        if (state.isConnected) {
            const dispatch = getDispatch();
            try {
                const token = getToken();
                const date_info = getDateInfo();
                const group_data = await GetGroupData(token);
                if (token && group_data.groups.length) {
                    await checkDataHitServer(token, dispatch, date_info);
                    const logObject = {
                        date: new Date().toISOString(),
                        time: new Date().toLocaleTimeString(),
                        status: "success",
                        message: 'Service Call'
                    };
                    const logsData = getLogsInfo() ?? [];
                    const newLogsData = [...logsData, logObject];
                    console.log(newLogsData);

                    dispatch({ type: types.LOGS, payload: newLogsData });
                }
                console.log('[BackgroundFetch HeadlessTask] Data sent to server successfully.');
            } catch (error) {
                const logObject = {
                    date: new Date().toISOString(),
                    time: new Date().toLocaleTimeString(),
                    status: "failed",
                    message: error.message,
                    detailedMessage: JSON.stringify(error), // Detailed error message
                };
                const logsData = getLogsInfo() ?? [];
                const newLogsData = [...logsData, logObject]; // Create a new array with the existing logs and the new log
                console.log(newLogsData);

                dispatch({ type: types.LOGS, payload: newLogsData });
                console.error('[BackgroundFetch HeadlessTask] Error sending data to server:', error);
            } finally {
                BackgroundFetch.finish(taskId);
                unsubscribe();
            }
        } else {
            console.log("Internet Not connected, rescheduling task.");
            rescheduleBackgroundSync();
            BackgroundFetch.finish(taskId);
        }
    };

    const unsubscribe = NetInfo.addEventListener(handleConnectivityChange);
    const netState = await NetInfo.fetch();
    await handleConnectivityChange(netState);
};

BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

AppRegistry.registerComponent(appName, () => App);
