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

export const ShowLogs = () => {
    const navigation = useNavigation();
    const api_logs = useSelector(state => state.authReducer.logs);
    const [filterDate, setFilterDate] = useState(new Date());
    const [pageData, setPageData] = useState([]);

    useEffect(() => {
        filterLogsByDate(filterDate);
    }, [filterDate, api_logs]);

    const formatDate = (dateString) => {
        return moment(dateString).format('YYYY MMMM, DD hh:mm A');
    };

    const filterLogsByDate = (date) => {
        if (api_logs) {
            const filteredLogs = api_logs.filter(log =>
                moment(log.date).isSame(date, 'day')
            );
            setPageData(filteredLogs);
        }
    };

    const handlePrevDate = () => {
        const newDate = moment(filterDate).subtract(1, 'days').toDate();
        setFilterDate(newDate);
    };

    const handleNextDate = () => {
        if (moment(filterDate).isSameOrAfter(moment(), 'day')) return;
        const newDate = moment(filterDate).add(1, 'days').toDate();
        setFilterDate(newDate);
    };
    const handleShowDetailsLogs = (date, status, time, message, api_hit_date) => {
        navigation.navigate('ShowLogsDetails', {
            date: date,
            status: status,
            message: message,
            api_hit_date: api_hit_date
        })
    }

    const LogsItem = React.memo(({ date, status, time, message, api_hit_date }) => (
        console.log("message : " , message),
        <TouchableOpacity onPress={() => handleShowDetailsLogs(date, status, time, message, api_hit_date)} style={styles.chapterWrapperInfo}>
            <View style={{ marginHorizontal: 10, width: width * 60 }}>
                <Text style={{ fontSize: 10, color: 'black' }}>Date: {formatDate(date)}</Text>
                <Text style={{ fontSize: 10, color: 'black' }}>
                    Message: {typeof message === 'object' ? JSON.stringify(message) : message}
                </Text>

                {message === 'Api Hit' && (
                    <Text style={{ fontSize: 10, color: 'black' }}>Api Hit Date: {api_hit_date}</Text>
                )}
                {status === 'success' ? (
                    <Text style={{ fontSize: 10, color: 'green', fontWeight: '900' }}>{status}</Text>
                ) : (
                    <Text style={{ fontSize: 10, color: 'red', fontWeight: '900' }}>{status}</Text>
                )}
            </View>
        </TouchableOpacity>
    ));

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.welcome}>Logs</Text>
                {(pageData.length) ? (

                    <FlatList
                        data={pageData}
                        contentContainerStyle={{ paddingBottom: 20, justifyContent: 'center' }}
                        numColumns={1}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <LogsItem
                                date={item.date}
                                status={item.status}
                                time={item.time}
                                message={item.message}
                                api_hit_date={item.api_hit_date || ''}
                            />
                        )}
                        style={{ height: '80%' }}
                        showsVerticalScrollIndicator={false}
                    />
                ) :
                    (<Text style={{ textAlign: 'center', fontWeight: '900', color: 'black' }}>NO Data Found!</Text>)

                }
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 8, borderRadius: 50, justifyContent: 'center', position: 'absolute', bottom: 5, left: 0, right: 0 }}>
                <TouchableOpacity
                    style={{ padding: 5, marginHorizontal: 20, backgroundColor: 'black', borderRadius: 50 }}
                    onPress={handlePrevDate}
                >
                    <Ionicons name="caret-back-circle-outline" size={25} color="white" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: '900', color: '#438f7f' }}>{moment(filterDate).format('YYYY, MMMM DD')}</Text>
                <TouchableOpacity
                    style={{ padding: 5, marginHorizontal: 20, backgroundColor: 'black', borderRadius: 50 }}
                    onPress={handleNextDate}
                    disabled={moment(filterDate).isSameOrAfter(moment(), 'day')}
                >
                    <Ionicons name="caret-forward-circle-outline" size={25} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};


