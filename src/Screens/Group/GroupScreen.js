import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Modal, StyleSheet, Share } from 'react-native';
import { height, width } from '../../../App';
import { styles } from '../Login/style';
import Entypo from 'react-native-vector-icons/Entypo';
import { TextInput } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useToast } from "react-native-toast-notifications";
import { CreateGroup, DeleteGroupApi, EditGroupApi, GetGroups, JoinGroupMembers, AnalyticApi, DeleteGroupMemberApi } from '../../helperFunction/postRequest';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';

import { NativeModules } from 'react-native';
const UsageStats = NativeModules.UsageStats;

export const GroupScreen = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [JoinmodalVisible, setJoinModalVisible] = useState(false);
    const [EditmodalVisible, setEditmodalVisible] = useState(false);
    const [DeletemodalVisible, setDeletemodalVisible] = useState(false);
    const [groupName, setgroupName] = useState('');
    const [groupType, setgroupType] = useState('');
    const [groupID, setgroupID] = useState(0);
    const [InvitationKey, setInvitationKey] = useState('');
    const [isLoadingJoin, setIsLoadingJoin] = useState(false);
    const [isLoadingAdd, setIsLoadingAdd] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [ShowMessage, setShowMessage] = useState(false);
    const [ShowMessageJoin, setShowMessageJoin] = useState(false);
    const [ShowMessageJoinInvalid, setShowMessageJoinInvalid] = useState('');
    const toast = useToast();
    const token = useSelector(state => state.authReducer.token);
    const login_user = useSelector(state => state.authReducer.auth);
    const [pageData, setPageData] = useState([]);
    const navigation = useNavigation();
    const [showConsent, setShowConsent] = useState(false);
    const [permissionAccess, setPermissionAccess] = useState('');
    const [ExitmodalVisible, setExitmodalVisible] = useState(false);
    const [isLoadingDelete, setisLoadingDelete] = useState(false);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            UsageStats.requestUsageAccessPermission(
                () => {
                    setPermissionAccess('denied');
                    console.log('denied');
                },
                () => {
                    setPermissionAccess('granted');
                    GetGroupData();
                    console.log('Permission granted');
                }
            );
        });
        return unsubscribe;
    }, [navigation]);

    const GetGroupData = async () => {
        try {
            const response = await GetGroups(token);
            console.log("GetGroups Response : ", response);
            setPageData(response.groups);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching groups data:', error);
        }
    };
    const ModalShow = () => {
        setModalVisible(!modalVisible);
    }
    const JoinModalShow = () => {
        setJoinModalVisible(!modalVisible);
    }
    const ModalGroupEdit = (group_id, group_name, group_type) => {
        setgroupName(group_name);
        console.log(group_type, "group_type")
        setgroupType(group_type);
        setgroupID(group_id);
        setEditmodalVisible(!modalVisible);
    }

    const ModalGroupDelete = (group_id) => {
        setgroupID(group_id);
        setDeletemodalVisible(!modalVisible);
    }
    const generateInvitationKey = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let invitationKey = '';
        for (let i = 0; i < 16; i++) {
            invitationKey += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return invitationKey;
    };
    const AddGroup = async () => {
        if (groupName !== '' && groupType !== '') {
            setShowMessage(false);
            setIsLoadingAdd(true);
            const invitationKey = generateInvitationKey();
            const analytic_data = await getStats(); // [{"name":"digitalwellbing","time":34702927},{"name":"launcher2","time":4409779}]
            const date = new Date();
            const response = await CreateGroup(token, groupName, groupType, invitationKey, analytic_data[0], date, analytic_data[1]);
            if (response.errorr == 1) {
            } else {
                GetGroupData();
                toast.show("Success! Group Has been Created..", {
                    type: "success",
                    placement: "top",
                    duration: 4000,
                    offset: 30,
                    animationType: "slide-in",
                });
                setIsLoadingAdd(false);
                setgroupName('');
                setModalVisible(false);
                // console.log("response : ", response);
            }
        } else {
            setShowMessage(true);
        }
    };
    const JoinGroup = async () => {
        if (InvitationKey !== '') {
            setShowMessageJoin(false);
            setIsLoadingJoin(true);
            setShowConsent(true);
            setJoinModalVisible(false);

        } else {
            setShowMessageJoin(true);
        }
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
                resolve([filter_data,hourly_data]);
            });
        });
    };


    const EditGroup = async () => {
        if (groupName !== '' && groupType !== '') {
            setShowMessage(false);
            setIsLoadingAdd(true);
            const response = await EditGroupApi(token, groupName, groupType, groupID);
            if (response.errorr == 1) {
            } else {
                GetGroupData();
                toast.show("Success! Group Has been Edited..", {
                    type: "success",
                    placement: "top",
                    duration: 4000,
                    offset: 30,
                    animationType: "slide-in",
                });
                setIsLoadingAdd(false);
                setgroupName('');
                setEditmodalVisible(false);
                console.log("response : ", response);
            }
        } else {
            setShowMessage(true);
        }
    }

    const DeleteGroup = async () => {
        console.log("wokring");
        setShowMessage(false);
        setIsLoadingAdd(true);
        const response = await DeleteGroupApi(token, groupID);
        if (response.errorr == 1) {
        } else {
            GetGroupData();
            toast.show("Success! Group Has been Deleted..", {
                type: "success",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
            });
            setIsLoadingAdd(false);
            setgroupName('');
            setDeletemodalVisible(false);
            console.log("response : ", response);
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
        console.log("working");
        setIsLoadingAdd(true);
        try {
            const analytic_data = await getStats(); // [{"name":"digitalwellbing","time":34702927},{"name":"launcher2","time":4409779}]
            const date = new Date();
            const response = await JoinGroupMembers(token, InvitationKey, analytic_data[0], date, sharing_consent, analytic_data[1]);
            if (response.error == 1) {
                setIsLoadingAdd(false);
                setInvitationKey('');
                setShowMessageJoinInvalid(response.errors.error);
                // console.log("error : " ,  response.errors);
            } else {
                setIsLoadingJoin(false);

                GetGroupData();
                toast.show("Success! Group Has been Joined..", {
                    type: "success",
                    placement: "top",
                    duration: 4000,
                    offset: 30,
                    animationType: "slide-in",
                });
                setIsLoadingAdd(false);
                setInvitationKey('');
                setShowConsent(false);
                // console.log("response : ", response);
            }
            // const analytic_data = await getStats();
            // console.log(token, groupID, analytic_data);
            // const date = new Date();
            // const response = await AnalyticApi(token, groupID, JSON.stringify(analytic_data) , date);
            // if (response.errorr == 1) {
            // } else {
            //     GetGroupData();
            //     setIsLoadingAdd(false);
            //     // setEditmodalVisible(false);
            //     setShowConsent(false);
            //     console.log("response analytics : ", response);
            // }
            // Proceed with API call or other actions
        } catch (error) {
            // Handle errors
            console.error("Error fetching analytics data:", error);
        }
    };
    const formatDate = (dateString) => {
        const formattedDate = moment(dateString).format('YYYY MMMM, DD hh:mm A');
        return formattedDate;
    };
    const ShareGroup = (group_id, invitation_key, group_name) => {
        const invitationLink = "https://play.google.com/store/apps/details?id=com.digitalwellbing";
        Share.share({
            message: `You are invited to join the group "${group_name}". Please use the invitation key: ${invitation_key} to join. You can download the app using the following link: ${invitationLink}.`,
        });
    };


    const handleSubmit = (group_id) => {
        const selectedGroup = pageData.find(group => group._id === group_id);
        console.log(selectedGroup);
        if (selectedGroup) {
            navigation.navigate('GroupDetails', {
                selectedGroup: selectedGroup
            });
        } else {
            console.warn(`Group with group_id ${group_id} not found in pageData`);
        }
    };

    const ExitGroupMember = async () => {
        // console.log("wokring");
        setisLoadingDelete(true);
        const response = await DeleteGroupMemberApi(token, groupID, login_user._id);
        if (response.errorr == 1) {
        } else {
            GetGroupData();
            toast.show("Success! Group Has been Exited..", {
                type: "success",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
            });
            setisLoadingDelete(false);
            setExitmodalVisible(false);
            navigation.navigate('GroupScreen');
            // console.log("response : ", response);
        }
    }

    const ModalGroupExit = (group_id) => {
        setgroupID(group_id);
        setExitmodalVisible(!ExitmodalVisible);
    }

    const avgUsage = (data) => {
        let totalSeconds = 0;
        let userCount = 0;
        data.forEach(dt => {
            dt.user_analytics.forEach(d => {
                let analytics_data = JSON.parse(d.analytics_data);
                let userTotalTime = 0;
                analytics_data.forEach(ad => {
                    userTotalTime += ad.time / 1000;
                });
                totalSeconds += userTotalTime;
                userCount++;
            });
        });
        const avgSeconds = totalSeconds / userCount;
        const hours = Math.floor(avgSeconds / 3600);
        const minutes = Math.floor((avgSeconds % 3600) / 60);
        return `${hours}h : ${minutes}m`;
    }

    const GroupItem = React.memo(({ index, group_name, group_members, group_id, invitation_key, user_create_id, created_at, group_type, group_members_usage }) => (
        <TouchableOpacity style={styles.chapterWrapperInfo} onPress={() => handleSubmit(group_id)}>
            <Text style={styles.courseChapterNO}>
                {group_type == 'Office' ? (
                    <Ionicons name="person" size={20} color="white" />
                ) : (
                    (group_type == 'Family') ? (
                        <MaterialIcons name="family-restroom" size={20} color="white" />
                    ) : (
                        <FontAwesome5 name="user-friends" size={20} color="white" />
                    )
                )}
            </Text>
            <View style={{ marginHorizontal: 10, width: width * 60 }}>
                <Text style={styles.courseChaptername}>{group_name}</Text>
                <View style={{ flexDirection: 'row', width: width * 40, marginVertical: 2 }}>
                    <Text style={{ fontSize: 10, color: 'black' }}>{group_members} Members</Text>
                    <Text style={{ marginLeft: 'auto', fontSize: 10, color: 'black', fontWeight: '900' }}>Avg: {avgUsage(group_members_usage)}</Text>
                </View>
                <Text style={{ fontSize: 10, color: 'black' }}>Created At: {formatDate(created_at)}</Text>
            </View>
            <TouchableOpacity style={{ marginLeft: 'auto', marginRight: 5, }} onPress={() => ShareGroup(group_id, invitation_key, group_name)}>
                <Ionicons name="share-outline" size={20} color="black" />
            </TouchableOpacity>
            {(user_create_id !== login_user._id) ? (
                <>
                    <TouchableOpacity onPress={() => ModalGroupExit(group_id)}>
                        <Ionicons name="exit" size={20} color="black" />
                    </TouchableOpacity>
                </>
            ) : (
                ''
            )}
            {(user_create_id == login_user._id) ? (
                <>
                    <TouchableOpacity style={{ marginRight: 5, }} onPress={() => ModalGroupEdit(group_id, group_name, group_type)}>
                        <Ionicons name="pencil" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => ModalGroupDelete(group_id)}>
                        <Ionicons name="trash-bin" size={20} color="black" />
                    </TouchableOpacity>
                </>
            ) : (
                ''
            )}
            {/* <Ionicons name="chevron-forward" size={20} color="black" /> */}
        </TouchableOpacity>
    ));


    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Groups</Text>
            {(permissionAccess == 'granted') ? (
                <>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={ModalShow} style={styles.createBtn} >
                            <Text style={styles.Buttontext}>Create</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={JoinModalShow} style={styles.joinBtn} >
                            <Text style={styles.Buttontext}>Join</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.welcome}>Groups Listing</Text>
                    {
                        isLoading ? (
                            <ActivityIndicator style={{
                                marginTop: 20,
                            }} size="large" color="#438f7f" />
                        ) : (
                            (pageData.length) ? (
                                <FlatList
                                    data={pageData}
                                    contentContainerStyle={{ paddingBottom: 20, justifyContent: 'center' }}
                                    numColumns={1}
                                    keyExtractor={(item, index) => index.toString()}
                                    renderItem={({ item, index }) => (
                                        <GroupItem
                                            index={index}
                                            group_name={item.name}
                                            group_members={(item.group_members) ? item.group_members.length : 0}
                                            group_id={item._id}
                                            invitation_key={item.invitation_key}
                                            user_create_id={item.user_id}
                                            created_at={item.created_at}
                                            group_type={item.type}
                                            group_members_usage={item.group_members}
                                        />
                                    )}
                                    style={styles.FlatListContainer}
                                    showsVerticalScrollIndicator={false}
                                />
                            ) :
                                (<Text style={{ textAlign: 'center', fontWeight: '900', color: 'black' }}>NO Groups Found!</Text>)

                        )
                    }
                </>
            ) :
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 17, textAlign: 'center', color: 'black' }}>Please enable the UsageStats permission, located in the top right corner of the Analytics page, before creating a group.</Text>
                </View>
            }

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}>
                <View style={stylesModal.centeredView}>
                    <View style={stylesModal.modalView}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: '900', color: 'black', fontSize: 18 }}>Create Groups</Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={{ marginLeft: 'auto' }}
                            >
                                <Entypo name="circle-with-cross" size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            label={'Group Name'}
                            underlineColor="transparent"
                            activeUnderlineColor="black"
                            underlineColorAndroid="transparent"
                            style={styles.groupInput}
                            value={groupName}
                            onChangeText={groupName => setgroupName(groupName)}
                            theme={{
                                roundness: 5,
                                colors: {
                                    placeholder: 'grey',
                                    primary: 'grey',
                                },
                                fonts: { regular: { fontFamily: 'Poppins-Light' } },
                            }}
                        />
                        {/* <TextInput
                            label={'Group Type'}
                            underlineColor="transparent"
                            activeUnderlineColor="black"
                            underlineColorAndroid="transparent"
                            style={styles.groupInput}
                            value={groupType}
                            onChangeText={groupType => setgroupType(groupType)}
                            theme={{
                                roundness: 5,
                                colors: {
                                    placeholder: 'grey',
                                    primary: 'grey',
                                },
                                fonts: { regular: { fontFamily: 'Poppins-Light' } },
                            }}
                        /> */}
                        <RNPickerSelect
                            onValueChange={(value) => {
                                setgroupType(value);
                            }}
                            items={[
                                { label: 'Family', value: 'Family' },
                                { label: 'Friends', value: 'Friends' },
                                { label: 'Office', value: 'Office' },
                            ]}
                            style={pickerSelectStyles}
                            // useNativeAndroidPickerStyle={false}
                            hideDoneBar={true}
                            doneText="Select"
                            placeholder={{ label: 'Select Group Type', value: null }}
                        // onOpen={() => setPickerVisible(true)}
                        // onClose={() => setPickerVisible(false)}
                        />
                        {ShowMessage && <Text style={styles.errorText}>Please fill The required field</Text>}
                        <TouchableOpacity style={styles.createBtnAdd} onPress={AddGroup}>
                            {isLoadingAdd ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.Buttontext}>Create</Text>
                            )}

                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={JoinmodalVisible}>
                <View style={stylesModal.centeredView}>
                    <View style={stylesModal.modalView}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: '900', color: 'black', fontSize: 18 }}>Join Group</Text>
                            <TouchableOpacity
                                onPress={() => setJoinModalVisible(false)}
                                style={{ marginLeft: 'auto' }}
                            >
                                <Entypo name="circle-with-cross" size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            label={'Invitation key'}
                            underlineColor="transparent"
                            activeUnderlineColor="black"
                            underlineColorAndroid="transparent"
                            style={styles.groupInput}
                            value={InvitationKey}
                            onChangeText={InvitationKey => setInvitationKey(InvitationKey)}
                            theme={{
                                roundness: 5,
                                colors: {
                                    placeholder: 'grey',
                                    primary: 'grey',
                                },
                                fonts: { regular: { fontFamily: 'Poppins-Light' } },
                            }}
                        />
                        {ShowMessageJoin && <Text style={styles.errorText}>Please fill The required field</Text>}
                        {ShowMessageJoinInvalid && <Text style={styles.errorText}>{ShowMessageJoinInvalid}</Text>}
                        <TouchableOpacity style={styles.createBtnAdd} onPress={JoinGroup}>
                            {isLoadingJoin ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.Buttontext}>Join</Text>
                            )}

                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={EditmodalVisible}>
                <View style={stylesModal.centeredView}>
                    <View style={stylesModal.modalView}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: '900', color: 'black', fontSize: 18 }}>Edit Group</Text>
                            <TouchableOpacity
                                onPress={() => setEditmodalVisible(false)}
                                style={{ marginLeft: 'auto' }}
                            >
                                <Entypo name="circle-with-cross" size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                        <TextInput
                            label={'Group Name'}
                            underlineColor="transparent"
                            activeUnderlineColor="black"
                            underlineColorAndroid="transparent"
                            style={styles.groupInput}
                            value={groupName}
                            onChangeText={groupName => setgroupName(groupName)}
                            theme={{
                                roundness: 5,
                                colors: {
                                    placeholder: 'grey',
                                    primary: 'grey',
                                },
                                fonts: { regular: { fontFamily: 'Poppins-Light' } },
                            }}
                        />
                        <RNPickerSelect
                            onValueChange={(value) => {
                                setgroupType(value);
                            }}
                            items={[
                                { label: 'Family', value: 'Family' },
                                { label: 'Friends', value: 'Friends' },
                                { label: 'Office', value: 'Office' },
                            ]}
                            style={pickerSelectStyles}
                            value={groupType}
                            hideDoneBar={true}
                            doneText="Select"
                            placeholder={{ label: 'Select Group Type', value: null }}
                        />
                        {ShowMessage && <Text style={styles.errorText}>Please fill The required field</Text>}
                        <TouchableOpacity style={styles.createBtnAdd} onPress={EditGroup}>
                            {isLoadingAdd ? (
                                <ActivityIndicator size="small" color="white" />
                            ) : (
                                <Text style={styles.Buttontext}>Create</Text>
                            )}

                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                animationType="slide"
                transparent={true}
                visible={DeletemodalVisible}>
                <View style={stylesModal.centeredView}>
                    <View style={stylesModal.modalView}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: '900', color: 'black', fontSize: 18 }}>Delete Group</Text>
                            <TouchableOpacity
                                onPress={() => setDeletemodalVisible(false)}
                                style={{ marginLeft: 'auto' }}
                            >
                                <Entypo name="circle-with-cross" size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontWeight: '900', color: 'black', fontSize: 20, textAlign: 'center', padding: 20 }}>Are You sure you want to delete this group and members?</Text>

                        <View style={{ flexDirection: 'row', width: 'auto', justifyContent: 'center' }}>
                            <TouchableOpacity style={styles.createBtnAdd} onPress={DeleteGroup}>
                                {isLoadingAdd ? (
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={ExitmodalVisible}>
                <View style={stylesModal.centeredView}>
                    <View style={stylesModal.modalView}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: '900', color: 'black', fontSize: 18 }}>Leave Group</Text>
                            <TouchableOpacity
                                onPress={() => setExitmodalVisible(false)}
                                style={{ marginLeft: 'auto' }}
                            >
                                <Entypo name="circle-with-cross" size={20} color="red" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{ fontWeight: '900', color: 'black', fontSize: 20, textAlign: 'center', padding: 20 }}>Are You sure you want to Leave this group?</Text>

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

const pickerSelectStyles = StyleSheet.create({
    viewContainer: {
        borderWidth: 1,
        borderColor: '#d3cccc',
        marginBottom: 10,
        borderRadius: 8,
        color: 'black',
    },
    placeholder: {
        color: 'black',
        fontWeight: '900'
    },
    inputAndroid: {
        color: 'black',

    }
});