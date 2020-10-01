import React, { Component } from 'react'
import { View, StyleSheet, ViewStyle, LayoutChangeEvent, Dimensions } from 'react-native'
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { NoMeasurements } from '../../components/growth/NoMeasurements';
import { LastMeasurements } from '../../components/growth/LastMeasurements';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { scale, moderateScale } from 'react-native-size-matters';
import { HomeScreenParams } from '../home/HomeScreen';
import { translate } from '../../translations/translate';
import { Typography, TextButton } from '../../components';
import { TypographyType } from '../../components/Typography';
import { translateData, TranslateDataGrowthPeriods } from '../../translationsData/translateData';
import { dataRealmStore, userRealmStore } from '../../stores';
import { chartTypes, GrowthChart, ChartData } from '../../components/growth/GrowthChart';
import { ChildGender, Measures } from '../../stores/ChildEntity';
import { DateTime } from 'luxon';
import { ChartData as Data, GrowthChart0_2Type, GrowthChartHeightAgeType } from '../../components/growth/growthChartData';
import { TextButtonColor } from '../../components/TextButton';
import { navigation, utils } from '../../app';
import { ActivityIndicator } from 'react-native-paper';
import { DataRealmContext, DataRealmContextValue, DataRealmConsumer } from '../../stores/DataRealmContext';
import { UserRealmConsumer, UserRealmContextValue } from '../../stores/UserRealmContext';
import { HomeMessages, Message, IconType } from '../../components/HomeMessages';

export interface GrowthScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, HomeScreenParams>,
}

export interface State {
    periodIntroductionText: string,
    measuresData: ChartData[],
    interpretationTextWeightLength: InterpretationText,
    interpretationTextLenghtAge: InterpretationText,
    childBirthDate: DateTime | null,
    childGender: ChildGender,
    lastMeasurementDate: string | undefined,
    isFirstChartLoaded: boolean,
    isSecoundChartLoaded: boolean
    lastMeasuresWeight: number,
    lastMeasuresLength: number,
    defaultMessage: string,
}
// git check
export class GrowthScreen extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.state = this.initState()
        utils.logAnalitic("mainMenuItemClick", {eventName: "mainMenuItemClick", screen: "Growth"});
        this.setDefaultScreenParams();
    }

    private convertMeasuresData(measures: Measures[], childBirthDay: Date) {
        let measurementDateInDays: number = 0;

        let measuresData: ConvertedMeasures[] = [];

        measures.forEach(item => {
            if (item.measurementDate) {
                let childAge = DateTime.fromJSDate(childBirthDay)
                let date = DateTime.fromJSDate(new Date(item.measurementDate));

                let days = date.diff(childAge, "days").toObject().days

                measurementDateInDays = days ? days : 0;
            };
            
            if (measurementDateInDays < 1855) {
                measuresData.push({
                    weight: item.weight ? parseFloat(item.weight) / 1000 : 0,
                    length: item.length ? parseFloat(item.length) : 0,
                    measurementDate: measurementDateInDays ? measurementDateInDays : 0,
                });
            };
        });

        return measuresData;
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                isFirstChartLoaded: true,
            })
        }, 200);

        setTimeout(() => {
            this.setState({
                isSecoundChartLoaded: true,
            })
        }, 250)
    }

    public initState() {
        // initialize state 
        let state: State = {
            periodIntroductionText: "",
            measuresData: [],
            childBirthDate: null,
            childGender: "boy",
            lastMeasurementDate: undefined,
            isFirstChartLoaded: false,
            isSecoundChartLoaded: false,
            lastMeasuresWeight: 0,
            lastMeasuresLength: 0,
            defaultMessage: "",
            interpretationTextWeightLength: {
                text: "",
                articleId: 0,
                name: "",
            },
            interpretationTextLenghtAge: {
                text: "",
                articleId: 0,
                name: "",
            }

        };

        let childAgeInDays: number | null = null;
        
        let allMeasures: Measures[] = [];
        let measures: Measures[] = [];
        let periodIntroductionText: string = '';
        let defaultMessage = "";

        let currentChild = userRealmStore.getCurrentChild();
        // if currentChild birthDate is not set return HomeScreen message 
        if (currentChild && currentChild.birthDate) {
            state.childBirthDate = DateTime.fromJSDate(currentChild.birthDate);
            let childGender = currentChild?.gender;

            childAgeInDays = userRealmStore.getCurrentChildAgeInDays(currentChild.birthDate.getTime());

            if (childAgeInDays !== null) {
                let ageInDays = 0;

                if (childAgeInDays >= 1885) {
                    ageInDays = 1885;
                    defaultMessage = translate('DefaultPeriodInterpretationText');
                } else {
                    ageInDays = Math.round(childAgeInDays);
                    defaultMessage = "";
                };

                
                let allPeriods = translateData('growthPeriods') as (TranslateDataGrowthPeriods | null)

                allPeriods?.filter(item => (ageInDays >= item.dayMin && ageInDays <= item.dayMax))[0]

                let growthPeriod = allPeriods?.
                    filter(item => (ageInDays >= item.dayMin && ageInDays <= item.dayMax))[0];

                periodIntroductionText = growthPeriod?.text ? growthPeriod.text : "";

            }

            // if measures is empty return just box for adding a new measure 
            if (currentChild?.measures !== "" && currentChild.measures !== undefined && currentChild.measures !== null) {
                allMeasures = JSON.parse(currentChild?.measures);

                measures = allMeasures.filter(item => parseInt(item.length) > 0 && parseInt(item.weight) > 0);

                let lastMeasurementDate: string | undefined = undefined;
                let lastMeasuresWeight: number = 0;
                let lastMeasuresLength: number = 0;
                let lastMeasurementDateObject: DateTime = DateTime.local();

                if (measures[measures.length - 1]?.measurementDate !== undefined) {
                    let date: DateTime = DateTime.local();

                    let dt = measures[measures.length - 1].measurementDate;

                    if (dt) {
                        date = DateTime.fromMillis(dt);
                    }
                    
                    lastMeasurementDateObject = date;
                    lastMeasurementDate = date.toFormat("dd'.'MM'.'yyyy");
                    lastMeasuresWeight = measures[measures.length - 1].weight ? parseFloat(measures[measures.length - 1].weight) / 1000 : 0
                    lastMeasuresLength = measures[measures.length - 1].length ? parseFloat(measures[measures.length - 1].length) : 0
                }

                let birthDay = new Date(currentChild.birthDate);                

                let ageInDaysLastMeasurement = lastMeasurementDateObject.diff(DateTime.fromJSDate(birthDay), "days").days;

                const measuresData = this.convertMeasuresData(measures, birthDay);
                const interpretationTextWeightLength = userRealmStore.getInterpretationWeightForHeight(
                    childGender,
                    ageInDaysLastMeasurement,
                    measures[measures.length - 1]
                ).interpretationText;

                const interpretationTextLenghtAge = userRealmStore.getInterpretationLenghtForAge(
                    childGender,
                    measures[measures.length - 1]
                ).interpretationText;

                state = {
                    periodIntroductionText: periodIntroductionText,
                    measuresData: measuresData,
                    interpretationTextWeightLength: interpretationTextWeightLength ? interpretationTextWeightLength : state.interpretationTextWeightLength,
                    interpretationTextLenghtAge: interpretationTextLenghtAge ? interpretationTextLenghtAge : state.interpretationTextLenghtAge,
                    childGender: childGender,
                    childBirthDate: DateTime.fromJSDate(currentChild.birthDate),
                    lastMeasurementDate: lastMeasurementDate,
                    isFirstChartLoaded: false,
                    isSecoundChartLoaded: false,
                    lastMeasuresWeight: lastMeasuresWeight,
                    defaultMessage: defaultMessage,
                    lastMeasuresLength: lastMeasuresLength,
                };

            } else {
                state.periodIntroductionText = periodIntroductionText;
            };
        };
        return state;
    };

    private setDefaultScreenParams() {
        let defaultScreenParams: GrowthScreenParams = {

        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private goToNewMeasurements() {
        this.props.navigation.push('HomeStackNavigator_NewMeasurementScreen', { screen: "growth" });
    }

    private goToArticle(id: number) {
        let article = dataRealmStore.getContentFromId(id);
        let categoryName = dataRealmStore.getCategoryNameFromId(id);

        if (article === undefined) return;

        navigation.navigate(
            'HomeStackNavigator_ArticleScreen',
            { article: article, categoryName: categoryName }
        );
    };

    private openFullScreenChart(type: chartTypes) {
        this.props.navigation.push('RootModalStackNavigator_ChartFullScreen',
            {
                chartType: type,
                childBirthDate: this.state.childBirthDate,
                childGender: this.state.childGender === "boy" ? "male" : 'female',
                lineChartData: this.state.measuresData,
            }
        );
    };

    render() {
        const {
            periodIntroductionText,
            measuresData,
            childBirthDate,
            childGender,
            interpretationTextWeightLength,
            interpretationTextLenghtAge
        } = this.state;
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }}
                        contentContainerStyle={styles.container}
                    >
                        {
                            this.state.childBirthDate === null ?
                                <DataRealmConsumer>
                                    {(dataRealmContext: DataRealmContextValue) => (
                                        <UserRealmConsumer>
                                            {(userRealmContext: UserRealmContextValue) => (
                                                <HomeMessages showCloseButton={true}></HomeMessages>
                                            )}
                                        </UserRealmConsumer>
                                    )}
                                </DataRealmConsumer>
                                :
                                <View>
                                    <View style={styles.header}>
                                        <View style={{ alignSelf: 'center' }}>
                                            <Typography type={TypographyType.headingPrimary}>
                                                {translate('growScreenTitle')}
                                            </Typography>
                                        </View>
                                        {
                                            measuresData.length !== 0 ?
                                                <View style={styles.allMeasuresBtn}>
                                                    <TextButton
                                                        color={TextButtonColor.purple}
                                                        onPress={() => {
                                                            this.props.navigation.push('HomeStackNavigator_AllMeasurementScreen')
                                                        }}
                                                    >
                                                        {translate('allMeasurements')}
                                                    </TextButton>
                                                </View> : null
                                        }
                                    </View>
                                    <View style={styles.card}>
                                        <Typography>
                                            {periodIntroductionText}
                                        </Typography>
                                    </View>
                                    {
                                        measuresData.length === 0 ?
                                            <NoMeasurements
                                                addNewMeasures={() => this.goToNewMeasurements()}
                                            />
                                            :
                                            <>
                                                {this.state.isFirstChartLoaded ?
                                                    <View style={styles.chartCard}>
                                                        <GrowthChart
                                                            title={translate('weightForLength')}
                                                            chartType={chartTypes.heightLength}
                                                            childBirthDate={childBirthDate ? childBirthDate : DateTime.local()}
                                                            childGender={childGender === "boy" ? "male" : 'female'}
                                                            lineChartData={measuresData}
                                                            showFullscreen={false}
                                                            openFullScreen={() => this.openFullScreenChart(chartTypes.heightLength)}

                                                        />
                                                    </View>
                                                    : <View style={styles.card}><ActivityIndicator /></View>

                                                }

                                                {
                                                    this.state.defaultMessage === "" ?
                                                        interpretationTextWeightLength?.text ?
                                                            <View style={styles.card}>
                                                                <Typography>
                                                                    {interpretationTextWeightLength.text}
                                                                </Typography>
                                                                <TextButton
                                                                    color={TextButtonColor.purple}
                                                                    onPress={() => this.goToArticle(interpretationTextWeightLength.articleId)}
                                                                >
                                                                    {translate('moreAboutChildGrowth')}
                                                                </TextButton>
                                                            </View> : null
                                                        : null
                                                }
                                                {
                                                    this.state.isSecoundChartLoaded ?
                                                        <View style={styles.chartCard}>
                                                            <GrowthChart
                                                                title={translate('lengthForAge')}
                                                                chartType={chartTypes.lengthAge}
                                                                childBirthDate={childBirthDate ? childBirthDate : DateTime.local()}
                                                                childGender={childGender === "boy" ? "male" : 'female'}
                                                                lineChartData={measuresData}
                                                                showFullscreen={false}
                                                                openFullScreen={() => this.openFullScreenChart(chartTypes.lengthAge)}

                                                            />
                                                        </View> : <View style={styles.card}><ActivityIndicator /></View>
                                                }

                                                {
                                                    this.state.defaultMessage === "" ?
                                                        interpretationTextLenghtAge?.text ?
                                                            <View style={styles.card}>
                                                                <Typography>
                                                                    {interpretationTextLenghtAge.text}
                                                                </Typography>
                                                                <TextButton
                                                                    color={TextButtonColor.purple}
                                                                    onPress={() => this.goToArticle(interpretationTextLenghtAge.articleId)}
                                                                >
                                                                    {translate('moreAboutChildGrowth')}
                                                                </TextButton>
                                                            </View> : null
                                                        : <View style={styles.card}>
                                                            <Typography>
                                                                {this.state.defaultMessage}
                                                            </Typography>
                                                        </View>
                                                }
                                                <View>
                                                    {/* <NewMeasurements onPress={() => this.goToNewMeasurements()} /> */}
                                                    <LastMeasurements
                                                        measureDate={this.state.lastMeasurementDate ? this.state.lastMeasurementDate : ""}
                                                        measureLength={this.state.lastMeasuresLength.toString()}
                                                        measureMass={this.state.lastMeasuresWeight.toString()}
                                                        onPress={() => this.goToNewMeasurements()}
                                                    />
                                                </View>
                                            </>
                                    }

                                </View>
                        }
                    </ScrollView>
                )}
            </ThemeConsumer>
        )
    }
}

export interface InterpretationText {
    text: string,
    name: string,
    articleId: number
}

export interface ConvertedMeasures {
    weight: number,
    length: number,
    measurementDate: number,
}

export interface GrowthScreenStyles {
    container: ViewStyle,
    header: ViewStyle,
    card: ViewStyle,
    chartCard: ViewStyle,
    allMeasuresBtn: ViewStyle,
}

const styles = StyleSheet.create<GrowthScreenStyles>({
    container: {
        padding: scale(14),
        alignItems: 'stretch',
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignContent: 'center'
    },
    allMeasuresBtn: {
        position: "absolute",
        right: 0,
        top: 16,
        alignSelf: 'center'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        padding: scale(16),
        marginBottom: 20,
    },
    chartCard: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        marginBottom: 20,
        // height: moderateScale(940)
    }
})

