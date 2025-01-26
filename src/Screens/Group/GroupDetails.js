import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, StyleSheet, Share, Clipboard } from 'react-native';
import { height, width } from '../../../App';
import { styles } from '../Login/style';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useToast } from "react-native-toast-notifications";
import { DeleteGroupMemberApi, AnalyticsDateApi, ShareConsentApi } from '../../helperFunction/postRequest';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { DarkTheme, useNavigation } from '@react-navigation/native';
import { Divider, ProgressBar, TextInput } from 'react-native-paper';
import _ from 'lodash';
import { NativeModules } from 'react-native';
const UsageStats = NativeModules.UsageStats;
export const GroupDetails = ({ route }) => {
    const toast = useToast();
    const login_user = useSelector(state => state.authReducer.auth);
    const [groupID, setgroupID] = useState(0);
    const [analyticsData, setAnalyticsData] = useState([]);
    const [memberID, setmemberID] = useState(0);
    const [DeletemodalVisible, setDeletemodalVisible] = useState(false);
    const [ExitmodalVisible, setExitmodalVisible] = useState(false);
    const [isLoadingDelete, setisLoadingDelete] = useState(false);
    const [isLoading, setisLoading] = useState(true);
    const token = useSelector(state => state.authReducer.token);
    const navigation = useNavigation();
    const [appName, setappName] = useState('');
    const [showConsent, setShowConsent] = useState(false);
    const [isLoadingAdd, setIsLoadingAdd] = useState(false);
    const [filterDate, setFilterDate] = useState(() => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return yesterday.toISOString().slice(0, 10);
    });

    const [isLoadingData, setisLoadingData] = useState(false);
    const [sortData, setsortData] = useState('asc');
    const [pageData, setPageData] = useState([]);
    const [lastLogData, setLastLogData] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            GetAnalyticsData();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        GetAnalyticsData();
    }, [filterDate]);


    useEffect(() => {
        const filteredMembers = analyticsData.filter(member => {
            return member.user_info.name.toLowerCase().includes(appName.toLowerCase());
        });
        setPageData(filteredMembers);
    }, [appName]);

    const GetAnalyticsData = async () => {
        setisLoadingData(false);
        try {
            const response = await AnalyticsDateApi(token, route.params.selectedGroup._id, filterDate);
            console.log("Analytics Data : ", response);
            setAnalyticsData(response.group_members);
            setLastLogData(response.log_data);

            setPageData(response.group_members);
            setisLoadingData(true);
        } catch (error) {
            console.error('Error fetching groups data:', error);
        }
    }

    const formatDate = (dateString) => {
        const formattedDate = moment(dateString).format('YYYY MMMM, DD hh:mm A');
        return formattedDate;
    };
    const copyToClipboard = (text) => {
        Clipboard.setString(text);
        toast.show("Success! Invitation Key is Copied on Clipboard..", {
            type: "success",
            placement: "top",
            duration: 4000,
            offset: 30,
            animationType: "slide-in",
        });
    };

    const ModalGroupMembersDelete = (user_delete_id) => {
        setgroupID(route.params.selectedGroup._id);
        setmemberID(user_delete_id);
        setDeletemodalVisible(!DeletemodalVisible);
    }

    const ModalGroupExit = () => {
        setgroupID(route.params.selectedGroup._id);
        setExitmodalVisible(!ExitmodalVisible);
    }

    const DeleteGroupMember = async () => {
        // console.log("wokring");
        setisLoadingDelete(true);
        const response = await DeleteGroupMemberApi(token, groupID, memberID);
        if (response.errorr == 1) {
        } else {
            setgroupMembers(response.group_members);
            toast.show("Success! Group Member Has been Deleted..", {
                type: "success",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
            });
            setisLoadingDelete(false);
            setDeletemodalVisible(false);

            // console.log("response : ", response);
        }
    }

    const ExitGroupMember = async () => {
        // console.log("wokring");
        setisLoadingDelete(true);
        const response = await DeleteGroupMemberApi(token, groupID, login_user._id);
        if (response.errorr == 1) {
        } else {
            toast.show("Success! Group Has been Exited..", {
                type: "success",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
            });
            setisLoadingDelete(false);
            setDeletemodalVisible(false);
            navigation.navigate('GroupScreen');
            // console.log("response : ", response);
        }
    }

    const analytics_data = (user_analytics) => {
        let data = user_analytics[0] ?? {};
        // console.log("user_analytics data:", data);        
        if (data.analytics_data) {
            const analyticsDataArray = JSON.parse(data.analytics_data);
            const entryTotalTime = analyticsDataArray.reduce((sum, analytics) => {
                return sum + analytics.time;
            }, 0);
            const totalMilliseconds = 1 * 24 * 60 * 60 * 1000; // 1 day in milliseconds
            const progressBarValue = entryTotalTime / totalMilliseconds;
            return [progressBarValue, entryTotalTime];
        } else {
            return [0, 0];
        }

    };

    const formatTime = (milliseconds) => {
        const hours = Math.floor(milliseconds / (1000 * 60 * 60));
        const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours}h : ${minutes}m`;
    };

    const GroupuserDetails = (user_id, name) => {
        navigation.navigate("GroupUserDetails", { user_id: user_id, user_name: name, filter_date: filterDate, distracting_apps : route.params.selectedGroup.distracting_apps })
    }

    const LastLogData = (user_id) => {
        const last_log_data = lastLogData.filter(member => {
            return member.user_id == user_id;
        });
        // console.log(last_log_data , "last_log_dtaa");
        return (last_log_data.length) ? formatDate(last_log_data[0].created_at) : 'N/A';
    }

    const badgeSelection = (user_analytics) => {
        const data = user_analytics[0]?.analytics_data;
        if (data) {
            const analyticsDataArray = JSON.parse(data);
            const distractingApps = route.params.selectedGroup.distracting_apps ? JSON.parse(route.params.selectedGroup.distracting_apps) : {};
            return analyticsDataArray
                .filter(app => distractingApps.hasOwnProperty(app.name))
                .reduce((count, app) => {
                    const time_in_mins = (app.time / 60000).toFixed(0);
                    return count + (time_in_mins > distractingApps[app.name] ? 1 : 0);
                }, 0);
        } else {
            return 0;
        }
    };

    const GroupMembersItem = React.memo(({ member_info, user_analytics, created_at }) => (
        console.log("JSON.parse(route.params.selectedGroup.distracting_apps)" , JSON.parse(route.params.selectedGroup.distracting_apps)),
        <TouchableOpacity style={styles.chapterWrapperInfo} onPress={() => GroupuserDetails(member_info._id, member_info.name)}>
            <Text style={styles.courseChapterNO}>{member_info.name[0]}</Text>
            <View style={{ marginHorizontal: 10, width: width * 60 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={styles.courseChaptername}>{member_info.name}</Text>
                            
                            {(user_analytics[0]?.analytics_data && Object.keys(JSON.parse(route.params.selectedGroup.distracting_apps)).length) ? (
                                (badgeSelection(user_analytics) == 0) ? (
                                    <View style={{ padding: 6, backgroundColor: 'green', margin: 5, borderRadius: 50 }}>
                                    </View>
                                ) : (
                                    (badgeSelection(user_analytics) == 1) ? (
                                        <View style={{ padding: 6, backgroundColor: 'orange', margin: 5, borderRadius: 50 }}>
                                        </View>
                                    ) : (
                                        <View style={{ padding: 6, backgroundColor: 'red', margin: 5, borderRadius: 50 }}>
                                        </View>
                                    )
                                )
                            ) :
                                ''}

                        </View>
                        {/* <Text style={{ fontSize: 10 }}>{group_members} Members</Text> */}
                        {/* <Text style={{ fontSize: 10, color: 'black' }}>Joined At : {formatDate(created_at)}</Text> */}
                        <Text style={{ fontSize: 10, color: 'black' }}>Last Hit : {LastLogData(member_info._id)}</Text>
                        {(route.params.selectedGroup.user_id == member_info._id) ? (
                            <>
                                <Text style={{ fontSize: 10, fontWeight: '900', color: 'black' }}>Group Admin</Text>
                            </>
                        ) : (
                            ''
                        )}
                    </View>
                    <Text style={{ marginLeft: 'auto', color: 'black', fontWeight: '900' }}>{formatTime(analytics_data(user_analytics)[1])}</Text>

                </View>
                {(!isLoading) ?
                    (
                        <View>
                            {(analytics_data(member_info._id)[0] !== 0) ? (
                                <View>
                                    <ProgressBar
                                        animatedValue={analytics_data(member_info._id)[0]}
                                        progress={analytics_data(member_info.user_id)[0]}
                                        style={styles.progressBar}
                                        color='green'
                                    />
                                    {/* <Text style={{ marginLeft: 'auto', color: 'black', fontWeight: '900' }}>{formatTime(analytics_data(member_info._id)[1])}</Text> */}

                                </View>
                            ) :
                                (
                                    <Text style={{ textAlign: 'center', color: 'black', fontWeight: '900' }}>No Data Found!</Text>
                                )}
                        </View>
                    )
                    :
                    ''}
            </View>
            {/* <TouchableOpacity style={{ marginLeft: 'auto' }} >
                <Ionicons name="chevron-forward" size={20} color="black" />
            </TouchableOpacity> */}
            {(route.params.selectedGroup.user_id == login_user._id && member_info._id !== login_user._id) ? (
                <>
                    <TouchableOpacity onPress={() => ModalGroupMembersDelete(member_info._id)}>
                        <Ionicons name="trash-bin" size={20} color="black" />
                    </TouchableOpacity>
                </>
            ) : (
                ''
            )}
        </TouchableOpacity>
    ));

    const getTotalUsageTime = () => {
        const userIds = pageData.map(member => member.user_id);
        const filteredAnalyticsData = pageData.filter(entry => userIds.includes(entry.user_id));
        const totalMilliseconds = filteredAnalyticsData.reduce((sum, entry) => {
            return sum + entry.user_analytics.reduce((entrySum, analytics) => {
                return entrySum + JSON.parse(analytics.analytics_data).reduce((analyticsSum, data) => {
                    return analyticsSum + data.time;
                }, 0);
            }, 0);
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


    const getStats = () => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const fromDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const toDate = new Date(fromDate.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
        const from_date = String(toDate.toISOString().slice(0, 10));
        const to_date = String(toDate.toISOString().slice(0, 10));
        console.log("Date :");
        console.log(from_date, to_date);
        return new Promise((resolve, reject) => {
            UsageStats.getStats(from_date, to_date, (message) => {
                const stats = parseStats(message);
                const hourly_data = stats[1];
                const filter_data = stats[0].filter(
                    stat => stat.time > 60000
                );
                resolve([filter_data, hourly_data]);
            });
        });
    };
    const LoginUserConsentExist = () => {
        const userAnalyticsEntry = pageData.find(entry => entry.user_id === login_user._id);
        console.log(userAnalyticsEntry);
        if (userAnalyticsEntry.sharing_consent == 1) {
            return true;
        } else {
            return false;
        }
    }
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
    const ConsentSubmit = async (sharing_consent) => {
        if (sharing_consent == 1) {
            setIsLoadingAdd(true);
            try {
                const analytic_data = await getStats();
                const date = new Date();
                const response = await ShareConsentApi(token, route.params.selectedGroup._id, date, analytic_data);
                if (response.error == 1) {
                    setIsLoadingAdd(false);
                    setInvitationKey('');
                    setShowMessageJoinInvalid(response.errors.error);
                } else {
                    GetAnalyticsData();
                    console.log("share consent api : ", response)
                    toast.show("Success! Data  has been Shared to this group from today..", {
                        type: "success",
                        placement: "top",
                        duration: 4000,
                        offset: 30,
                        animationType: "slide-in",
                    });
                    setIsLoadingAdd(false);
                    setShowConsent(false);
                }

            } catch (error) {
                setIsLoadingAdd(false);
                console.error("Error fetching analytics data:", error);
            }
        }

    };
    const distractedApps = () => {
        navigation.navigate("DistractedApps", { group_data: route.params.selectedGroup })
    }
    const FilterData = () => {
        const updatedPageData = pageData.map(entry => {
            let totalUsageMilliseconds = 0;
            if (entry.user_analytics.length > 0) {
                const analyticsDataArray = JSON.parse(entry.user_analytics[0].analytics_data);
                totalUsageMilliseconds = analyticsDataArray.reduce((sum, analytics) => sum + analytics.time, 0);
            }
            return { ...entry, totalUsageMilliseconds };
        });

        const sortedPageData = updatedPageData.sort((a, b) => {
            if (sortData === 'asc') {
                return a.totalUsageMilliseconds - b.totalUsageMilliseconds;
            } else {
                return b.totalUsageMilliseconds - a.totalUsageMilliseconds;
            }
        });
        setPageData(sortedPageData);
        setsortData(sortData === 'asc' ? 'dsc' : 'asc');
        // console.log("Pagedata sort filter: ", sortedPageData);
    };

    return (
        <View style={styles.container}>
            <View >

                {/* <TouchableOpacity style={{ backgroundColor: 'black', padding: 10, borderRadius: 50 }}>
                    <Ionicons name="menu" size={20} color="white" />
                </TouchableOpacity> */}
                {/* <View> */}
                <TextInput
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    underlineColorAndroid="transparent"
                    style={styles.searchInput}
                    value={appName}
                    placeholder="Search Memebrs"
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
                {/* </View> */}
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={styles.welcome}>{route.params.selectedGroup.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
                    <TouchableOpacity onPress={() => FilterData()} style={{ backgroundColor: '#438f7f', padding: 10, marginLeft: 'auto', borderRadius: 50 }}>
                        {(sortData == 'asc') ? (
                            <FontAwesome name="sort-amount-asc" size={15} color="white" />
                        ) : (
                            <FontAwesome name="sort-amount-desc" size={15} color="white" />
                        )}
                    </TouchableOpacity>
                    {(route.params.selectedGroup.user_id == login_user._id) ? (
                        <>
                            <TouchableOpacity onPress={() => distractedApps()} style={{ backgroundColor: '#438f7f', padding: 10, marginLeft: 5, borderRadius: 50 }}>
                                <FontAwesome name="ban" size={15} color="white" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        ''
                    )}

                    {(!isLoading) ? (
                        (!LoginUserConsentExist()) ? (
                            <TouchableOpacity style={{ marginLeft: 5, backgroundColor: '#438f7f', padding: 7, borderRadius: 50 }} onPress={() => setShowConsent(true)}>
                                <Ionicons name="share" size={20} color="white" />
                            </TouchableOpacity>
                        ) :
                            (
                                ''
                            )
                    ) : ''}
                    {/* {(route.params.selectedGroup.user_id !== login_user._id) ? (
                        <>
                            <TouchableOpacity style={{ marginLeft: 5, backgroundColor: '#438f7f', padding: 7, borderRadius: 50 }} onPress={() => ModalGroupExit()}>
                                <Ionicons name="exit" size={20} color="white" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        ''
                    )} */}

                </View>

            </View>

            {(isLoadingData) ? (
                <View>
                    <View>
                        <Text style={{ fontSize: 25, fontWeight: '900', textAlign: 'center', color: 'black' }}>Total Usage</Text>
                        <Text style={{ fontSize: 20, fontWeight: '900', textAlign: 'center', color: '#438f7f' }}>{getTotalUsageTime()}</Text>

                    </View>

                    <FlatList
                        data={pageData}
                        contentContainerStyle={{ paddingBottom: 20, justifyContent: 'center' }}
                        numColumns={1}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <GroupMembersItem
                                member_info={item.user_info}
                                user_analytics={item.user_analytics}
                                created_at={item.created_at}
                            />
                        )}
                        style={{ height: '60%' }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            ) : (
                <View>
                    <ActivityIndicator size="medium" color="black" />
                </View>
            )}


            <>
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 8, borderRadius: 50, justifyContent: 'center', position: 'absolute', bottom: 5, left: 0, right: 0 }}>
                    <TouchableOpacity onPress={handlePreviousDate} style={{ padding: 5, marginHorizontal: 20, backgroundColor: 'black', borderRadius: 50 }}>
                        <Ionicons name="caret-back-circle-outline" size={25} color="white" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: '900', color: '#438f7f' }}>{moment(filterDate).format('YYYY, MMMM DD')}</Text>
                    <TouchableOpacity onPress={handleNextDate} style={{ padding: 5, marginHorizontal: 20, backgroundColor: 'black', borderRadius: 50 }} disabled={moment(filterDate).isSameOrAfter(moment(), 'day')}>
                        <Ionicons name="caret-forward-circle-outline" size={25} color="white" />
                    </TouchableOpacity>
                </View>
            </>

            <Modal
                animationType="slide"
                transparent={true}
                visible={DeletemodalVisible}>
                <View style={stylesModal.centeredView}>
                    <View style={stylesModal.modalView}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: '900', color: 'black', fontSize: 18 }}>Delete Group Member</Text>
                            <TouchableOpacity
                                onPress={() => setDeletemodalVisible(false)}
                                style={{ marginLeft: 'auto' }}
                            >
                                <Entypo name="circle-with-cross" size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontWeight: '900', color: 'black', fontSize: 20, textAlign: 'center', padding: 20 }}>Are You sure you want to delete this group members?</Text>

                        <View style={{ flexDirection: 'row', width: 'auto', justifyContent: 'center' }}>
                            <TouchableOpacity style={styles.createBtnAdd} onPress={DeleteGroupMember}>
                                {isLoadingDelete ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.Buttontext}>YES</Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.createBtnAdd, { marginLeft: 10 }]} onPress={() => setDeletemodalVisible(false)}>
                                <Text style={styles.Buttontext}>NO</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={ExitmodalVisible}>
                <View style={stylesModal.centeredView}>
                    <View style={stylesModal.modalView}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: '900', color: 'black', fontSize: 18 }}>Exit Group</Text>
                            <TouchableOpacity
                                onPress={() => setExitmodalVisible(false)}
                                style={{ marginLeft: 'auto' }}
                            >
                                <Entypo name="circle-with-cross" size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontWeight: '900', color: 'black', fontSize: 20, textAlign: 'center', padding: 20 }}>Are You sure you want to Exit this group?</Text>

                        <View style={{ flexDirection: 'row', width: 'auto', justifyContent: 'center' }}>
                            <TouchableOpacity style={styles.createBtnAdd} onPress={ExitGroupMember}>
                                {isLoadingDelete ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.Buttontext}>YES</Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.createBtnAdd, { marginLeft: 10 }]} onPress={() => setExitmodalVisible(false)}>
                                <Text style={styles.Buttontext}>NO</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={showConsent}>
                <View style={stylesModal.centeredView}>
                    <View style={stylesModal.modalView}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: '900', color: 'black', fontSize: 18 }}>Consent</Text>
                            <TouchableOpacity
                                onPress={() => setShowConsent(false)}
                                style={{ marginLeft: 'auto' }}
                            >
                                <Entypo name="circle-with-cross" size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontWeight: '900', color: 'black', fontSize: 20, textAlign: 'center', padding: 20 }}>Do you want to Share your Analytics to this group?</Text>

                        <View style={{ flexDirection: 'row', width: 'auto', justifyContent: 'center' }}>
                            {isLoadingAdd ? (
                                <ActivityIndicator size="small" color="#438f7f" />
                            ) : (
                                <>
                                    <TouchableOpacity style={styles.createBtnAdd} onPress={() => ConsentSubmit(1)}>
                                        <Text style={styles.Buttontext}>YES</Text>

                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.createBtnAdd, { marginLeft: 10 }]} onPress={() => ConsentSubmit(0)} >
                                        <Text style={styles.Buttontext}>NO</Text>
                                    </TouchableOpacity>
                                </>
                            )}

                        </View>
                    </View>
                </View>
            </Modal>
        </View >

    );
};
const stylesModal = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
    },
    modalView: {
        width: width * 90,
        backgroundColor: 'white',
        alignSelf: 'center',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
});