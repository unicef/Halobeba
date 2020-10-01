import React, { Component } from 'react'
import { StyleSheet, ViewStyle, View } from 'react-native'
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { ScrollView } from 'react-native-gesture-handler';
import { ThemeConsumer, ThemeContextValue } from '../../themes/ThemeContext';
import { scale, moderateScale } from 'react-native-size-matters';
import { dataRealmStore, userRealmStore, ChildEntity } from '../../stores';
import { MilestoneForm, MilestoneItem } from '../../components/development/MilestoneForm';
import { Typography } from '../../components';
import { TypographyType } from '../../components/Typography';
import Icon from "react-native-vector-icons/FontAwesome";
import { DevelopmentInfo } from '../../components/development/DevelopmentInfo';
import { translate } from '../../translations';
import { DateTime } from 'luxon';
import { ChildEntitySchema } from '../../stores/ChildEntity';

export interface EditPeriodScreenParams {
    id: number,
    title: string,
    isCurrenPeriod: boolean,
    warningText: string,
    subtitle: string,
    onGoBack: Function
};


export interface Props {
    navigation: NavigationStackProp<NavigationStackState, EditPeriodScreenParams>,
};
export interface State {
    uncheckedMilestones: MilestoneItem[],
    checkedMilestones: MilestoneItem[],
    milestonesForCheck: MilestoneItem[],
};

export class EditPeriodScreen extends Component<Props, State> {
    public constructor(props: Props) {
        super(props);
        this.setDefaultScreenParams();
        this.initState();
    };

    private initState() {
        let id: number = 0;

        if (this.props.navigation.state.params?.id) {
            id = this.props.navigation.state.params.id
        }

        let milestones = dataRealmStore.getMilestonesForGivenPeriod(id);

        let state: State = {
            checkedMilestones: milestones.checkedMilestones,
            uncheckedMilestones: milestones.uncheckedMilestones,
            milestonesForCheck: [],
        };

        this.state = state;
    };

    private setDefaultScreenParams() {

        const childAge = userRealmStore.getCurrentChild()?.birthDate;
        let childAgeMonths = DateTime.local().diff(DateTime.fromJSDate(childAge ? childAge : new Date()), "months",).months;
        const childAgeTagId = dataRealmStore.getTagIdFromChildAge(parseInt(childAgeMonths.toString()) + 1);

        const age = childAgeTagId > 51 ? 51 : childAgeTagId;

        let currentPeriod = dataRealmStore.getDevelopmentPeriods().filter(item => item.childAgeTagId === age)[0];
  
        let defaultScreenParams: EditPeriodScreenParams = {
            id: 0,
            isCurrenPeriod: true,
            onGoBack: () => this.props.navigation.goBack(),
            subtitle: "",
            title: "",
            warningText: "",
        };
        
        if (currentPeriod !== undefined) {
            defaultScreenParams = {
                id: childAgeTagId,
                isCurrenPeriod: true,
                onGoBack: () => this.props.navigation.goBack(),
                subtitle: currentPeriod.subtilte,
                title: currentPeriod.title,
                warningText: currentPeriod.warningText ? currentPeriod.warningText : "",
            }
        }else{
            defaultScreenParams = {
                id: childAgeTagId,
                isCurrenPeriod: false,
                onGoBack: () => this.props.navigation.goBack(),
                subtitle: "",
                title: "",
                warningText: "",
            } 

            throw(new Error(
                `Error: EditPeriodScreen => current period je undefined childAgeTagId = ${age}, ChildAge = ${childAge}, currentPeriod = ${currentPeriod}`
            ));
        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        };
    };

    /*
    * Delete milestone from unchecked and push in checked milestones array
    */
    private filterItems() {
        let index = userRealmStore.getCurrentChild()?.uuid ? userRealmStore.getCurrentChild()?.uuid : "";
        let user = userRealmStore.realm?.objects<ChildEntity>(ChildEntitySchema.name).find(item => item.uuid === index);

        let milestones = user ? user.checkedMilestones : [];
        let milestonesIds: number[] = [];

        if (milestones) {
            milestonesIds = [...milestones];
            this.state.milestonesForCheck.map(item => {
                if (milestonesIds?.indexOf(item.id) === -1) {
                    milestonesIds.push(item.id);
                } else {
                    milestonesIds?.splice(milestonesIds.indexOf(item.id), 1);
                };
            });

        };

        return milestonesIds;
    };

    private onCheckBoxPress(id: number) {

        let uncheckedMilestones = this.state.uncheckedMilestones;

        uncheckedMilestones.forEach(item => {
            if (item.id === id) {
                item.checked = !item.checked
            };
        });

        this.setState({
            uncheckedMilestones: uncheckedMilestones,
            milestonesForCheck: uncheckedMilestones.filter(item => item.checked === true)
        });

    };

    private save() {

        let allCheckedMilestones = this.filterItems();

        let us = userRealmStore?.realm?.objects<ChildEntity>(ChildEntitySchema.name);
        let index = userRealmStore.getCurrentChild()?.uuid ? userRealmStore.getCurrentChild()?.uuid : "";

        us?.forEach(item => {
            if (item.uuid === index) {
                userRealmStore.realm?.write(() => {
                    item.checkedMilestones = allCheckedMilestones;
                });
            };
        });

        if (this.props.navigation.state?.params?.id) {
            let milestones = dataRealmStore.getMilestonesForGivenPeriod(this.props.navigation.state.params.id);

            this.setState({
                checkedMilestones: milestones.checkedMilestones,
                uncheckedMilestones: milestones.uncheckedMilestones,
            });
        };

        if (this.props.navigation.state.params?.onGoBack) {
            this.props.navigation.state.params.onGoBack();
        };
    };

    private renderIcon = () => {
        if (this.state.uncheckedMilestones.length === 0) {
            return "check-circle"
        } else {
            return "exclamation-circle"
        };
    };

    private iconColor = () => {
        if (this.state.uncheckedMilestones.length === 0) {
            return "#2CBA39"
        } else {
            if (this.props.navigation.state?.params?.isCurrenPeriod) {
                return "#2BABEE"
            } else {
                return "#EB4747"
            };
        };
    };

    render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={{ backgroundColor: 'white' }}
                        contentContainerStyle={styles.container}
                    >
                        <View style={{ padding: 20 }}>
                            <View style={styles.headerView}>
                                <Icon
                                    name={this.renderIcon()}
                                    style={[styles.iconStyle, { color: this.iconColor() }]}
                                />
                                <View >
                                    <Typography type={TypographyType.headingSecondary}>
                                        {this.props.navigation.state?.params?.title}
                                    </Typography>
                                    <Typography style={{ marginTop: -5, fontSize: moderateScale(18) }}>
                                        {this.props.navigation.state?.params?.subtitle}
                                    </Typography>
                                </View>
                            </View>
                            {
                                /* 
                                * Render all unchecked milestones
                                */
                                this.state.uncheckedMilestones.length !== 0 && (
                                    <MilestoneForm
                                        items={this.state.uncheckedMilestones}
                                        title={translate('abilitiesAndSkillsChildNeedToGet')}
                                        onCheckboxPressed={(id: number) => this.onCheckBoxPress(id)}
                                        roundedButton={{
                                            title: translate('accountSave'),
                                            onPress: () => this.save()
                                        }}
                                    />
                                )
                            }
                            {
                                /* 
                                * Render all checked milestones
                                */
                                this.state.checkedMilestones.length !== 0 && (
                                    <MilestoneForm
                                        title={translate('abilitiesAndSkillsChildAlreadGet')}
                                        items={this.state.checkedMilestones}
                                        onCheckboxPressed={() => { }}
                                    />
                                )
                            }
                        </View>
                        {
                            /* 
                            * Render warning text 
                            */
                            this.props.navigation.state?.params?.warningText &&
                            <DevelopmentInfo html={this.props.navigation.state.params.warningText} />
                        }
                    </ScrollView>
                )}
            </ThemeConsumer>
        );
    };
};



export interface EditPeriodScreenStyles {
    container: ViewStyle,
    iconStyle: ViewStyle,
    headerView: ViewStyle,
};

const styles = StyleSheet.create<EditPeriodScreenStyles>({
    container: {
        alignItems: 'stretch',
    },
    iconStyle: {
        marginRight: scale(10),
        marginTop: scale(3),
        fontSize: moderateScale(26),
        color: "#2CBA39",
    },
    headerView: {
        flexDirection: 'row',
        marginBottom: 24,
        paddingRight: 20
    }
});
