import { ScrollView, View, Text, Image, FlatList, Switch, TouchableOpacity } from "react-native";
import { styles } from "../Login/style";
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, { useState, useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { resetStore } from '../../redux/Reducers/resetStore';
import { useDispatch, useSelector } from 'react-redux';
import { width } from "../../../App";
import moment from 'moment';
import { height } from "..";

export const ShowLogsDetails = ({route }) => {
    const formatDate = (dateString) => {
        return moment(dateString).format('YYYY MMMM, DD hh:mm A');
    };

   
    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Logs Details</Text>
            <View style={{padding : 10}}>
                <Text style={{ fontSize: 15, color: 'black' }}>Date: {formatDate(route.params.date)}</Text>
                <Text style={{ fontSize: 15, color: 'green', fontWeight: '900' }}>Status: {route.params.status}</Text>
                <Text style={{ fontSize: 15, color: 'black' }}>Message: {route.params.message}</Text>
                {(route.params.api_hit_date) ? (
                    <Text style={{ fontSize: 15, color: 'black' }}>Api Data Date: {formatDate(route.params.api_hit_date)}</Text>
                ) : (
                    ''
                )}
                
            </View>
        </View>
    );
};


