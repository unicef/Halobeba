import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { GrowthChart, chartTypes } from './GrowthChart';
import { ScrollView } from 'react-native-gesture-handler';
import { DateTime } from 'luxon';

const dummyData = {
    /*  0-2  */
    lineChartData: [{ measurementDate: 269, weight: 2, length: 45 }, { measurementDate: 330, weight: 4.5, length: 55  }, { measurementDate: 400, weight: 7, length: 70 }, { measurementDate: 1000, weight: 8, length: 80 }, { measurementDate: 1000, weight: 12, length: 87 }], 
    childBirthDate: DateTime.local(),   

    /*  2-5  */
    lineChartData2: [{ measurementDate: 269, weight: 9.3, length: 88 }, { measurementDate: 330, weight: 10.8, length: 95 }, { measurementDate: 400, weight: 13, length: 100 }, { measurementDate: 1000, weight: 16.4, length: 103 }],
    childBirthDate2: DateTime.local(),   

}


storiesOf('GrowthChart', module)
    .add('weight/height girls 0-2y', () => (
        <ScrollView>
        <View style={{ flex: 1, height: 350, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                lineChartData={dummyData.lineChartData}
                childGender="female"
                showFullscreen={false}
                chartType={chartTypes.heightLength}
                childBirthDate={dummyData.childBirthDate}

            />
        </View>
        <View style={{ flex: 1, height: 350, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                lineChartData={dummyData.lineChartData}
                childGender="female"
                showFullscreen={false}
                chartType={chartTypes.heightLength}
                childBirthDate={dummyData.childBirthDate}

            />
        </View>
        </ScrollView>
    ))
    .add('weight/height girls 2-5y', () => (
        <ScrollView>
       <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                lineChartData={dummyData.lineChartData2}
                childGender="female"
                showFullscreen={true}
                chartType={chartTypes.heightLength}
                childBirthDate={dummyData.childBirthDate2}

            />
        </View>
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                lineChartData={dummyData.lineChartData2}
                childGender="female"
                showFullscreen={true}
                chartType={chartTypes.heightLength}
                childBirthDate={dummyData.childBirthDate2}

            />
        </View>
        </ScrollView>
    ))
    .add('weight/height boys 0-2y', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                lineChartData={dummyData.lineChartData}
                childGender="female"
                showFullscreen={false}
                chartType={chartTypes.heightLength}
                childBirthDate={dummyData.childBirthDate}

            />
        </View>
    ))
    .add('weight/height boys 2-5y', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Tezina za visinu"
                lineChartData={dummyData.lineChartData2}
                childGender="male"
                showFullscreen={false}
                chartType={chartTypes.heightLength}
                childBirthDate={dummyData.childBirthDate2}

            />
        </View>
    ))
    .add('height/age girls 0-5y', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Visina za uzrast"
                lineChartData={dummyData.lineChartData}
                childGender="female"
                showFullscreen={false}
                chartType={chartTypes.lengthAge}
                childBirthDate={dummyData.childBirthDate}

            />
        </View>
    ))
    .add('height/age boys 0-5y', () => (
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <GrowthChart
                title="Visina za uzrast"
                lineChartData={dummyData.lineChartData}
                childGender="male"
                showFullscreen={false}
                chartType={chartTypes.lengthAge}
                childBirthDate={dummyData.childBirthDate}
            />
        </View>
    ));