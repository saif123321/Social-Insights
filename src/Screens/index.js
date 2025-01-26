import React, {Component, useState, useEffect} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Dimensions,
  FlatList,
} from 'react-native';
import _ from 'lodash';
import {TextInput} from 'react-native-paper';
import {MultipleSelectList} from 'react-native-dropdown-select-list';
import {NativeModules} from 'react-native';
const UsageStats = NativeModules.UsageStats;
export const width = Dimensions.get('window').width * 0.01;
export const height = Dimensions.get('window').height * 0.01;

export const Main = () => {
    const [stats, setStats] = useState([]);
    const [durationInDays, setDurationInDays] = useState(7);
    const [selectedNames, setSelectedNames] = useState([]);
    const [filteredStats, setFilteredStats] = useState([]);
  
    useEffect(() => {
      getStats();
    }, [durationInDays]); // Fetch stats when durationInDays changes
  
    useEffect(() => {
      filterStats(selectedNames);
    }, [selectedNames]); // Filter stats when selectedNames change
  
    const updateDuration = (val) => {
      let newVal = val;
      if (!(parseInt(val) >= 0)) {
        newVal = '0';
      }
      setDurationInDays(parseInt(newVal));
    };
  
    const getStats = () => {
      UsageStats.getStats(durationInDays, (message) => {
        const stats = parseStats(message);
        setStats(stats);
      });
    };
  
    const parseStats = (unparsed) => {
      const appsAndTimes = unparsed.split(';');
      const times = appsAndTimes[1].split(',').map(val => parseInt(val));
      const apps = appsAndTimes[0].split(',').map(name => name.split('.').pop());
      console.log("times : " , times);
      console.log("apps : " , apps);
  
      const stats = [];
      for (let i = 0; i < apps.length; i++) {
        stats.push({
          name: apps[i],
          time: times[i],
        });
      }
  
      return stats;
    };
  
    const formatTime = (milliseconds) => {
      const hours = Math.floor(milliseconds / (1000 * 60 * 60));
      const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
      return `${hours}h : ${minutes}m`;
    };
  
    const getStatsComponents = () => {
      const statsToDisplay = selectedNames.length > 0 ? filteredStats : stats;
      const filteredStatsGreaterThan60Seconds = statsToDisplay.filter(
        stat => stat.time > 60000,
      ); // Filter stats where time is greater than 60 seconds
  
      return (
        <FlatList
          data={filteredStatsGreaterThan60Seconds}
          renderItem={({item, index}) => (
            <Text style={styles.stat} key={`app-${index}`}>
              {`${item.name}: `}
              <Text style={{fontWeight: '900'}}> {formatTime(item.time)}</Text>
            </Text>
          )}
          keyExtractor={(item, index) => `app-${index}`}
        />
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
  
    const filterStats = (selected) => {
      if (selected.length > 0) {
        const sortedStats = _.sortBy(stats, ['time']).reverse(); // Sort and slice stats array
        const filtered = sortedStats.filter(stat => selected.includes(stat.name));
        setFilteredStats(filtered);
      } else {
        setFilteredStats([]);
      }
    };
  return (
    <View style={styles.container}>
    <View>
      <Text style={styles.welcome}>Phone Analytics</Text>
      <Text style={styles.instructions}>
        Duration in foreground (Most used apps)
      </Text>
    </View>
    <TextInput
      label="Duration (Days)"
      underlineColor="transparent"
      activeUnderlineColor="black"
      underlineColorAndroid="transparent"
      style={styles.input}
      value={durationInDays ? durationInDays.toString() : ''}
      onChangeText={updateDuration}
      placeholder="Email"
      theme={{
        roundness: 5,
        colors: {
          placeholder: 'grey',
          primary: 'grey',
        },
        fonts: {regular: {fontFamily: 'Poppins-Light'}},
      }}
    />
    <MultipleSelectList
      placeholder="Select App"
      setSelected={val => setSelectedNames(val)} // Update selected names array
      data={data}
      save="value"
      // onSelect={() => alert(selected)}
      label="App Name"
    />
    <View style={styles.statsContainer}>{getStatsComponents()}</View>
  </View>
  )
}
const styles = StyleSheet.create({
    input: {
      marginVertical: 10,
      height: 7 * height,
      alignSelf: 'stretch',
      paddingLeft: 10,
      marginHorizontal: 8 * width,
      borderColor: 'grey',
      borderWidth: 0.5,
      backgroundColor: 'white',
      fontWeight: 'bold',
      shadowColor: '#9C9C9C',
      borderRadius: 7,
      elevation: 4,
      overflow: 'hidden',
    },
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
    },
    statsContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    welcome: {
      fontSize: 30,
      textAlign: 'center',
      margin: 10,
      fontWeight: '900',
      color: 'black',
    },
    instructions: {
      textAlign: 'center',
      color: '#333333',
      marginBottom: 5,
      fontWeight: '900',
    },
    stat: {
      textAlign: 'left',
      color: '#777777',
      marginTop: 5,
      fontSize: 18,
    },
  });