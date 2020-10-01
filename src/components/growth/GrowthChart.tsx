import React, { ReactNode } from 'react';
import { Platform } from 'react-native';
import { VictoryArea, VictoryLabel, VictoryTooltip, VictoryScatter, VictoryChart, VictoryAxis, VictoryTheme, VictoryLine, VictoryZoomContainer } from "victory-native";
import { VictoryAxisCommonProps, TickLabelProps, Background } from 'victory-core';
import { VictoryTooltipProps } from 'victory-tooltip';
import { VictoryScatterProps } from 'victory-scatter';
import { VictoryLineProps } from 'victory-line';
import { VictoryAreaProps } from 'victory-area'
import { Dimensions, ViewStyle, StyleSheet, LayoutChangeEvent, View } from 'react-native';
import Svg from 'react-native-svg';
import { Typography, TypographyType } from '../Typography';
import { ChartData, GrowthChart0_2Type, GrowthChartHeightAgeType } from './growthChartData';
import Icon from 'react-native-vector-icons/Ionicons';
import { translate } from '../../translations';
import Orientation from 'react-native-orientation-locker';
import { scale, moderateScale } from 'react-native-size-matters';
import { DateTime } from 'luxon';

const fontFamily = 'SFUIDisplay-Regular';
const dayLimit = 730;

export interface Props {
    chartType: chartTypes,
    title: string,
    lineChartData: ChartData[],
    childGender: "male" | "female",
    childBirthDate: DateTime,
    showFullscreen: boolean,
    openFullScreen?: Function,
    closeFullScreen?: Function,
}
export interface State {
    orientation: 'portrait' | 'landscape';
    width: number,
    height: number,
    topArea: singleAreaDataFormat[],
    middleArea: singleAreaDataFormat[],
    bottomArea: singleAreaDataFormat[],
    lineChart: LineChartData[]
    labelX: string,
    labelY: "kg" | "cm",
}

export class GrowthChart extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.initState()
    }

    private initState() {
        let windowWidth = Dimensions.get('window').width;
        let windowHeight = Dimensions.get('window').height;

        const { GrowthChartBoys0_2, GrowthChartBoys2_5, GrowthChartGirls0_2, GrowthChartGirls2_5, Height_age_boys0_5, Height_age_girls0_5 } = ChartData;
        const { childGender, chartType } = this.props;

        let obj: chartAreaDataFormat;

        if (childGender === "male") {
            // boys
            if (chartType === chartTypes.heightLength) {
                if (this.getChildAge() <= dayLimit) {
                    obj = this.formatHeightData(GrowthChartBoys0_2);
                } else {
                    obj = this.formatHeightData(GrowthChartBoys2_5);
                }
            } else {
                obj = this.formatDaysData(Height_age_boys0_5);
            }
        } else {
            // girls
            if (chartType === chartTypes.heightLength) {
                if (this.getChildAge() <= dayLimit) {
                    obj = this.formatHeightData(GrowthChartGirls0_2);
                } else {
                    obj = this.formatHeightData(GrowthChartGirls2_5);
                }
            } else {
                obj = this.formatDaysData(Height_age_girls0_5);
            }
        }

        const chartData: LineChartData[] = [];

        /* Create line chart array for type chart */
        this.props.lineChartData.map(item => {
            chartData.push(this.props.chartType === chartTypes.heightLength ? { x: item.length, y: item.weight } : { x: item.measurementDate / 30, y: item.length })
        })

        let orientation: "portrait"  | "landscape" = windowWidth > windowHeight ? 'landscape' : 'portrait';

        let chartHeight = this.props.showFullscreen ? Dimensions.get('window').height - 120 : windowHeight - 300;
        
        let state: State = {
            orientation: orientation,
            width: windowWidth,
            height: chartHeight,
            bottomArea: obj.bottomArea,
            topArea: obj.topArea,
            middleArea: obj.middleArea,
            lineChart: chartData,
            labelX: chartType === chartTypes.heightLength ? "cm" : translate('chartMonth'),
            labelY: chartType === chartTypes.heightLength ? "kg" : "cm"
        };

        this.state = state;
    }

    private getChildAge = () => {
        let dateNow = DateTime.local();
        let diff = dateNow.diff(this.props.childBirthDate);
        
        return diff.days
    }


    private formatDaysData = (data: GrowthChartHeightAgeType) => {
        let obj: chartAreaDataFormat;

        let topArea: singleAreaDataFormat[] = [];
        let middleArea: singleAreaDataFormat[] = [];
        let bottomArea: singleAreaDataFormat[] = [];

        data.map(item => {
            topArea.push({ x: item.Day / 30, y: item.SD3, y0: item.SD4 });
            middleArea.push({ x: item.Day / 30, y: item.SD3neg, y0: item.SD3 });
            bottomArea.push({ x: item.Day / 30, y: item.SD3neg, y0: item.SD4neg });
        })

        obj = {
            topArea: topArea,
            middleArea: middleArea,
            bottomArea: bottomArea,
        }

        return obj;
    }

    private formatHeightData = (data: GrowthChart0_2Type) => {
        let obj: chartAreaDataFormat;

        let topArea: singleAreaDataFormat[] = [];
        let middleArea: singleAreaDataFormat[] = [];
        let bottomArea: singleAreaDataFormat[] = [];

        data.map(item => {
            if (item.Height >= 45 && item.Height <= 87) {
                topArea.push({ x: item.Height, y: item.SD3, y0: item.SD4 });
                middleArea.push({ x: item.Height, y: item.SD3neg, y0: item.SD3 });
                bottomArea.push({ x: item.Height, y: item.SD3neg, y0: item.SD4neg });
            }

            if (item.Height > 87.0) {
                topArea.push({ x: item.Height, y: item.SD3, y0: item.SD4 });
                middleArea.push({ x: item.Height, y: item.SD3neg, y0: item.SD3 });
                bottomArea.push({ x: item.Height, y: item.SD3neg, y0: item.SD4neg });
            }
        })

        obj = {
            topArea: topArea,
            middleArea: middleArea,
            bottomArea: bottomArea,
        }

        return obj;
    }

    private fullScreenEvents(){
        if(this.props.openFullScreen){
            this.props.openFullScreen()
        }

        if(this.props.closeFullScreen){
            this.props.closeFullScreen()
        }
    }


    private renderProps = () => {
        // return this.props.showFullscreen ? {height:  : null
    }
    private renderChart = (): ReactNode => (
        <>
            <VictoryChart
                theme={VictoryTheme.material}
                width={this.state.width - 30}
                height={this.state.height}
            >
                {/* ********* AXIS HORIZONTAL ********* */}
                <VictoryAxis
                    style={victoryStyles.VictoryAxis}
                    label={this.state.labelX}
                    axisLabelComponent={<VictoryLabel x={this.state.width - 60} />}
                />

                {/* ********* AXIS VERTICAL ********* */}
                <VictoryAxis
                    style={victoryStyles.VictoryAxisVertical}
                    axisLabelComponent={<VictoryLabel y={30} />}
                    dependentAxis
                    label={this.state.labelY}
                />

                {/* ********* TOP AREA ********* */}
                <VictoryArea
                    interpolation="natural"
                    style={{ data: this.props.showFullscreen ? { fill: "#F9C49E" } : { fill: "#D8D8D8" } }}
                    data={this.state.topArea}
                />
                {/* ********* BOTTOM AREA ********* */}
                <VictoryArea
                    interpolation="natural"
                    style={{ data: this.props.showFullscreen ? { fill: "#F9C49E" } : { fill: "#D8D8D8" } }}
                    data={this.state.bottomArea}
                />
                {/* ********* MIDDLE AREA ********* */}
                <VictoryArea
                    interpolation="natural"
                    style={victoryStyles.VictoryArea}
                    data={this.state.middleArea}
                />


                {/* ********* LINE CHART ********* */}
                <VictoryLine
                    data={this.state.lineChart}
                    interpolation="natural"
                    style={victoryStyles.VictoryLine}
                />

                {/********** SCATTER ********* */}
                {/* @ts-ignore */}
                 <VictoryScatter
                    data={this.state.lineChart}
                    size={9}
                    style={victoryStyles.VictoryScatter}
                    labelComponent={
                        <VictoryTooltip
                            renderInPortal={false}
                            style={victoryStyles.VictoryTooltip.style}
                            flyoutStyle={victoryStyles.VictoryTooltip.flyoutStyle}
                        />
                    }
                    labels={(props) => props.datum.y + " " + this.state.labelY + ' / ' + (Math.round((props.datum.x + Number.EPSILON) * 100) / 100) + " " + this.state.labelX}
                    events={[{
                        target: "data",
                        eventHandlers: {
                            onPressIn: (evt:any, pressedProps:any) => {
                                const selectedDataIndex = pressedProps.index
                                return [
                                    {
                                        eventKey: 'all',
                                        target: 'labels',
                                        mutation: (props:any) => {
                                            let activeState: boolean | null = true;
                                            if (props.active === true) {
                                                activeState = null;
                                            }
                                            return props.index ===
                                                selectedDataIndex
                                                ? { active: activeState }
                                                : { active: false };
                                        },
                                    },
                                    {
                                        eventKey: 'all',
                                        target: "data",
                                        mutation: (props: any) => {
                                            const stroke = props.style && props.style.stroke;
                                            let st;
                                            let activeState: boolean | null = true;
                                            if (props.active === true) {
                                                activeState = null;
                                            }
                                            if (stroke === "orange") {
                                                st = '#ACACAC';
                                            } else {
                                                st = 'orange';

                                            }

                                            return props.index === selectedDataIndex
                                                ? { style: { stroke: st, strokeWidth: 3, fill: 'white' } }
                                                : null
                                        }
                                    },
                                ]
                            },
                            onPressOut: (evt: any, pressedProps:any) => {
                                const selectedDataIndex = pressedProps.index
                                return [
                                    {
                                        eventKey: "all",
                                        target: "labels",
                                        mutation: (props: any) => {
                                            return props.index === selectedDataIndex
                                                ? { active: props.active }
                                                : null
                                        }
                                    },
                                    {
                                        eventKey: 'all',
                                        target: "data",
                                        mutation: (props: any) => {
                                            const stroke = props.style && props.style.stroke;
                                            // return stroke === "orange" ? null : { style: { stroke: "orange", strokeWidth: 4, fill: 'white' } };
                                            return props.index === selectedDataIndex
                                                ? { style: { fill: 'white', stroke: props.style.stroke, strokeWidth: 3 } }
                                                : null
                                        },
                                    },
                                ]
                            }
                        }
                    }]}
                />
            </VictoryChart>
            <View style={styles.chartLegend}>
                <View style={styles.chartLegendItem}>
                    <View style={{ width: 27, height: 12, backgroundColor: '#D8D8D8', margin: 10 }}></View>
                    <Typography style={{ fontSize: 11, opacity: 0.5 }}>{translate('growthChartLegendSilverLabel')}</Typography>
                </View>
                {
                    this.props.showFullscreen && (
                        <View style={styles.chartLegendItem}>
                            <View style={{ width: 27, height: 12, backgroundColor: '#F9C49E', margin: 10 }}></View>
                            <Typography style={{ fontSize: 11, opacity: 0.5 }}>
                                {translate('growthChartLegendOrangeLabel')}
                            </Typography>
                        </View>
                    )
                }
            </View>
        </>
    )

    public render() {
        return (
            <View style={[styles.container, this.props.showFullscreen ? {marginLeft: 20} : null]} >
                <View style={styles.chartHeader}>
                    <Typography type={TypographyType.headingSecondary}>{this.props.title}</Typography>
                    {
                        this.props.showFullscreen ?
                            <Icon name="md-close" style={{ position: 'absolute', right: 15, top: 20, fontSize: 20 }} onPress={() => this.fullScreenEvents()}/>
                            :
                            <Icon name="md-resize" 
                                style={{ position: 'absolute', right: 15, top: 20, fontSize: 20 }} 
                                onPress={() => this.fullScreenEvents()}/>

                    }
                </View>
                {
                    Platform.OS === 'ios' ?
                        this.renderChart()
                        :
                        <Svg style={{ marginLeft: -10}} >
                            {this.renderChart()}
                        </Svg>
                }


            </View>
        )
    }
}


const styles = StyleSheet.create<GrowtChartStyles>({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    chartHeader: {
        flexDirection: "row",
        paddingLeft: 20,
        paddingTop: 20,
    },
    contentWrapper: {
        paddingLeft: 15,
        paddingRight: 15,
    },
    chartLegend: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
    },
    chartLegendItem: {
        flexDirection: 'row',
        alignItems: 'center'
    }

});


const victoryStyles: VictoryStyles = {
    VictoryAxis: {
        grid: { stroke: 'transparent' },
        axis: { stroke: 'none' },
        axisLabel: { fontFamily: fontFamily, },
        tickLabels: { fontFamily: fontFamily }
    },
    VictoryAxisVertical: {
        grid: { stroke: 'transparent' },
        axis: { stroke: 'none' },
        // @ts-ignore
        axisLabel: { angle: 0, fontFamily: fontFamily },
        tickLabels: { fontFamily: fontFamily }
    },
    VictoryLine: {
        data: { stroke: "#0C66FF", strokeWidth: 9, strokeLinecap: "round", }
    },
    VictoryScatter: {
        data: { fill: "white", stroke: '#ACACAC', strokeWidth: 3 },
        labels: { fill: "red", fontFamily: fontFamily },
    },
    VictoryArea: {
        data: { fill: "#D8D8D8" }
    },

    VictoryTooltip: {
        flyoutStyle: {
            stroke: 'none',
            fill: '#262626',
            opacity: 85
        },
        style: {
            padding: 15,
            fill: 'white',
        }
    },
}

export interface singleAreaDataFormat {
    x?: number | null,
    y: number | null,
    y0: number | null,
}
export interface chartAreaDataFormat {
    topArea: singleAreaDataFormat[],
    middleArea: singleAreaDataFormat[],
    bottomArea: singleAreaDataFormat[],
}
export enum chartTypes {
    heightLength,
    lengthAge
}

export interface ChartData {
    measurementDate: number,
    weight: number,
    length: number,
}

export interface LineChartData {
    x: number,
    y: number,
}

export interface GrowtChartStyles {
    container?: ViewStyle;
    contentWrapper?: ViewStyle;
    chartLegend: ViewStyle;
    chartLegendItem: ViewStyle;
    chartHeader: ViewStyle;
}

export interface VictoryStyles {
    VictoryAxis: VictoryAxisCommonProps['style'],
    VictoryAxisVertical: VictoryAxisCommonProps['style'],
    VictoryLine: VictoryLineProps['style'],
    VictoryScatter: VictoryScatterProps['style'],
    VictoryArea: VictoryAreaProps['style'],
    VictoryExceptionsArea: VictoryAreaProps['style'],
    axisLabel?: TickLabelProps,
    VictoryTooltip: VictoryTooltipProps,
}