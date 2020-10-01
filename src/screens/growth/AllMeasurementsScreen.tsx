import React, { Component } from 'react'
import { View } from "react-native";
import { Measures } from '../../stores/ChildEntity';
import { userRealmStore } from '../../stores';
import { DateTime } from 'luxon';
import { OneMeasurements } from '../../components/growth/OneMeasurement';
import { NewMeasurements } from '../../components/growth/NewMeasurements';
import { navigation } from '../../app';
import { ScrollView } from 'react-native-gesture-handler';
import { translate } from '../../translations';
import { Typography } from '../../components';
import { TypographyType } from '../../components/Typography';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { HomeScreenParams } from '../home/HomeScreen';
import { UserRealmConsumer, UserRealmContextValue } from '../../stores/UserRealmContext';
import { stat } from 'react-native-fs';

interface Props {
    navigation: NavigationStackProp<NavigationStackState, HomeScreenParams>,
}

interface State {
    allMeasurements: Measures[]
}

export class AllMeasurementsScreen extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        let state: State = {
            allMeasurements: []
        }

        let currentChild = userRealmStore.getCurrentChild();

        if (currentChild && currentChild.measures !== "" && currentChild.measures !== null) {
            let measrues = JSON.parse(currentChild.measures);
            let measurementDate: DateTime = DateTime.local();
            const timeNow = DateTime.local();

            

            let allMeasurements = measrues.map((item: Measures) => {
                if (item.measurementDate) {
                    measurementDate = DateTime.fromJSDate(new Date(item.measurementDate))
                };

                let month: number = 0;

                if (currentChild?.birthDate) {
                    let birthDay = DateTime.fromJSDate(new Date(currentChild.birthDate))
                    month = Math.round(measurementDate.diff(birthDay, "month").months);
                }

                return {
                    weight: item.weight ? parseFloat(item.weight) / 1000 : 0,
                    length: item.length ? parseFloat(item.length) : 0,
                    measurementDate: measurementDate.toFormat("dd'.'MM'.'yyyy"),
                    dateToMilis: measurementDate.toMillis(),
                    titleDateInMonth: month,
                };
            });

            state.allMeasurements = allMeasurements.sort((a: any, b: any) =>  a.dateToMilis - b.dateToMilis);


        };

        this.state = state;
    }

    private renderTitle(key: number, measurementDate: number,) {
        if (key === 0) {
            return translate('onBirthDay');
        } else {
            return `${measurementDate}. ${translate('month')}`;
        };
    };

    render() {
        return (
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                <Typography type={TypographyType.headingPrimary}>
                    {translate('allMeasurements')}
                </Typography>
                {this.state.allMeasurements.length && this.state.allMeasurements.map((measure, index) => (
                    <View>
                        <OneMeasurements
                            measureDate={measure.measurementDate ? measure.measurementDate.toString() : ""}
                            measureLength={measure.length ? measure.length?.toString() : ""}
                            measureMass={measure.weight ? measure.weight.toString() : ""}
                            title={this.renderTitle(index, measure.titleDateInMonth ? measure.titleDateInMonth : 0)}
                            isVerticalLineVisible={true}
                        />
                    </View>
                ))}
                <NewMeasurements
                    onPress={() => navigation.navigate('HomeStackNavigator_NewMeasurementScreen', { screen: "growth" })}
                />
            </ScrollView>
        )
    }
}

