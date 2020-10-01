import React, { Component, useDebugValue } from 'react'
import { View, StyleSheet, ViewStyle, } from 'react-native'
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { DateTimePicker, DateTimePickerType } from '../../components/DateTimePicker';
import { Typography, TypographyType } from '../../components/Typography';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import { scale, moderateScale } from 'react-native-size-matters';
import { translate } from '../../translations/translate';
import { userRealmStore } from '../../stores';
import Icon from 'react-native-vector-icons/EvilIcons';

import { NavigationStackState, NavigationStackProp } from 'react-navigation-stack';
import { DateTime } from 'luxon';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Reminder } from '../../stores/ChildEntity';
import { stat } from 'react-native-fs';

const colorError = "#EB4747"

export interface AddDoctorVisitReminderScreenParams {
    reminder: Reminder
}
export interface Props {
    navigation: NavigationStackProp<NavigationStackState, AddDoctorVisitReminderScreenParams>;
}

export interface State {
    doctorVisitDate: DateTime | null,
    doctorVisitTime: DateTime | null,
    doctorVisitDateError: string,
    doctorVisitTimeError: string,
    screenType: AddDoctorVisitReminderScreenType,
    uuid?: string,
};


export class AddDoctorVisitReminderScreen extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.initState();
    };

    private initState = () => {

        let date = null;
        let time = null;
        let uuid = "";
        let screenType = AddDoctorVisitReminderScreenType.newReminder;

        if (this.props.navigation.state.params?.reminder) {

            date = DateTime.fromMillis(this.props.navigation.state.params.reminder.date);
            time = DateTime.fromMillis(this.props.navigation.state.params.reminder.time);
            uuid = this.props.navigation.state.params.reminder.uuid;
            screenType = AddDoctorVisitReminderScreenType.updateReminder;

        } else {
            date = null;
            time = null;
            uuid = "";
            screenType = AddDoctorVisitReminderScreenType.newReminder;
        }

        let state = {
            doctorVisitDate: date,
            doctorVisitTime: time,
            uuid: uuid,
            screenType: screenType,
            doctorVisitDateError: "",
            doctorVisitTimeError: "",
        };

        this.state = state;
    };

    private setDateAndTIme = (value: Date, type: "date" | "time") => {
        if (type === "date") {
            this.setState({
                doctorVisitDate: DateTime.fromJSDate(value),
                doctorVisitDateError: "",
            });
        } else {
            this.setState({
                doctorVisitTime: DateTime.fromJSDate(value),
                doctorVisitTimeError: "",
            });
        };
    };

    private setReminder() {
        if (this.state.doctorVisitDate !== null && this.state.doctorVisitTime !== null) {

            let date = this.state.doctorVisitDate.toMillis();
            let time = this.state.doctorVisitTime.toMillis();
            let uuid = this.state.uuid;

            if (this.state.screenType === AddDoctorVisitReminderScreenType.newReminder) {
                userRealmStore.addReminder(date, time);
            } else {

                if (uuid) {
                    userRealmStore.updateReminder({ date, time, uuid });
                };
            };

            this.props.navigation.goBack();

        } else {
            if (this.state.doctorVisitDate === null) {
                this.setState({
                    doctorVisitDateError: translate('reminderDateError')
                });
            };

            if (this.state.doctorVisitTime === null) {
                this.setState({
                    doctorVisitTimeError: translate('reminderTimeError')
                });
            };
        }
    };

    render() {
        let date = this.state.doctorVisitDate ? this.state.doctorVisitDate.toJSDate() : undefined;
        let time = this.state.doctorVisitTime ? this.state.doctorVisitTime.toJSDate() : undefined;

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
                                <View style={{ flexDirection: 'row', alignContent: "center", marginBottom: 20, marginLeft: -10 }}>
                                    <Icon name="clock" style={{ fontSize: moderateScale(22), color: '#2BABEE' }} />
                                    <Typography style={{marginTop: -2, fontSize: moderateScale(16), marginRight: moderateScale(10), marginLeft: moderateScale(7)}}>{translate("examReminderDescription")}</Typography>
                                </View>
                                <View style={{marginBottom: 10}}>
                                    <DateTimePicker
                                        label={translate("examReminderDate")}
                                        onChange={(value) => this.setDateAndTIme(value, "date")}
                                        minimumDate={new Date()}
                                        // style={{ marginBottom: 20 }}
                                        style={this.state.doctorVisitDateError !== "" ? { borderColor: colorError, borderWidth: 1, borderRadius: 27 } : null}
                                        value={date}
                                    />
                                    {
                                        this.state.doctorVisitDateError !== "" ?
                                            <Typography style={{ color: colorError, fontSize: moderateScale(15) }}>{this.state.doctorVisitDateError}</Typography>
                                            : null
                                    }
                                </View>
                                <View style={{marginBottom: 30}}>
                                    <DateTimePicker
                                        type={DateTimePickerType.time}
                                        label={translate("examReminderTime")}
                                        onChange={(value) => this.setDateAndTIme(value, "time")}
                                        minimumDate={new Date()}
                                        value={time}
                                        style={this.state.doctorVisitTimeError !== "" ? { borderColor: colorError, borderWidth: 1, borderRadius: 27 } : null}
                                    />
                                    {
                                        this.state.doctorVisitTimeError !== "" ?
                                            <Typography style={{ color: colorError, fontSize: moderateScale(15) }}>{this.state.doctorVisitTimeError}</Typography>
                                            : null
                                    }
                                </View>
                            </View>


                            <View>
                                <RoundedButton
                                    text={translate("buttonAddExamReminder")}
                                    type={RoundedButtonType.purple}
                                    onPress={() => this.setReminder()}
                                />
                            </View>
                        </KeyboardAwareScrollView>
                    </>
                )}
            </ThemeConsumer>

        )
    }
}


enum AddDoctorVisitReminderScreenType {
    newReminder,
    updateReminder,
};

export interface AddDoctorVisitReminderScreenStyles {
    container: ViewStyle,
};

const styles = StyleSheet.create<AddDoctorVisitReminderScreenStyles>({
    container: {
        padding: scale(24),
        alignItems: 'stretch',
    }
});

