import React, { Fragment } from 'react';
import { View, StyleSheet, ViewStyle, StatusBar } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { WalkthroughBackground } from '../../components/WalkthroughBackground';
import { Typography, TypographyType } from '../../components/Typography';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton'
import { TextButton, TextButtonColor } from '../../components/TextButton'
import { Switch } from 'react-native-paper';
import { themes } from '../../themes/themes';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { dataRealmStore } from '../../stores';
import Orientation from 'react-native-orientation-locker';
import { ScrollView } from 'react-native-gesture-handler';

export interface WalkthroughScreenParams {
    /**
     * It goes form 0.
     */
    step: number;
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, WalkthroughScreenParams>;
}

export interface State {
    followGrowth: boolean;
    followDevelopment: boolean;
    followDoctorVisits: boolean;
}

export class WalkthroughScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        
        this.setDefaultScreenParams();
        this.initState();
    }

    public componentDidMount() {
        Orientation.lockToPortrait();
    }


    private setDefaultScreenParams() {
        let defaultScreenParams: WalkthroughScreenParams = {
            step: 0,
        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private initState() {
        const followGrowth = dataRealmStore.getVariable('followGrowth');
        const followDevelopment = dataRealmStore.getVariable('followDevelopment');
        const followDoctorVisits = dataRealmStore.getVariable('followDoctorVisits');

        let state: State = {
            followGrowth: followGrowth ? followGrowth : true,
            followDevelopment: followDevelopment ? followDevelopment : true,
            followDoctorVisits: followDoctorVisits ? followDoctorVisits : true,
        };

        this.state = state;
    }

    private onNextClick() {
        const screenParams = this.props.navigation.state.params!;

        let params: WalkthroughScreenParams = {
            step: screenParams.step + 1,
        };

        if (params.step < 5) {
            this.props.navigation.push('WalkthroughStackNavigator_WalkthroughScreen', params);
        } else {
            this.gotoTermsScreen();
        }
    }

    private onBackClick() {
        this.props.navigation.goBack();
    }

    private gotoTermsScreen() {
        this.props.navigation.navigate('WalkthroughStackNavigator_TermsScreen');
    };

    private onFollowGrowthChange() {
        this.setState((prevState) => {
            return {
                followGrowth: !prevState.followGrowth,
            };
        }, () => {
            dataRealmStore.setVariable('followGrowth', this.state.followGrowth);
        });
    }

    private onFollowDevelopmentChange() {
        this.setState((prevState) => {
            return {
                followDevelopment: !prevState.followDevelopment,
            };
        }, () => {
            dataRealmStore.setVariable('followDevelopment', this.state.followDevelopment);
        });
    }

    private onFollowDoctorVisitsChange() {
        this.setState((prevState) => {
            return {
                followDoctorVisits: !prevState.followDoctorVisits,
            };
        }, () => {
            dataRealmStore.setVariable('followDoctorVisits', this.state.followDoctorVisits);
        });
    }

    public render() {
        const screenParams = this.props.navigation.state.params!;

        return (
                <WalkthroughBackground type={screenParams.step}>
                    {/* STEP 0 */}
                    {screenParams.step === 0 ? (
                        <Fragment>
                            <StatusBar barStyle="dark-content" />

                            <Typography type={TypographyType.headingPrimary} style={{ width: scale(300), color: 'white', textAlign: 'center', fontSize: scale(23) }}>
                                {translate('walkthroughWelcome')}
                            </Typography>

                            <Typography type={TypographyType.bodyRegular} style={{ color: 'white', textAlign: 'center', fontSize: scale(15) }}>
                                {translate('walkthroughtParagraph')}
                            </Typography>

                            <View style={{ flex: 1, maxHeight: 30 }} />

                            <Typography type={TypographyType.bodyRegular} style={{ color: 'white', textAlign: 'center', fontSize: scale(15) }}>
                                {translate('walkthroughtParagraph2')}
                            </Typography>

                            <View style={{ flex: 1 }} />
                        </Fragment>
                    ) : null}

                    {/* STEP 1 */}
                    {screenParams.step === 1 ? (
                        <View style={{ flex: 0 }}>
                            <StatusBar barStyle="dark-content" />

                            <Typography type={TypographyType.headingPrimary} style={{ width: scale(300), color: '#262628', textAlign: 'center', fontSize: scale(23) }}>
                                {translate('walkthroughtScreen1Header')}

                            </Typography>

                            <Typography type={TypographyType.bodyRegular} style={{ color: '#262628', textAlign: 'center', fontSize: scale(15) }}>
                                {translate('walkthroughtScreen1Paragraph')}
                            </Typography>

                            <View style={{ flex: 1, maxHeight: 30 }} />

                            <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                <Switch
                                    value={this.state.followGrowth}
                                    color={themes.getCurrentTheme().theme.variables?.colors?.switchColor}
                                    onValueChange={() => { this.onFollowGrowthChange() }}
                                    style={{ marginRight: 20 }}
                                />
                                <Typography type={TypographyType.bodyRegular} style={{ flex: 1, color: '#262628', textAlign: 'left', fontSize: scale(15) }}>
                                    {translate('walkthroughtScreen1FolowGrowth')}
                                </Typography>
                            </View>

                            <View style={{ flex: 1 }} />
                        </View>
                    ) : null}

                    {/* STEP 2 */}
                    {screenParams.step === 2 ? (
                        <Fragment>
                            <StatusBar barStyle="dark-content" />

                            <Typography type={TypographyType.headingPrimary} style={{ width: scale(300), color: 'white', textAlign: 'center', fontSize: scale(23) }}>
                                {translate('walkthroughtScreen2Title')}
                            </Typography>

                            <Typography type={TypographyType.bodyRegular} style={{ color: 'white', textAlign: 'center', fontSize: scale(15) }}>
                            </Typography>

                            <View style={{ flex: 1, maxHeight: 30 }} />

                            <Typography type={TypographyType.bodyRegular} style={{ color: 'white', textAlign: 'center' }}>
                                {translate('walkthroughtScreen2Paragraph')}

                            </Typography>

                            <View style={{ flex: 1 }} />
                        </Fragment>
                    ) : null}

                    {/* STEP 3 */}
                    {screenParams.step === 3 ? (
                        <Fragment>
                            <StatusBar barStyle="dark-content" />

                            <Typography type={TypographyType.headingPrimary} style={{ width: scale(300), color: '#262628', textAlign: 'center', fontSize: scale(23) }}>
                                {translate('walkthroughtScreen3Title')}
                            </Typography>

                            <Typography type={TypographyType.bodyRegular} style={{ color: '#262628', textAlign: 'center', fontSize: scale(15), }}>
                                {translate('walkthroughtScreen3Paragraph')}
                            </Typography>

                            <View style={{ flex: 1, maxHeight: 30 }} />

                            <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                <Switch
                                    value={this.state.followDevelopment}
                                    color={themes.getCurrentTheme().theme.variables?.colors?.switchColor}
                                    onValueChange={() => { this.onFollowDevelopmentChange() }}
                                    style={{ marginRight: 20 }}
                                />
                                <Typography type={TypographyType.bodyRegular} style={{ flex: 1, color: '#262628', textAlign: 'left', fontSize: scale(15), }}>
                                    {translate('walkthroughtScreen3FolowDevelopment')}
                                </Typography>
                            </View>

                            <View style={{ flex: 1 }} />
                        </Fragment>
                    ) : null}

                    {/* STEP 4 */}
                    {screenParams.step === 4 ? (
                        <Fragment>
                            <StatusBar barStyle="dark-content" />

                            <Typography type={TypographyType.headingPrimary} style={{ width: scale(300), color: '#262628', textAlign: 'center', fontSize: scale(23) }}>
                                {translate('walkthroughtScreen4Title')}
                            </Typography>

                            <Typography type={TypographyType.bodyRegular} style={{ color: '#262628', textAlign: 'center', fontSize: scale(15) }}>
                                {translate('walkthroughtScreen4Paragraph')}
                            </Typography>

                            <View style={{ flex: 1, maxHeight: 30 }} />

                            <View style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                                <Switch
                                    value={this.state.followDoctorVisits}
                                    color={themes.getCurrentTheme().theme.variables?.colors?.switchColor}
                                    onValueChange={() => { this.onFollowDoctorVisitsChange() }}
                                    style={{ marginRight: 20 }}
                                />
                                <Typography type={TypographyType.bodyRegular} style={{ flex: 1, color: '#262628', textAlign: 'left', fontSize: scale(15) }}>
                                    {/* Želim da evidentiram posete doktoru i da me aplikacija podseća da unosim podatke */}
                                    {translate('walkthroughtScreen4DoctorVisit')}
                                </Typography>
                            </View>

                            <View style={{ flex: 1 }} />
                        </Fragment>
                    ) : null}
                    <View style={{ flex: 0, marginTop: scale(25), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        {screenParams.step !== 0 ? (
                            <TextButton style={{ width: 80 }} color={screenParams.step === 2 ? TextButtonColor.white : TextButtonColor.purple} onPress={() => { this.onBackClick() }}>
                                {translate('buttonBack')}
                            </TextButton>
                        ) : null}

                        <RoundedButton
                            text={translate('buttonNext') + ' >'}
                            type={RoundedButtonType.hollowPurple}
                            onPress={() => { this.onNextClick() }}
                            style={{ width: 150 }}
                        />
                    </View>
                </WalkthroughBackground>
        );
    }

}

export interface WalkthroughScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<WalkthroughScreenStyles>({
    container: {
        flex: 1,
    },
});
