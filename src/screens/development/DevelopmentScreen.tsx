import React, { Component } from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { scale } from 'react-native-size-matters';
import { HomeScreenParams } from '../home/HomeScreen';
import { translate } from '../../translations/translate';
import { dataRealmStore, userRealmStore, ChildEntity } from '../../stores';
import { MilestoneCard } from '../../components/development/MilestoneCard';
import { navigation, utils } from '../../app';
import { RoundedButtonType } from '../../components/RoundedButton';
import { StackActions } from 'react-navigation';
import { DevelopmentPeriodsType } from '../../stores/dataRealmStore';
import { DataRealmConsumer, DataRealmContextValue } from '../../stores/DataRealmContext';
import { UserRealmConsumer, UserRealmContextValue } from '../../stores/UserRealmContext';
import { HomeMessages } from '../../components';
import { ChildEntitySchema } from '../../stores/ChildEntity';

export interface DevelopmentScreenParams {

};

export interface State {
    data: DevelopmentPeriodsType[],
    childBirthDate: Date | null
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, HomeScreenParams>,
};

export class DevelopmentScreen extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.initState();
        utils.logAnalitic("mainMenuItemClick", {eventName: "mainMenuItemClick", screen: "Development"})
        this.setDefaultScreenParams();
    };

    private initState() {
        let childBirthDate = userRealmStore.getCurrentChild()?.birthDate;

        let state: State = {
            data: [],
            childBirthDate: childBirthDate ? childBirthDate : null
        }

        this.state = state;
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: DevelopmentScreenParams = {

        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        };
    };

    private goToPeriodMilestones(id: number, title: string, subtitle: string, isCurrenPeriod: boolean, warningText: string) {
        navigation.navigate('HomeStackNavigator_EditPeriodScreen', {
            id: id,
            title: title,
            isCurrenPeriod: isCurrenPeriod,
            warningText: warningText,
            subtitle: subtitle,
            onGoBack: () => this.forceUpdate(),
        });
    };

    private goToPeriodArticle(id: number) {
        let article = dataRealmStore.getContentFromId(id);
        let categoryName = dataRealmStore.getCategoryNameFromId(id);

        const pushAction = StackActions.push({
            routeName: 'HomeStackNavigator_ArticleScreen',
            params: {
                article: article,
                categoryName: categoryName,
            },
        });


        this.props.navigation.dispatch(pushAction);
    };

    private roundedButtonProperty(completed: boolean | undefined, isCurrentPeriod: boolean) {
        let buttonText: string = "";
        let buttonType: RoundedButtonType = RoundedButtonType.purple;

        if (completed) {
            buttonText = translate('viewQuestionnaire');
            buttonType = RoundedButtonType.hollowPurple;
        } else {
            buttonType = RoundedButtonType.purple;
            if (isCurrentPeriod) {
                buttonText = translate('fillQuestionnaire');
            } else {
                buttonText = translate('updateQuestionnaire');
            };
        };

        return {
            buttonText,
            buttonType,
        };
    };

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
                        {
                            this.state.childBirthDate === null ?
                                <DataRealmConsumer>
                                    {(dataRealmContext: DataRealmContextValue) => (
                                        <UserRealmConsumer>
                                            {(userRealmContext: UserRealmContextValue) => (
                                                this.renderHomeMessage(userRealmContext)
                                            )}
                                        </UserRealmConsumer>
                                    )}
                                </DataRealmConsumer> : null
                        }
                        <DataRealmConsumer>
                            {(dataRealmContext: DataRealmContextValue) => {
                                return (
                                    dataRealmStore.getDevelopmentPeriods().map(item => (
                                        <View style={{ marginTop: 20 }}>
                                            <MilestoneCard
                                                title={item.title}
                                                completed={item.finished}
                                                isCurrentPeriod={item.currentPeriod}
                                                subTitle={item.subtilte}
                                                html={item.body}
                                                roundedButton={item.finished !== undefined ? {
                                                    onPress: () => this.goToPeriodMilestones(
                                                        item.childAgeTagId ? item.childAgeTagId : 0,
                                                        item.title,
                                                        item.subtilte,
                                                        item.currentPeriod,
                                                        item.warningText || "",
                                                    ),
                                                    title: this.roundedButtonProperty(item.finished, item.currentPeriod).buttonText,
                                                    roundedButtonType: this.roundedButtonProperty(item.finished, item.currentPeriod).buttonType
                                                } : null}
                                                textButton={{
                                                    title: translate('moreAboutDevelopmentPeriod'),
                                                    onPress: () => this.goToPeriodArticle(item.relatedArticleId)
                                                }} />
                                        </View>
                                    )))
                            }}
                        </DataRealmConsumer>
                    </ScrollView>
                )}
            </ThemeConsumer>
        );
    };
};

export interface DevelopmentScreenStyles {
    container: ViewStyle
};

const styles = StyleSheet.create<DevelopmentScreenStyles>({
    container: {
        padding: scale(24),
        alignItems: 'stretch',
    }
});

