import React, { Component } from 'react'
import { View, StyleSheet, ViewStyle, Text, TextStyle } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { RadioButtons } from '../../components/RadioButtons';
import { DateTimePicker } from '../../components/DateTimePicker';
import { RoundedTextArea } from '../../components/RoundedTextArea';
import { Typography, TypographyType } from '../../components/Typography';
import { RoundedTextInput } from '../../components/RoundedTextInput';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import { Checkbox, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { scale, moderateScale } from 'react-native-size-matters';
import { translate } from '../../translations/translate';
import { userRealmStore, dataRealmStore } from '../../stores';
import { Measures } from '../../stores/ChildEntity';
import { navigation } from '../../app';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { GrowthScreen } from '../home';
import { DateTime } from 'luxon';


export interface Props {
    navigation: NavigationStackProp<NavigationStackState, {}>;
}

export interface State {
    measurementDate: DateTime | undefined,
    measurementDateError: boolean,
    length: string,
    lengthError: boolean,
    weight: string,
    weightError: boolean,
    comment: string,
    measurementPlace: string | undefined,
    isVaccineReceived: string | undefined,
    defaultMessage: string;
}


export class NewMeasurementScreen extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);

        this.initState()
    }

    private initState = () => {
        let state: State = {
            measurementDate: undefined,
            length: "",
            weight: "",
            comment: "",
            isVaccineReceived: "no",
            measurementPlace: "home",
            measurementDateError: false,
            weightError: false,
            lengthError: false,
            defaultMessage: "",
        };

        this.state = state;
    }

    private setMeasurementPlace = (value: string | undefined) => {
        this.setState({
            // measurementPlace: value,
        })
    }

    private setisVaccineReceived = (value: string | undefined) => {
        this.setState({
            isVaccineReceived: value,
        })
    }

    private setMeasurementDate = (value: Date) => {
        let dateTime = DateTime.fromJSDate(value);
        this.setState({
            measurementDate: dateTime,
        })
    }

    private measureChange = (value: string, label: string) => {
        if (label === "length") {
            this.setState({
                length: value
            })
        } else {
            this.setState({
                weight: value
            })
        }
    }

    private valueCheck() {
        let isValid = true;

        let lengthError = false;
        let weightError = false;
        let measurementDateError = false

        if (this.state.length === "") {
            isValid = false;
            lengthError = true;
        };

        if (this.state.weight === "") {
            weightError = true;
            isValid = false;
        };

        if (this.state.measurementDate === undefined) {
            measurementDateError = true;
            isValid = false;
        };

        return {
            isValid: isValid,
            lengthError: lengthError,
            weightError: weightError,
            measurementDateError: measurementDateError
        };
    }

    private async submit() {
        const { comment, length, weight, measurementDate } = this.state;
        const currentChild = userRealmStore.getCurrentChild();
        if (!currentChild) return;

        let measures: Measures[] = [];
        let check = this.valueCheck();

        if (check.isValid && this.state.measurementPlace !== undefined) {

            let place = this.state.measurementPlace;

            if (currentChild.measures !== null && currentChild.measures !== "") {
                measures = JSON.parse(currentChild.measures);
                let sameDate = false;
                measures.forEach(item => {
                    if (item.measurementDate && measurementDate) {
                        if (Math.round(DateTime.fromMillis(item.measurementDate).diff(measurementDate, "days").days) === 0) {
                            sameDate = true;
                            item.weight = weight;
                            item.length = length;
                            return;
                        };
                    }
                });

                if (sameDate === false) {
                    measures.push({ measurementPlace: place, length: length, weight: weight, measurementDate: measurementDate?.toMillis(), didChildGetVaccines: false, isChildMeasured: true });
                };
            } else {
                measures[0].weight = weight;
                measures[0].length = length;
                measures[0].measurementDate = measurementDate?.toMillis();
            }

            await userRealmStore.realm?.write(() => {
                currentChild.comment = comment;
                currentChild.measures = JSON.stringify(measures);
                // This will just trigger the update of data realm
                dataRealmStore.setVariable('randomNumber', Math.floor(Math.random() * 6000) + 1);
            });
            this.setState({
                measurementDate: undefined,
                length: "",
                weight: "",
                comment: "",
                isVaccineReceived: "no",
                measurementPlace: "home",
                measurementDateError: false,
                weightError: false,
                lengthError: false,
                defaultMessage: "",
            })
            if (this.props.navigation.state.params?.screen) {
                // this will triger update on growth screen after measures added 
                if (this.props.navigation.state.params.screen === "growth") {
                    this.props.navigation.push('HomeStackNavigator_GrowthScreen')
                };
            } else {
                this.props.navigation.goBack()
            }
        } else {
            this.setState({
                lengthError: check.lengthError,
                weightError: check.weightError,
                measurementDateError: check.measurementDateError
            })
        }



    }

    render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ backgroundColor: 'white' }}
                        contentContainerStyle={styles.container}
                    >
                        <View style={styles.dateTimePickerContainer}>
                            <DateTimePicker
                                label={translate("newMeasureScreenDatePickerLabel")}
                                onChange={(date) => this.setMeasurementDate(date)}
                                maximumDate={new Date()}
                                style={this.state.measurementDateError ? { borderWidth: 1, borderColor: 'red' } : null}
                            />
                        </View>
                        <View style={styles.measurementPlaceContainer}>
                            <Typography style={{ marginBottom: 22 }}>{translate("newMeasureScreenPlaceTitle")}</Typography>
                            <RadioButtons
                                value={this.state.measurementPlace}
                                buttons={[
                                    { text: translate("newMeasureScreenPlaceOptionDoctor"), value: 'doctor' },
                                    {
                                        text: translate("newMeasureScreenPlaceOptionHome"), value: 'home'
                                    }]}
                                onChange={value => this.setMeasurementPlace(value)}
                            />
                        </View>

                        <View>
                            <RoundedTextInput
                                label={translate('weightLabel')}
                                suffix="g"
                                icon="weight"
                                style={[{ width: 150 }, this.state.weightError ? { borderColor: 'red', borderWidth: 1 } : null]}
                                value={this.state.weight}
                                keyboardType="numeric"
                                onChange={value => this.measureChange(value, 'height')}
                            />
                            <RoundedTextInput
                                label={translate('lengthLabel')}
                                suffix="cm"
                                icon="weight"
                                keyboardType="numeric"
                                style={[{ width: 150, marginTop: 8 }, this.state.lengthError ? { borderColor: 'red', borderWidth: 1 } : null]}
                                value={this.state.length}
                                onChange={value => this.measureChange(value, 'length')}

                            />
                        </View>

                        {/* if measurementPlace === "doctor"  */}
                        {
                            this.state.measurementPlace === "doctor" && (
                                <View style={styles.vaccineContainer} >
                                    <Typography style={{ marginBottom: 16 }}>{translate("newMeasureScreenVaccineTitle")}</Typography>
                                    <RadioButtons
                                        value={this.state.isVaccineReceived}
                                        buttonStyle={{ width: 150 }}
                                        buttons={[
                                            { text: translate("newMeasureScreenVaccineOptionYes"), value: 'yes' },
                                            { text: translate("newMeasureScreenVaccineOptionNo"), value: 'no' }
                                        ]}
                                        onChange={value => this.setisVaccineReceived(value)}
                                    />
                                </View>
                            )
                        }



                        {/* ####### radio buttons "DA" is clicked FIXED TEXTS FOR TESTING ONLY #######  */}
                        {/* ####### previous vaccine #######  */}
                        {
                            this.state.isVaccineReceived === "yes" && (
                                <>
                                    <View style={styles.vaccineContainerTitle}>
                                        <Typography type={TypographyType.headingSecondary}>Vakcine iz prethodnog perioda</Typography>
                                    </View>
                                    <View style={styles.vaccineContainerBody}>
                                        <Checkbox status="unchecked" />
                                        <View style={styles.vaccineContainerText}>
                                            <Typography style={styles.vaccineText}>
                                                Vakcina protiv difterije, tetanusa, velikog kašlja, dečije paralize, hemofilus influence tipa B
                                            </Typography>
                                            <Icon name="chevron-down" />
                                        </View>
                                    </View>
                                    <View style={styles.vaccineContainerBody}>
                                        <Checkbox status="unchecked" />
                                        <View style={styles.vaccineContainerText}>
                                            <Typography style={styles.vaccineText} >
                                                Vakcina protiv velikih boginja
                                            </Typography>
                                            <Icon name="chevron-down" />
                                        </View>
                                    </View>

                                    {/* ####### next vaccine ####### */}
                                    <View style={styles.vaccineContainerTitle}>
                                        <Typography type={TypographyType.headingSecondary}>Vakcine planirane u 3. mesecu</Typography>
                                    </View>
                                    <View style={styles.vaccineContainerBody}>
                                        <Checkbox status="unchecked" />
                                        <View style={styles.vaccineContainerText}>
                                            <Typography style={styles.vaccineText} >
                                                Vakcina protiv hemofilus influence tipa B, tuberkuloze, zarazne žutice
                                            </Typography>
                                            <Icon name="chevron-down" />
                                        </View>
                                    </View>
                                    <View style={styles.vaccineContainerBody}>
                                        <Checkbox status="unchecked" />
                                        <View style={styles.vaccineContainerText}>
                                            <Typography style={styles.vaccineText} >
                                                [sve vakcine iz prethodnog perioda koje nisu evidentirane]
                                            </Typography>
                                            <Icon name="chevron-down" />
                                        </View>
                                    </View>
                                </>
                            )
                        }


                        <View style={styles.commenterContainer}>
                            <RoundedTextArea placeholder={translate("newMeasureScreenCommentPlaceholder")} />
                        </View>

                        <View>
                            <RoundedButton
                                text={translate("newMeasureScreenSaveBtn")}
                                type={RoundedButtonType.purple}
                                onPress={() => this.submit()}
                            />
                        </View>
                        <Paragraph style={{textAlign: 'center', marginTop: scale(10), opacity: 0.6, fontSize: moderateScale(13)}}>
                            {translate("HomeMeasurementsAlertText")}
                        </Paragraph>
                    </ScrollView>
                )}
            </ThemeConsumer>

        )
    }
}

export interface NewMeasurementScreenStyles {
    [index: string]: ViewStyle | TextStyle,
    container: ViewStyle,
    dateTimePickerContainer: ViewStyle,
    measurementPlaceContainer: ViewStyle,
    vaccineContainer: ViewStyle,
    vaccineContainerTitle: ViewStyle,
    vaccineContainerBody: ViewStyle,
    vaccineContainerText: ViewStyle,
    commenterContainer: ViewStyle,
    vaccineText: TextStyle,
}

const styles = StyleSheet.create<NewMeasurementScreenStyles>({
    container: {
        padding: scale(24),
        alignItems: 'stretch',
    },
    dateTimePickerContainer: {

    },
    measurementPlaceContainer: {
        alignItems: 'flex-start',
        marginTop: scale(32),
        marginBottom: scale(32)
    },
    vaccineContainer: {
        alignItems: "flex-start",
        marginTop: scale(32),
    },
    vaccineContainerTitle: {
        marginTop: scale(32),
        marginBottom: scale(22),
    },
    vaccineContainerBody: {
        flexDirection: 'row',
        borderBottomColor: 'rgba(0,0,0,0.06)',
        borderBottomWidth: 1
    },
    vaccineContainerText: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    commenterContainer: {
        marginTop: scale(32),
        marginBottom: scale(32),
    },
    vaccineText: {
        fontSize: moderateScale(12),
        width: moderateScale(260),
        marginRight: scale(20),
        marginLeft: moderateScale(5),
        lineHeight: moderateScale(18)
    }
})

