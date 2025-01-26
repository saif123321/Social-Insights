import { ScrollView, View, Text, Image, TouchableOpacity, Switch, Share } from "react-native";
import { styles } from "../Login/style";
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { resetStore } from '../../redux/Reducers/resetStore';
import { useDispatch, useSelector } from 'react-redux';
import DeviceInfo from 'react-native-device-info';
export const SettingScreenNavigator = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const Logout = () => {
        dispatch(resetStore());
        navigation.navigate('Login');
    }
    // Get the app version
    const version = DeviceInfo.getVersion();
    const ShareGroup = () => {
        Share.share({
            message: `Hey! Check out this amazing app that helps improve your Social wellbeing. Download it now from the Google Play Store: https://play.google.com/store/apps/details?id=com.digitalwellbing.`
        });
    };

    const ShowLogs = () => {
        navigation.navigate('ShowLogs')
    }

    const login_user = useSelector(state => state.authReducer.auth);
    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>

                <Text style={styles.profilePicture}>{login_user.name[0]}</Text>
                <Text style={{ color: 'black', fontWeight: '900', fontSize: 25 }}>{login_user.name}</Text>

            </View>

            <TouchableOpacity style={styles.menuBtnLink} onPress={() => ShareGroup()}>
                <Feather name="share" size={22} color="black" />
                <Text style={{ color: 'black', fontSize: 16, paddingLeft: 5, }}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuBtnLink} onPress={() => ShowLogs()}>
                <Ionicons name="document" size={22} color="black" />
                <Text style={{ color: 'black', fontSize: 16, paddingLeft: 5, }}>Logs</Text>
            </TouchableOpacity>
            <Text style={{
                color: 'black', fontWeight: '900',
                flexDirection: 'row', alignItems: 'center', padding: 15,
                position: 'absolute',
                bottom: 40,
                right: 0,
            }}>v:{version}</Text>
            <TouchableOpacity style={styles.LogoutBtn} onPress={() => Logout()}>
                <AntDesign name="logout" size={22} color="black" />
                <Text style={{ color: 'black', fontSize: 16, paddingLeft: 5, }}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

