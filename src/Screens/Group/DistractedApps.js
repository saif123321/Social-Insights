// Dashboard.js (or Dashboard.tsx)
import React, { Component, useState, useEffect } from 'react';
import {
    Text,
    View,
    Dimensions,
    FlatList, Image, ActivityIndicator,
    TouchableOpacity, Alert, Modal, Pressable, StyleSheet
} from 'react-native';
import _ from 'lodash';
import { NativeModules } from 'react-native';
export const width = Dimensions.get('window').width * 0.01;
export const height = Dimensions.get('window').height * 0.01;
import { styles } from '../Login/style';
import { useNavigation } from '@react-navigation/native';
import { distractingAppSend, getDistractedApps } from '../../helperFunction/postRequest';
import { TextInput } from 'react-native-paper';
import { useToast } from "react-native-toast-notifications";


export const DistractedApps = ({ route }) => {
    const navigation = useNavigation();
    const [pageData, setPageData] = useState([]);
    const [selectedApps, setSelectedApps] = useState({});
    const [timeLimits, setTimeLimits] = useState(JSON.parse(route.params.group_data.distracting_apps));
    const [isLoading, setIsLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentAppName, setCurrentAppName] = useState('');
    const [timeLimitInput, setTimeLimitInput] = useState('');
    const toast = useToast();
    
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            GetDistractedAppsData();
        });
        return unsubscribe;
    }, [navigation]);

    const GetDistractedAppsData = async () => {
        try {
            const response = await getDistractedApps(route.params.group_data._id);
            setPageData(response.distracted_apps);
        } catch (error) {
            console.error('Error fetching distracted apps data:', error);
        }
    };

    const toggleAppSelection = (appName, isChecked) => {
        // if (isChecked) {
        //     const { [appName]: removedApp, ...restApps } = selectedApps;
        //     const { [appName]: removedTimeLimit, ...restLimits } = timeLimits;
        //     setSelectedApps(restApps);
        //     setTimeLimits(restLimits);
        // } else {
        //     setSelectedApps({ ...selectedApps, [appName]: true });
        //     setTimeLimits((prevTimeLimits) => ({
        //         ...prevTimeLimits,
        //         [appName]: prevTimeLimits[appName] || 0
        //     }));
            setCurrentAppName(appName);
            setModalVisible(true);
            setTimeLimitInput(timeLimits[appName] ? timeLimits[appName].toString() : '');
        // }
        
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handleSetTimeLimit = () => {
        const numericValue = timeLimitInput.trim() !== '' ? parseInt(timeLimitInput, 10) : null;
        setTimeLimits((prevTimeLimits) => {
            if (numericValue === null) {
                const { [currentAppName]: _, ...rest } = prevTimeLimits;
                return rest;
            } else {
                return {
                    ...prevTimeLimits,
                    [currentAppName]: numericValue
                };
            }
        });
        setModalVisible(false);
    };
    

    const sendSelectedAppsData = async () => {
        try {
            setIsLoading(true);

            const hasInvalidInput = Object.keys(selectedApps).some((appName) => !timeLimits[appName]);

            if (hasInvalidInput) {
                setIsLoading(false);
                Alert.alert('Error', 'Please enter time limits for all selected apps.');
                return;
            }

            const selectedAppsData = Object.keys(selectedApps).map((appName) => ({
                app_name: appName,
                time_limit_minutes: timeLimits[appName],
            }));

            console.log("selectedAppsData : ", timeLimits);
            await distractingAppSend(timeLimits , route.params.group_data._id);
            toast.show("Success! Distracting App Data Has been Updated..", {
                type: "success",
                placement: "top",
                duration: 4000,
                offset: 30,
                animationType: "slide-in",
            });
            setIsLoading(false);

            // setSelectedApps({});
            // setTimeLimits({});

        } catch (error) {
            console.error('Error sending data to server:', error);
        }
    };

    const AppItem = React.memo(({ app_name }) => {
        const isSelected = timeLimits.hasOwnProperty(app_name);
        const appTimeLimit = timeLimits[app_name] || 0; // Default to 0 if time limit is not set

        return (
            <View style={{ padding: 10, flexDirection: 'row' }}>
                <TouchableOpacity
                    onPress={() => {
                        toggleAppSelection(app_name, isSelected); // Toggle selection
                        // openModal(app_name); // Open modal
                    }}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                    <View style={{ width: 20, height: 20, borderRadius: 12, borderWidth: 2, borderColor: 'gray', justifyContent: 'center', alignItems: 'center' }}>
                        {isSelected > 0 && <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#438f7f' }} />}
                    </View>
                    <Text style={{ marginLeft: 10, color: 'black' }}>{app_name} - {appTimeLimit} min</Text>
                </TouchableOpacity>
            </View>
        );
    });


    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 25, margin: 10, fontWeight: '900', color: 'black' }}>
                Distracting Apps - {route.params.group_data.name}
            </Text>
            {pageData.length > 0 ? (
                <>
                    <FlatList
                        data={pageData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <AppItem app_name={item} />
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={closeModal}
                    >
                        <View style={stylesModal.centeredView}>
                            <View style={stylesModal.modalView}>
                                <Text style={{ fontSize: 15, margin: 10, fontWeight: '900', color: 'black' }}>Set Time Limit for - {currentAppName}</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="numeric"
                                    value={timeLimitInput}
                                    onChangeText={setTimeLimitInput}
                                    placeholder="Enter time limit (min)"
                                />
                                <Pressable
                                    style={[styles.button, styles.buttonClose]}
                                    onPress={handleSetTimeLimit}
                                >
                                    <Text style={styles.textStyle}>Set</Text>
                                </Pressable>
                            </View>
                        </View>
                    </Modal>
                    <TouchableOpacity
                        style={{
                            backgroundColor: '#438f7f',
                            padding: 10,
                            alignItems: 'center',
                            borderRadius: 5,
                            margin: 10,
                        }}
                        onPress={sendSelectedAppsData}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="white" />
                        ) : (
                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Save</Text>
                        )}
                    </TouchableOpacity>
                </>
            ) : (
                <Text style={{ fontSize: 15, textAlign: 'center', margin: 10, fontWeight: '900', color: 'black' }}>No Data Found!</Text>
            )}

        </View>
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
    }
});
