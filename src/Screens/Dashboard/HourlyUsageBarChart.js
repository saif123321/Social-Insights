import React from 'react';
import { BarChart } from 'react-native-chart-kit';
import { View, Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const HourlyUsageBarChart = ({ hourlyUsageData }) => {

    // Aggregate usage time per hour into 4-hour intervals
    const aggregatedData = {
        '12-4': 0,
        '4-8': 0,
        '8-12': 0,
        '12-16': 0,
        '16-20': 0,
        '20-24': 0,
    };

    hourlyUsageData.forEach(entry => {
        const { hour, packageName, usageTime } = entry;
        if (packageName.includes("launcher")) {
            return;
        }
        let convTime = (usageTime / (1000 * 60 * 60)); 
        if (hour >= '00:00' && hour < '04:00') {
            aggregatedData['12-4'] += convTime;
        } else if (hour >= '04:00' && hour < '08:00') {
            aggregatedData['4-8'] += convTime;
        } else if (hour >= '08:00' && hour < '12:00') {
            aggregatedData['8-12'] += convTime;
        } else if (hour >= '12:00' && hour < '16:00') {
            aggregatedData['12-16'] += convTime;
        } else if (hour >= '16:00' && hour < '20:00') {
            aggregatedData['16-20'] += convTime;
        } else if (hour >= '20:00' || hour < '24:00') {
            aggregatedData['20-24'] += convTime;
        }
    });

    const data = {
        labels: ['12-4', '4-8', '8-12', '12-16', '16-20', '20-24'],
        datasets: [
            {
                data: [
                    aggregatedData['12-4'].toFixed(1),
                    aggregatedData['4-8'].toFixed(1),
                    aggregatedData['8-12'].toFixed(1),
                    aggregatedData['12-16'].toFixed(1),
                    aggregatedData['16-20'].toFixed(1),
                    aggregatedData['20-24'].toFixed(1),
                ],
            },
        ],
    };

    return (
        <View>
            <BarChart
                style={{ borderRadius: 10}}
                data={data}
                width={screenWidth - 20}
                height={170}
                chartConfig={{
                    backgroundGradientFrom: "#294c45",
                    backgroundGradientTo: "#438f7f",
                    decimalPlaces: 1, 
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    barPercentage: 0.8,
                    propsForVerticalLabels: {
                        fontSize: 10,
                        fontWeight: 'bold',
                        color: 'white',
                    },
                    propsForLabels: {
                        fontSize: 10,
                        fontWeight: 'bold',
                        color: 'white',
                    },
                }}
                yAxisSuffix=" hrs"
            />
        </View>
    );
};

export default HourlyUsageBarChart;
