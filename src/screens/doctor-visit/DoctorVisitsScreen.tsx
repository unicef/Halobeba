import React, { Component, Fragment } from 'react'
import { StyleSheet, ViewStyle, Text, View, TextStyle } from 'react-native'
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { scale } from 'react-native-size-matters';
import { HomeScreenParams } from '../home/HomeScreen';
import { translate } from '../../translations/translate';
import { Typography, TypographyType } from '../../components/Typography';
import { DoctorVisitCard, DoctorVisitTitleIconType, DoctorVisitCardItemIcon, DoctorVisitCardButtonType } from '../../components/doctor-visit/DoctorVisitCard';
import { DataRealmConsumer, DataRealmContextValue } from '../../stores/DataRealmContext';
import { UserRealmConsumer, UserRealmContextValue } from '../../stores/UserRealmContext';
import { HomeMessages } from '../../components/HomeMessages';
import { userRealmStore } from '../../stores/userRealmStore';

export interface DoctorVisitsScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, HomeScreenParams>;
}

export class DoctorVisitsScreen extends Component<Props> {
    public constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ backgroundColor: themeContext.theme.screenContainer?.backgroundColor }}
                        contentContainerStyle={styles.container}
                    >
                        {/* TITLE */}
                        <Typography type={TypographyType.headingPrimary} style={styles.title}>
                            {translate('doctorVisitsScreenTitle')}
                        </Typography>

                        <DataRealmConsumer>
                            {(dataRealmContext: DataRealmContextValue) => (
                                <UserRealmConsumer>
                                    {(userRealmContext: UserRealmContextValue) => (
                                        <Fragment>
                                            {/* HOME MESSAGES */}
                                            {!userRealmStore.getCurrentChild()?.birthDate ? (
                                                <HomeMessages showCloseButton={true}></HomeMessages>
                                            ) : null}

                                            {/* CARDS */}
                                            {userRealmStore.getDoctorVisitCards().map(cardProps => (
                                                <DoctorVisitCard {...cardProps} />
                                            ))}
                                        </Fragment>
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

export interface DoctorVisitsScreenStyles {
    container: ViewStyle;
    title: TextStyle;
}

const styles = StyleSheet.create<DoctorVisitsScreenStyles>({
    container: {
        padding: scale(14),
        alignItems: 'stretch',
    },

    title: {
        paddingHorizontal: scale(10),
    },
})

