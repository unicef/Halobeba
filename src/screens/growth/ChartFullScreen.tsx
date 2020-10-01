import React, { Component } from "react";
import { GrowthChart, chartTypes, ChartData } from "../../components/growth/GrowthChart";
import { navigation } from "../../app";
import { NavigationStackProp, NavigationStackState } from "react-navigation-stack";
import { HomeScreenParams } from "../home/HomeScreen";
import { translate } from "../../translations";
import { Typography } from "../../components";
import Orientation from "react-native-orientation-locker";
import { View, Dimensions } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { DateTime } from "luxon";

interface State {
    chartType: chartTypes,
    childBirthDate: DateTime,
    childGender: "male" | "female",
    lineChartData: ChartData[],
    isChartVisible: boolean
}

interface Props {
    navigation: NavigationStackProp<NavigationStackState, HomeScreenParams>,
}

export class ChartFullScreen extends Component<Props, State>{
    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {

        if (this.props.navigation.state.params) {
            const { chartType, childBirthDate, childGender, lineChartData } = this.props.navigation.state.params;
            let state: State = {
                chartType: chartType,
                childBirthDate: childBirthDate,
                childGender: childGender,
                lineChartData: lineChartData,
                isChartVisible: false,
            }

            this.state = state;
        }
    }

    componentDidMount() {
        Orientation.lockToLandscape()

        setTimeout(() => {
            this.setState({
                isChartVisible: true
            })
        }, 170)
    }

    public componentWillUnmount() {
        Orientation.lockToPortrait();
    }

    private closeFullScreen() {
        navigation.goBack()
    }

    render() {
        const { chartType, childBirthDate, childGender, lineChartData } = this.state;
        const title = chartType === chartTypes.heightLength ? translate('weightForLength') : translate('lengthForAge');

        return (
            <View style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height, flex: 1}}>
                {this.state.isChartVisible ?
                    <GrowthChart
                        title={title}
                        showFullscreen={true}
                        chartType={chartType}
                        childBirthDate={childBirthDate}
                        childGender={childGender}
                        lineChartData={lineChartData}
                        closeFullScreen={() => this.closeFullScreen()}
                    /> : <View style={{flex: 1, alignContent: 'center', width: "100%", height: '100%', alignItems: "center", justifyContent: "center"}}><ActivityIndicator /></View>

                }

            </View>
        )
    }

}