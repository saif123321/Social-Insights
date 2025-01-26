// Dashboard.js (or Dashboard.tsx)
import React, { Component, useState, useEffect } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Dimensions,
    FlatList, Image, ActivityIndicator,
    TouchableOpacity
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
import { useSelector } from 'react-redux';
import { AnalyticsUserDateApi } from '../../helperFunction/postRequest';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HourlyUsageBarChart from '../Dashboard/HourlyUsageBarChart';

export const GroupUserDetails = ({ route }) => {
    const [selectedNames, setSelectedNames] = useState([]);
    const [filteredStats, setFilteredStats] = useState([]);
    const [appName, setappName] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [filterDate, setFilterDate] = useState(route.params.filter_date);
    const [analyticsData, setAnalyticsData] = useState([]);
    const token = useSelector(state => state.authReducer.token);
    const [isLoadingData, setisLoadingData] = useState(false);
    const [durationInDays, setDurationInDays] = useState(1);
    const [filteredAnalyticsData, setFilteredAnalyticsData] = useState([]);
    const [sortData, setsortData] = useState('asc');
    const [hourlyUsageData, sethourlyUsageData] = useState([]);

    useEffect(() => {
        UserAnalytics();
    }, [filterDate]);

    const UserAnalytics = async () => {
        setisLoadingData(false);
        try {
            const response = await AnalyticsUserDateApi(token, filterDate, route.params.user_id);
            console.log("individual_analytics Data : ", response);
            if (response.individual_analytics.user_analytics.length) {
                setAnalyticsData(JSON.parse(response.individual_analytics.user_analytics[0].analytics_data));
                setFilteredAnalyticsData(JSON.parse(response.individual_analytics.user_analytics[0].analytics_data));
                sethourlyUsageData(response.individual_analytics.user_analytics[0].hourly_data ?
                    JSON.parse(response.individual_analytics.user_analytics[0].hourly_data)
                    : [])
            } else {
                setAnalyticsData([]);
                setFilteredAnalyticsData([]);
                sethourlyUsageData([]);
            }
            setisLoadingData(true);

        } catch (error) {
            console.error('Error fetching groups data:', error);
        }
    }

    useEffect(() => {
        const filteredData = analyticsData.filter(dt => {
            return dt.name.toLowerCase().includes(appName.toLowerCase());
        });
        setFilteredAnalyticsData(filteredData);
    }, [appName]);

    const formatTime = (milliseconds) => {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h : ${minutes}m`;
    };
    const handlePreviousDate = () => {
        const previousDate = new Date(filterDate);
        previousDate.setDate(previousDate.getDate() - 1);
        setFilterDate(new Date(previousDate).toISOString().slice(0, 10));
    };

    const handleNextDate = () => {
        const nextDate = new Date(filterDate);
        nextDate.setDate(nextDate.getDate() + 1);
        setFilterDate(new Date(nextDate).toISOString().slice(0, 10));
    };

    const getAppicon = (package_name) => {
        return new Promise((resolve, reject) => {
            UsageStats.getAppIcon(package_name, (message) => {
                resolve(message);
            });
        });
    };

    const AppItem = React.memo(({ app_name, app_usage, app_icon, app_packge_name, session_count }) => {
        const [iconUri, setIconUri] = useState(`data:image/png;base64,${app_icon}`);

        useEffect(() => {
            const fetchAppIcon = async () => {
                if (!app_icon) {
                    try {
                        const fetchedIcon = await getAppicon(app_packge_name);
                        setIconUri(`data:image/png;base64,${fetchedIcon}`);
                    } catch (error) {
                        console.error('Error fetching app icon:', error);
                    }
                }
            };

            fetchAppIcon();

            // Cleanup function for useEffect
            return () => {
                // Any cleanup code if needed
            };
        }, [app_icon, app_packge_name]);

        const totalMilliseconds = durationInDays * 24 * 60 * 60 * 1000;
        const progressBarValue = app_usage / totalMilliseconds;

        const badgeSelection = (app_name, app_usage) => {
            const distractingApps = JSON.parse(route.params.distracting_apps);
            if (distractingApps.hasOwnProperty(app_name)) {
                let time_in_mins = (app_usage/60000).toFixed(0);
                console.log("time_in_mins : " , time_in_mins);
                console.log("distractingApps[app_name] : " , distractingApps[app_name]);
                if(time_in_mins > distractingApps[app_name]){
                    return 1;
                } else{
                    return 0;
                }
            } else {
                return;
            }
        };


        return (
            <View style={{ padding: 10 }}>
                <View style={styles.usageWrapper}>
                    {/* Display the app icon */}
                    {iconUri && <Image source={{ uri: iconUri }} style={{ width: 30, height: 30 }} />}
                    <View style={{ marginHorizontal: 10, width: width * 50 }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.courseChaptername}>{app_name}</Text>
                            {(filteredAnalyticsData.length && route.params.distracting_apps) ? (
                                (badgeSelection(app_name , app_usage) == 0) ? (
                                    <View style={{ padding: 6, backgroundColor: 'green', margin: 5, borderRadius: 50 }}>
                                    </View>
                                ) : (
                                    (badgeSelection(app_name , app_usage) == 1) ? (
                                        <View style={{ padding: 6, backgroundColor: 'red', margin: 5, borderRadius: 50 }}>
                                        </View>
                                    ) : (
                                        ''
                                    )
                                )
                            ) :
                                ('')}

                        </View>
                        {(session_count) ? (
                            <Text style={{ fontSize: 10, color: 'black' }}>Sessions: {session_count}  </Text>
                        ) : ''}
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
        return (
            (filteredAnalyticsData.length) ? (
                <FlatList
                    data={filteredAnalyticsData}
                    // contentContainerStyle={{ justifyContent: 'center' }}
                    numColumns={1}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => (
                        <AppItem
                            index={index}
                            app_name={item.name}
                            app_usage={item.time}
                            app_icon={item.icon}
                            app_packge_name={item.package_name}
                            session_count={item.session_count}
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

    const handleMenuClick = () => {
        setIsDropdownVisible(false);
    };

    const getTotalUsageTime = () => {
        const totalMilliseconds = analyticsData.reduce((sum, entry) => {
            return sum + entry.time;
        }, 0);
        if (isNaN(totalMilliseconds)) {
            return '0h 0m 0s';
        }
        const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((totalMilliseconds % (1000 * 60)) / 1000);
        const formattedTime = `${hours}hr ${minutes}m ${seconds}s`;
        return formattedTime;
    };

    const FilterData = () => {


        const sortedPageData = filteredAnalyticsData.sort((a, b) => {
            if (sortData === 'asc') {
                return a.time - b.time;
            } else {
                return b.time - a.time;
            }
        });
        setFilteredAnalyticsData(sortedPageData);
        setsortData(sortData === 'asc' ? 'dsc' : 'asc');
    };

    return (
        <View style={styles.container}>
            {/* <View>
        <Text style={styles.welcome}>Analytics</Text>
      </View> */}
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
                    onChangeText={text => setappName(text)}
                    right={
                        <TextInput.Icon
                            icon={require('../../icons/search.png')}
                        />
                    }
                />
            </View>

            {isDropdownVisible && (
                <MultipleSelectList
                    inputStyles={{ color: 'black' }}
                    dropdownTextStyles={{ color: 'black' }}
                    labelStyles={{ color: 'black' }}
                    setSelected={val => setSelectedNames(val)}
                    data={data}
                    save="value"
                    label="App Name"
                    search={false}
                    placeholder="Select Apps"
                />

            )}
            <View >
                <Text style={{ fontSize: 32, fontWeight: '900', textAlign: 'center', color: 'black' }}>{route.params.user_name}</Text>
                <HourlyUsageBarChart hourlyUsageData={hourlyUsageData} />
                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: '900', textAlign: 'center', color: 'black' }}>Total Usage:</Text>
                    <Text style={{ fontSize: 20, fontWeight: '900', marginLeft: 5, color: '#438f7f' }}>{getTotalUsageTime()}</Text>
                    <TouchableOpacity onPress={() => FilterData()} style={{ backgroundColor: '#438f7f', padding: 10, marginLeft: 'auto', borderRadius: 50 }}>
                        {(sortData == 'asc') ? (
                            <FontAwesome name="sort-amount-asc" size={15} color="white" />
                        ) : (
                            <FontAwesome name="sort-amount-desc" size={15} color="white" />
                        )}
                    </TouchableOpacity>
                </View>

            </View>
            {(isLoadingData) ? (
                <View>{getStatsComponents()}</View>
            ) : (
                <ActivityIndicator size="medium" color="black" />
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 8, borderRadius: 50, justifyContent: 'center', position: 'absolute', bottom: 5, left: 0, right: 0 }}>
                <TouchableOpacity onPress={handlePreviousDate} style={{ padding: 5, marginHorizontal: 20, backgroundColor: 'black', borderRadius: 50 }}>
                    <Ionicons name="caret-back-circle-outline" size={25} color="white" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: '900', color: '#438f7f' }}>{moment(filterDate).format('YYYY, MMMM DD')}</Text>
                <TouchableOpacity onPress={handleNextDate} style={{ padding: 5, marginHorizontal: 20, backgroundColor: 'black', borderRadius: 50 }} disabled={moment(filterDate).isSameOrAfter(moment(), 'day')}>
                    <Ionicons name="caret-forward-circle-outline" size={25} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

