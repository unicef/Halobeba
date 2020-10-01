import React, { Component } from 'react'
import { View, ViewStyle, StyleSheet, TextStyle } from 'react-native'
import { Typography, TypographyType } from '../Typography';
import { RoundedButton, RoundedButtonType } from '../RoundedButton';
import { translate } from '../../translations/translate';
import Icon from "react-native-vector-icons/FontAwesome";
import { scale, moderateScale } from 'react-native-size-matters';
import { IconProps } from 'react-native-paper/lib/typescript/src/components/MaterialCommunityIcon';
import { TextButton } from '..';
import { TextButtonColor } from '../TextButton';
import { dataRealmStore } from '../../stores';
import { StackActions } from 'react-navigation';
import { navigation } from '../../app';
import { DateTime } from 'luxon';

export interface Vaccine {
    complete: boolean,
    title: string,
    hardcodedArticleId: string,
    recivedDateMilis?: number | undefined,
    uuid: string,
}

export interface VaccinationPeriod {
    vaccinationDate?: string,
    title: string,
    isFeaturedPeriod?: boolean,
    isVaccinationComplete?: boolean,
    isVerticalLineVisible?: boolean,
    isCurrentPeriod?: boolean,
    vaccineList: Vaccine[],
    isBirthDayEntered: boolean,
    doctorVisitBtn?: Function,
    reminderBtn?: Function,
}

export interface Vaccination {

}

export interface State {
    isVaccinationComplete: boolean
}

export class OneVaccinations extends Component<VaccinationPeriod, State> {
    constructor(props: VaccinationPeriod) {
        super(props);
        this.initState()
    }

    private initState = () => {
        let vaccinationComplete = true;

        for (let i: number = 0; i < this.props.vaccineList.length; i++) {
            if (!this.props.vaccineList[i].complete) {
                vaccinationComplete = false;
                break;
            }
        }

        let state: State = {
            isVaccinationComplete: vaccinationComplete,
        }

        this.state = state;
    }

    private renderIcon = (complete: boolean | undefined) => {
        if (!this.props.isBirthDayEntered || this.props.isFeaturedPeriod) {
            return "circle"
        } else {
            if (complete) {
                return "check-circle"
            } else {
                return "exclamation-circle"
            }
        }
    }

    private renderIconStyle(complete: boolean) {
        if (!this.props.isBirthDayEntered || this.props.isFeaturedPeriod) {
            return [styles.dotIconStyle, { color: '#000000' }]
        } else {
            if (complete) {
                return [styles.iconStyle, { color: "#2CBA39" }]
            } else {
                return [styles.iconStyle, { color: "#EB4747" }]
            }
        }

    }

    private goToArticle(id: number) {

        if (id) {
            let article = dataRealmStore.getContentFromId(id);
            let category = dataRealmStore.getCategoryNameFromId(id);

            const pushAction = StackActions.push({
                routeName: 'HomeStackNavigator_ArticleScreen',
                params: {
                    article: article,
                    categoryName: category,
                },
            });

            navigation.dispatch(pushAction)
        };
    };

    private goToDoctorVisit() {
        if (this.props.doctorVisitBtn) {
            this.props.doctorVisitBtn()
        }
    }

    private goToRemminder() {
        if (this.props.reminderBtn) {
            this.props.reminderBtn()
        }
    }

    render() {
        return (
            <View>
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row' }}>
                        {
                            this.props.isBirthDayEntered && !this.props.isFeaturedPeriod && (
                                <Icon
                                    name={this.renderIcon(this.props.isVaccinationComplete)}
                                    style={[styles.iconStyle, { color: this.props.isVaccinationComplete ? "#2CBA39" : "#EB4747" }]}
                                />
                            )
                        }

                        <View style={{ flexDirection: "column" }}>
                            <Typography type={TypographyType.headingSecondary}>
                                {this.props.title}
                            </Typography>
                            <Typography type={TypographyType.headingSecondary} style={{fontSize: moderateScale(16), marginTop: -10}}>
                                {translate('vaccinationPeriodsSubtitle')}
                            </Typography>
                            {
                                this.props.vaccinationDate && (
                                    <Typography type={TypographyType.headingSecondary} style={styles.vaccineDateText}>
                                        {this.props.vaccinationDate}
                                    </Typography>
                                )
                            }
                        </View>
                    </View>

                    <View style={styles.vaccineContainer}>
                        <View style={{ flexDirection: 'column' }}>
                            {
                                this.props.vaccineList.map(item => {

                                    let date = "";

                                    if (item.recivedDateMilis) {
                                        date = ` - ${DateTime.fromMillis(item.recivedDateMilis).toLocaleString()}`;
                                    } else {
                                        date = "";
                                    }

                                    return (
                                        <View style={styles.vaccineItemContainer} >
                                            <View style={styles.vaccineItemHeader}>
                                                <Icon
                                                    name={this.renderIcon(item.complete)}
                                                    style={this.renderIconStyle(item.complete)}
                                                />
                                                <Typography style={styles.vaccineItemTitle} type={TypographyType.bodyRegular}>
                                                    {item.title + "" + date}
                                                </Typography>
                                            </View>
                                            <View style={styles.vaccineItemContent}>
                                                <TextButton
                                                    color={TextButtonColor.purple}
                                                    style={{ marginTop: scale(5), marginBottom: scale(10) }}
                                                    onPress={() => dataRealmStore.openArticleScreen(parseInt(item.hardcodedArticleId))}
                                                >
                                                    {translate('moreAboutDisease')}
                                                </TextButton>
                                            </View>
                                        </View>

                                    )
                                })
                            }

                            <View>

                            </View>
                        </View>
                    </View>
                    {
                        !this.props.isVaccinationComplete && this.props.isCurrentPeriod ?
                            <View >
                                <RoundedButton
                                    style={{ paddingLeft: moderateScale(20), marginTop: scale(10) }}
                                    type={RoundedButtonType.purple} text={translate('AddDataAboutVaccination')}
                                    showArrow={true}
                                    onPress={() => this.goToDoctorVisit()}
                                />
                                <RoundedButton
                                    type={RoundedButtonType.hollowPurple}
                                    text={translate('AddVaccinationReminder')}
                                    showArrow={true} style={styles.reminderBtn}
                                    onPress={() => this.goToRemminder()}
                                />
                            </View>
                            : null
                    }

                </View>
                {this.props.isVerticalLineVisible ? <View style={styles.verticalLine} /> : null}
            </View >
        )
    }
}


export interface OneVaccinationsStyles {
    [index: string]: ViewStyle | TextStyle,
    container: ViewStyle,
    vaccineContainer: ViewStyle,
    vaccineItemContainer: ViewStyle,
    vaccineItemHeader: ViewStyle,
    vaccineItemTitle: TextStyle,
    vaccineItemContent: ViewStyle,
    reminderBtn: ViewStyle,
    iconStyle: IconProps,
    verticalLine: ViewStyle,
    vaccineDateText: TextStyle,
    dotIconStyle: IconProps
}

const styles = StyleSheet.create<OneVaccinationsStyles>({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 3,
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2,
        padding: scale(16),
    },
    reminderBtn: {
        paddingLeft: moderateScale(20),
        marginTop: moderateScale(15),
        marginBottom: moderateScale(5)
    },
    vaccineContainer: {
        flexDirection: 'row',
        marginBottom: scale(-5),
    },
    vaccineItemContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 4
    },
    vaccineDateText: {
        marginTop: moderateScale(-5),
        fontSize: moderateScale(17),
        marginBottom: scale(24)
    },
    vaccineItemHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    vaccineItemTitle: {
        width: '90%',
        fontSize: moderateScale(16)
    },
    vaccineItemContent: {
        marginLeft: scale(33),
    },
    iconStyle: {
        marginRight: scale(15),
        marginTop: scale(3),
        fontSize: moderateScale(21),
        color: "#2CBA39",
        lineHeight: moderateScale(21),
    },
    dotIconStyle: {
        marginRight: scale(13),
        marginLeft: scale(10),
        marginTop: scale(3),
        fontSize: moderateScale(6),
        color: "#2CBA39",
        lineHeight: moderateScale(21),
    },
    verticalLine: {
        width: 3,
        height: moderateScale(24),
        backgroundColor: '#979797',
        borderWidth: 1.5,
        borderColor: '#979797',
        marginLeft: moderateScale(24)
    }
})