import React, { Component } from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { scale } from 'react-native-size-matters';
import { HomeScreenParams } from '../home/HomeScreen';
import { translate } from '../../translations/translate';
import { OneVaccinations } from '../../components/vaccinations/oneVaccinations';
import { translateData } from '../../translationsData/translateData';
import { userRealmStore, ChildEntity } from '../../stores';
import { DataRealmConsumer } from '../../stores/DataRealmContext';
import { UserRealmConsumer, UserRealmContextValue } from '../../stores/UserRealmContext';
import { NewDoctorVisitScreenType } from './NewDoctorVisitScreen';
import { Typography, HomeMessages } from '../../components';
import { TypographyType } from '../../components/Typography';
import { Child } from '../home/ChildProfileScreen';
import { ChildEntitySchema } from '../../stores/ChildEntity';

export interface VaccinationScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, HomeScreenParams>,
}

export class VaccinationScreen extends Component<Props> {
    public constructor(props: Props) {
        super(props);

        this.setDefaultScreenParams();
    };

    private setDefaultScreenParams() {
        let defaultScreenParams: VaccinationScreenParams = {

        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        };
    };

    private getAllVaccinationsPeriods() {
        let periods = translateData('immunizationsPeriods');

        return periods;
    }

    private renderHomeMessage(userRealm: UserRealmContextValue) {
        let id = userRealmStore.getCurrentChild()?.uuid ? userRealmStore.getCurrentChild()?.uuid : "";
        let user = userRealm.realm?.objects<ChildEntity>(ChildEntitySchema.name).find(item => item.uuid === id);

        if (user?.birthDate) {
            return null
        } else {
            return (
                <HomeMessages showCloseButton={true}></HomeMessages>
            );
        };
    };

    render() {


        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }}
                        contentContainerStyle={styles.container}
                    >
                        <DataRealmConsumer>
                            {data => (
                                <UserRealmConsumer>
                                    {(user) => (
                                        <>
                                            <Typography type={TypographyType.headingPrimary}>{translate('vaccinationTitle')}</Typography>
                                            {this.renderHomeMessage(user)}

                                            {userRealmStore.getAllVaccinationPeriods().map((period, index) => {
                                                let isComplete = true;
                                                let isLastPeriod = false;

                                                period.vaccineList.forEach(vaccine => {
                                                    if (vaccine.complete === false) {
                                                        isComplete = false;
                                                        return
                                                    }
                                                });

                                                // remove verticalLine on last card
                                                if (index === userRealmStore.getAllVaccinationPeriods().length - 1) {
                                                    isLastPeriod = true;
                                                };

                                                return (
                                                    <OneVaccinations
                                                        title={period.title}
                                                        isBirthDayEntered={period.isBirthDayEntered}
                                                        isFeaturedPeriod={period.isFeaturedPeriod}
                                                        isCurrentPeriod={period.isCurrentPeriod}
                                                        isVaccinationComplete={isComplete}
                                                        isVerticalLineVisible={!isLastPeriod}
                                                        vaccineList={period.vaccineList}
                                                        doctorVisitBtn={() => this.props.navigation.navigate('HomeStackNavigator_NewDoctorVisitScreen', { screenType: NewDoctorVisitScreenType.Vaccination })}
                                                        reminderBtn={() => this.props.navigation.navigate('HomeStackNavigator_AddDoctorVisitReminderScreen')}
                                                    />
                                                )
                                            })}
                                        </>
                                    )}
                                </UserRealmConsumer>
                            )}
                        </DataRealmConsumer>

                    </ScrollView>
                )}
            </ThemeConsumer>
        )
    }
}

export interface VaccinationScreenStyles {
    container: ViewStyle
}

const styles = StyleSheet.create<VaccinationScreenStyles>({
    container: {
        padding: scale(24),
        alignItems: 'stretch',
    }
})

