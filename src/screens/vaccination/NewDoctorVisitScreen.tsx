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
import { scale, moderateScale } from 'react-native-size-matters';
import { translate } from '../../translations/translate';
import { userRealmStore, dataRealmStore } from '../../stores';
import { Vaccine } from '../../components/vaccinations/oneVaccinations';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Checkbox, Snackbar } from 'react-native-paper';
import { Measures } from '../../stores/ChildEntity';
import { NavigationStackState, NavigationStackProp } from 'react-navigation-stack';
import { DateTime } from 'luxon';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const colorError = "#EB4747"

export interface NewDoctorVisitScreenParams {
    screenType: NewDoctorVisitScreenType;
}
export interface Props {
    navigation: NavigationStackProp<NavigationStackState, NewDoctorVisitScreenParams>;
}

export interface State {
    visitDate: Date | null,
    weight: string,
    height: string,
    comment: string,
    isVaccineReceived: string | undefined,
    isChildMeasured: string | undefined,
    childMeasuredError: string,
    childMeasuredWeightError: string,
    childMeasuredHeightError: string,
    vaccinesForCurrenPeriod: Vaccine[],
    vaccinesForPreviousPeriod: Vaccine[],
    isSnackbarVisible: boolean,
    snackbarMessage: string,
    isVaccineReceivedError: string,
    visitDateError: string,
}


export class NewDoctorVisitScreen extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.initState()
    }

    private initState = () => {

        let vaccinesForCurrenPeriod: Vaccine[] = [];
        let allVaccinesForCurrenPeriod = userRealmStore.getVaccinationsForCurrentPeriod();

        if(allVaccinesForCurrenPeriod.length > 0){
            allVaccinesForCurrenPeriod.forEach(vaccine => {
                if(vaccine.complete === false){
                    vaccinesForCurrenPeriod.push(vaccine)
                };
            });
        };

        let vaccinesForPreviousPeriod = userRealmStore.getPreviousVaccines();

        let isVaccineReceived = "";

        if (this.props.navigation.state?.params?.screenType === NewDoctorVisitScreenType.Vaccination) {
            isVaccineReceived = "yes"
        }

        let state: State = {
            visitDate: null,
            weight: "",
            height: "",
            comment: "",
            isVaccineReceived: isVaccineReceived,
            isVaccineReceivedError: "",
            isChildMeasured: "",
            visitDateError: "",
            childMeasuredError: "",
            childMeasuredWeightError: "",
            childMeasuredHeightError: "",
            vaccinesForCurrenPeriod: vaccinesForCurrenPeriod,
            vaccinesForPreviousPeriod: vaccinesForPreviousPeriod,
            isSnackbarVisible: false,
            snackbarMessage: "",
        };

        this.state = state;
    }

    private setisChildMeasured = (value: string | undefined) => {
        this.setState({
            childMeasuredError: "",
            isChildMeasured: value,
        })
    }

    private saveData = () => {

        let error = false;

        if (this.state.isChildMeasured === "") {
            error = true;
            this.setState({
                childMeasuredError: translate('vaccinationSwitchBtnErrorMessage')
            });
        };

        if (this.state.isVaccineReceived === "") {
            error = true;
            this.setState({
                isVaccineReceivedError: translate('vaccinationSwitchBtnErrorMessage')
            });
        };

        if (!this.state.visitDate) {
            error = true;
            this.setState({
                visitDateError: translate('vaccinationDateErrorMessage')
            });
        };

        if (!error && this.state.visitDate) {

            const completedVaccinations = this.getCompletedVaccines();

            let isChildMeasured: boolean = false;
            let didChildGetVaccines: boolean = false;
            let measurementDate = DateTime.fromJSDate(this.state.visitDate).toMillis();

            if (this.state.isChildMeasured === "yes") {
                isChildMeasured = true;
            };

            if (this.props.navigation.state.params?.screenType === NewDoctorVisitScreenType.HeltCheckUp) {
                if (this.state.isVaccineReceived === "yes") {
                    didChildGetVaccines = true;
                }
            } else {
                if (completedVaccinations.length > 0) {
                    didChildGetVaccines = true;
                }
            }

            let measure: Measures = {
                weight: this.state.weight,
                measurementPlace: "doctor",
                length: this.state.height,
                measurementDate: measurementDate,
                vaccineIds: completedVaccinations,
                isChildMeasured: isChildMeasured,
                didChildGetVaccines: didChildGetVaccines,
                doctorComment: this.state.comment
            }

            userRealmStore.addMeasuresForCurrentChild(measure);
            this.props.navigation.goBack();
        }
    }

    private setMeasurementDate = (value: Date) => {
        this.setState({
            visitDate: value,
            visitDateError: "",
        })
    }

    private measureChange = (value: string, label: string) => {
        if (label === "weight") {
            this.setState({
                weight: value
            })
        } else {
            this.setState({
                height: value
            })
        }
    }

    private onCheckBox(periodType: "previousPeriod" | "currentPeriod", id: string) {
        let vaccinesPeriod = periodType === "previousPeriod" ? this.state.vaccinesForPreviousPeriod : this.state.vaccinesForCurrenPeriod;
        vaccinesPeriod.forEach(item => {
            if (item.uuid === id) {
                item.complete = !item.complete
            };
        });

        if (periodType === "previousPeriod") {
            this.setState({
                vaccinesForPreviousPeriod: vaccinesPeriod
            });
        } else {
            this.setState({
                vaccinesForCurrenPeriod: vaccinesPeriod
            });
        };
    }

    private getCompletedVaccines() {
        let currentPeriod = this.state.vaccinesForCurrenPeriod.filter(item => item.complete === true);
        let previousPeriod = this.state.vaccinesForPreviousPeriod.filter(item => item.complete === true);

        let allVaccines: any = [];

        allVaccines = allVaccines.concat(currentPeriod.map(item => item.uuid));
        allVaccines = allVaccines.concat(previousPeriod.map(item => item.uuid));

        return allVaccines
    }

    private renderVaccines(vaccinesList: Vaccine[], periodType: "previousPeriod" | "currentPeriod") {
        return (
            <>
                {
                    vaccinesList.length > 0 ?
                        <>
                            <View style={styles.vaccineContainerTitle}>
                                <Typography type={TypographyType.bodyRegular} style={{ marginBottom: -10, fontWeight: "bold" }}>
                                    {
                                        periodType === "previousPeriod" ?
                                            translate('previousVaccinesTitle')
                                            :
                                            translate('newVaccinesLabelTitle')
                                    }
                                </Typography>
                            </View>
                            {
                                vaccinesList.map(item => (
                                    <View style={styles.vaccineContainerBody}>
                                        <View>
                                            <Checkbox.Android status={item.complete ? "checked" : "unchecked"} color="#2BABEE" onPress={() => this.onCheckBox(periodType, item.uuid)} />
                                        </View>
                                        <View style={styles.vaccineContainerText}>
                                            <Typography style={styles.vaccineText}>
                                                {item.title}
                                            </Typography>
                                            <Icon name="info-circle" style={{ fontSize: moderateScale(18), opacity: 0.7 }} onPress={() => dataRealmStore.openArticleScreen(parseInt(item.hardcodedArticleId))} />
                                        </View>
                                    </View>
                                ))
                            }
                        </> : <Typography>{translate("NoVaccinationForPeriodAlert")}</Typography>
                }
            </>
        )
    }

    private renderVaccinesSection() {
        return (
            <>
                {
                    this.props.navigation.state.params?.screenType === NewDoctorVisitScreenType.HeltCheckUp ?
                        <View style={styles.vaccineContainer} >
                            <Typography style={{ marginBottom: scale(16) }}>{translate("newMeasureScreenVaccineTitle")}</Typography>
                            <RadioButtons
                                value={this.state.isVaccineReceived}
                                style={this.state.isVaccineReceivedError !== "" ? { borderColor: colorError, borderWidth: 1, borderRadius: 27 } : null}
                                onChange={(value) => this.setState({ isVaccineReceived: value, isVaccineReceivedError: "" })}
                                buttonStyle={{ width: 150 }}
                                buttons={[
                                    { text: translate("newMeasureScreenVaccineOptionYes"), value: "yes" },
                                    { text: translate("newMeasureScreenVaccineOptionNo"), value: "no" }
                                ]}
                            />
                            {
                                this.state.isVaccineReceivedError !== "" ?
                                    <Typography style={{ color: colorError, fontSize: moderateScale(15) }}>{this.state.isVaccineReceivedError}</Typography>
                                    : null
                            }
                        </View>
                        :
                        null
                }

                {
                    this.state.isVaccineReceived === "yes" ?
                        <>
                            {this.renderVaccines(this.state.vaccinesForPreviousPeriod, "previousPeriod")}
                            {this.renderVaccines(this.state.vaccinesForCurrenPeriod, "currentPeriod")}
                        </>
                        : null
                }
            </>
        )
    }

    private renderChildMeasuresSection() {
        return (
            <>
                <View style={styles.vaccineContainer} >
                    <Typography style={{ marginBottom: 16 }}>{translate("NewDoctorVisitMeasurementTitle")}</Typography>
                    <RadioButtons
                        style={this.state.childMeasuredError !== "" ? { borderColor: colorError, borderWidth: 1, borderRadius: 27 } : null}
                        value={this.state.isChildMeasured}
                        buttonStyle={{ width: 150 }}
                        buttons={[
                            { text: translate("newMeasureScreenVaccineOptionYes"), value: "yes" },
                            { text: translate("newMeasureScreenVaccineOptionNo"), value: 'no' }
                        ]}
                        onChange={value => this.setisChildMeasured(value)}
                    />
                    {
                        this.state.childMeasuredError !== "" ?
                            <Typography style={{ color: colorError, fontSize: moderateScale(15) }}>{this.state.childMeasuredError}</Typography>
                            : null
                    }
                </View>
                {
                    this.state.isChildMeasured === "yes" && (
                        <View style={{ marginTop: 16, }}>
                            <RoundedTextInput
                                label={translate('fieldLabelWeight')}
                                suffix="g"
                                icon="weight"
                                style={{ width: 170 }}
                                value={this.state.weight}
                                onChange={value => this.measureChange(value, 'weight')}
                            />
                            <RoundedTextInput
                                label={translate('fieldLabelLength')}
                                suffix="cm"
                                icon="weight"
                                style={{ width: 170, marginTop: 8 }}
                                value={this.state.height}
                                onChange={value => this.measureChange(value, 'height')}
                            />
                        </View>
                    )}
            </>
        );
    };

    render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <>
                        <KeyboardAwareScrollView
                            style={{ backgroundColor: 'white' }}
                            keyboardShouldPersistTaps='handled'
                            contentContainerStyle={[styles.container]}
                        >
                            <View>
                                <DateTimePicker
                                    label={translate("NewDoctorVisitScreenDatePickerLabel")}
                                    onChange={(value) => this.setMeasurementDate(value)}
                                    maximumDate={new Date()}
                                    style={this.state.visitDateError !== "" ? { borderColor: colorError, borderWidth: 1, borderRadius: 27 } : null}
                                />
                                {
                                    this.state.visitDateError !== "" ?
                                        <Typography style={{ color: colorError, fontSize: moderateScale(15) }}>{this.state.visitDateError}</Typography>
                                        : null
                                }
                            </View>

                            {
                                this.props.navigation.state.params?.screenType === NewDoctorVisitScreenType.Vaccination ?
                                    <>
                                        {this.renderVaccinesSection()}
                                        {this.renderChildMeasuresSection()}
                                    </>
                                    :
                                    <>
                                        {this.renderChildMeasuresSection()}
                                        {this.renderVaccinesSection()}
                                    </>
                            }


                            <View style={styles.commenterContainer}>
                                <RoundedTextArea placeholder={translate("newMeasureScreenCommentPlaceholder")} onChange={(value) => this.setState({ comment: value })} />
                            </View>

                            <View>
                                <RoundedButton
                                    text={translate("newMeasureScreenSaveBtn")}
                                    type={RoundedButtonType.purple}
                                    onPress={() => this.saveData()}
                                />
                            </View>
                        </KeyboardAwareScrollView>
                        <Snackbar
                            visible={this.state.isSnackbarVisible}
                            duration={Snackbar.DURATION_SHORT}
                            onDismiss={() => { this.setState({ isSnackbarVisible: false }) }}
                            theme={{ colors: { onSurface: "red", accent: 'white' } }}
                            action={{
                                label: 'Ok',
                                onPress: () => {
                                    this.setState({ isSnackbarVisible: false });
                                },
                            }}
                        >
                            <Text style={{ fontSize: moderateScale(16) }}>
                                {this.state.snackbarMessage}
                            </Text>
                        </Snackbar>
                    </>
                )}
            </ThemeConsumer>

        )
    }
}

export enum NewDoctorVisitScreenType {
    Vaccination,
    HeltCheckUp
}

export interface NewDoctorVisitScreenStyles {
    container: ViewStyle,
    vaccineContainer: ViewStyle,
    commenterContainer: ViewStyle,
    vaccineText: TextStyle,
    vaccineContainerText: ViewStyle,
    vaccineContainerBody: ViewStyle,
    vaccineContainerTitle: ViewStyle,
}

const styles = StyleSheet.create<NewDoctorVisitScreenStyles>({
    container: {
        padding: scale(24),
        alignItems: 'stretch',
    },
    vaccineContainer: {
        alignItems: "flex-start",
        marginTop: scale(22),

    },
    commenterContainer: {
        marginTop: scale(32),
        marginBottom: scale(32),
    },
    vaccineContainerText: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    vaccineText: {
        fontSize: moderateScale(14),
        width: moderateScale(260),
        padding: scale(5),
        marginRight: scale(10),
        marginLeft: scale(5),
        lineHeight: moderateScale(18)
    },
    vaccineContainerBody: {
        flexDirection: 'row',
        borderBottomColor: 'rgba(0,0,0,0.06)',
        borderBottomWidth: 1
    },
    vaccineContainerTitle: {
        marginTop: scale(32),
        marginBottom: scale(22),
    },
})

