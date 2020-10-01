import React, { Fragment } from 'react';
import { SafeAreaView, View, Text, Image, StyleSheet, ViewStyle, StatusBar, Dimensions } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Checkbox } from 'react-native-paper';
import { themes } from '../../themes/themes';
import { Typography, TypographyType } from '../../components/Typography';
import { RoundedButton, RoundedButtonType, RoundedButtonStyles } from '../../components/RoundedButton';
import { dataRealmStore } from '../../stores';
import { utils } from '../../app';
// @ts-ignore
import HTML from 'react-native-render-html';
import { TextButton } from '../../components';
import { TextButtonColor } from '../../components/TextButton';
export interface TermsScreenParams {
    showSearchInput?: boolean;
    hideCheckboxes?: boolean;
    showBackButton?: boolean;
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, TermsScreenParams>;
}

export interface State {
    checkPrivateData: boolean;
    checkOtherConditions: boolean;
    checkAnonDataAccess: boolean;
    title: string;
    body: string;
};

/**
 * Terms and conditions screen.
 */
export class TermsScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.setDefaultScreenParams();
        this.initState();
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: TermsScreenParams = {
            showSearchInput: false,
            hideCheckboxes: false,
            showBackButton: false,

        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private initState() {
        let allowAnonymousUsage = dataRealmStore.getVariable('allowAnonymousUsage');
        
        let termsPageDate = dataRealmStore.getBasicPage(4836);


        if (allowAnonymousUsage === null) {
            allowAnonymousUsage = true;
            dataRealmStore.setVariable('allowAnonymousUsage', true);
        }

        if (termsPageDate) {
            let state: State = {
                checkPrivateData: false,
                checkOtherConditions: false,
                checkAnonDataAccess: allowAnonymousUsage,
                title: termsPageDate?.title,
                body: termsPageDate?.body,
            };

            this.state = state;
        };
    };

    private onAcceptButtonClick() {
        dataRealmStore.setVariable('userIsOnboarded', true);
        utils.gotoNextScreenOnAppOpen();
    }

    private gotoAddChildrenScreen() {
        this.props.navigation.navigate('AccountStackNavigator_AddChildrenScreen');
    };

    private gotoBack() {
        this.props.navigation.goBack();
    }

    private onAnonDataAccessPress() {
        this.setState((prevState) => {
            return {
                checkAnonDataAccess: !prevState.checkAnonDataAccess,
            };
        }, () => {
            dataRealmStore.setVariable('allowAnonymousUsage', this.state.checkAnonDataAccess);
        });
    }

    public render() {
        let colors = themes.getCurrentTheme().theme.variables?.colors;
        const screenParams = this.props.navigation.state.params!;

        return (
            <SafeAreaView style={[styles.container]}>
                <StatusBar barStyle="dark-content" />
                <View style={styles.innerContainer}>
                    {/* GO BACK */}
                    {/* <TextButton style={{marginLeft:scale(15), padding:0}} icon="chevron-left" iconStyle={{color:'#AA40BF'}} textStyle={{fontSize:scale(16)}} color={TextButtonColor.purple} onPress={ () => {this.gotoBack()} }>
                        {translate('buttonBack')}
                    </TextButton>

                    <View style={{height:scale(15)}} /> */}

                    <Typography type={TypographyType.headingPrimary} style={{ textAlign: 'center' }}>
                        {this.state.title}
                    </Typography>

                    <ScrollView contentContainerStyle={{ padding: scale(24), }}>
                        {/* FI  RST PARAGRAPH & IMAGE */}
                        {/* <View style={{flexDirection:"row"}}>
                            <Typography type={ TypographyType.bodyRegular } style={{flex:1, textAlign:'left'}}>
                                Sve informacije i saveti služe isključivo u edukativne svrhe.
                            </Typography>

                            <Image
                                source={ require('../../themes/assets/terms.png') }
                                style={{ width:scale(110), aspectRatio:1.2 }}
                                resizeMode="cover"
                            />
                        </View> */}

                        {/* OTHER PARAGRAPHS */}
                        <HTML
                            html={this.state.body}
                            baseFontStyle={{ fontSize: scale(18) }}
                            tagsStyles={htmlStyles}
                            imagesMaxWidth={Dimensions.get('window').width}
                            staticContentMaxWidth={Dimensions.get('window').width}
                        />

                        {/* CHECKBOXES */}
                        {!screenParams.hideCheckboxes ? (
                            <Fragment>
                                <View style={{ marginTop: scale(20), paddingRight: scale(40) }}>

                                    {/* checkPrivateData */}
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Checkbox.Android
                                            status={this.state.checkPrivateData ? 'checked' : 'unchecked'}
                                            onPress={() => { this.setState({ checkPrivateData: !this.state.checkPrivateData }); }}
                                            color={colors?.checkboxColor}
                                        />
                                        <TouchableWithoutFeedback style={{ padding: 5 }} onPress={() => { this.setState({ checkPrivateData: !this.state.checkPrivateData }); }}>
                                            <Typography type={TypographyType.bodyRegular} style={{ flex: 1, textAlign: 'left', marginLeft: scale(5) }}>
                                                {translate('termsAndConditionsCheckBox')}
                                            </Typography>
                                        </TouchableWithoutFeedback>
                                    </View>

                                    {/* checkOtherConditions */}
                                    <View style={{ flexDirection: 'row', marginTop: scale(14), alignItems: 'center' }}>
                                        <Checkbox.Android
                                            status={this.state.checkOtherConditions ? 'checked' : 'unchecked'}
                                            onPress={() => { this.setState({ checkOtherConditions: !this.state.checkOtherConditions }); }}
                                            color={colors?.checkboxColor}
                                        />
                                        <View style={{ flex: 1, }}>
                                            <Typography type={TypographyType.bodyRegular} style={{ textAlign: 'left', marginLeft: scale(5) }}>
                                                {translate('privacyPolicyCheckBox')}
                                                <Text style={{fontWeight: "bold"}} onPress={() => this.props.navigation.navigate('RootModalStackNavigator_PrivacyPolicyScreen')}> {translate('privacyPolicyLinkText')}</Text>
                                            </Typography>
                                        </View>
                                    </View>

                                    {/* checkAnonDataAccess */}
                                    <View style={{ flexDirection: 'row', marginTop: scale(14), alignItems: 'center',  }}>
                                        <Checkbox.Android
                                            status={this.state.checkAnonDataAccess ? 'checked' : 'unchecked'}
                                            onPress={() => { this.onAnonDataAccessPress() }}
                                            color={colors?.checkboxColor}
                                        />
                                        <TouchableWithoutFeedback style={{ padding: 5 }} onPress={() => { this.onAnonDataAccessPress() }}>
                                            <Typography type={TypographyType.bodyRegular} style={{ flex: 1, textAlign: 'left', marginLeft: scale(5) }}>
                                                {translate('dataUsageCheckbox')}
                                            </Typography>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>

                                {/* ACCEPT BUTTON */}
                                <RoundedButton
                                    text={translate('acceptTermsAndConditions')}
                                    disabled={this.state.checkPrivateData && this.state.checkOtherConditions ? false : true}
                                    type={RoundedButtonType.purple}
                                    onPress={() => { this.onAcceptButtonClick() }}
                                    style={{ marginTop: scale(20) }}
                                />
                            </Fragment>
                        ) : null}
                    </ScrollView>
                </View>
            </SafeAreaView>
        );
    }

}

export interface TermsScreenStyles {
    container?: ViewStyle;
    innerContainer?: ViewStyle;
}
const htmlStyles = {
    p: { marginBottom: 15 },
    ol: { display: 'flex', flexDirection: "column" },
    li: { width: '100%' },
    a: { fontWeight: 'bold', textDecorationLine: 'none' },
    blockquote: { backgroundColor: '#F0F1FF', padding: scale(15) },
};
const styles = StyleSheet.create<TermsScreenStyles>({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    innerContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: 'white',
        paddingTop: scale(24),
    },
});
