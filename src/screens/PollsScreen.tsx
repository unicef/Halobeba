import React from 'react';
import { ViewStyle, Text, View, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../themes/ThemeContext';
import NetInfo from "@react-native-community/netinfo";
import { NavigationScreenConfigProps } from 'react-navigation';

// @ts-ignore
import WebView from 'react-native-webview';
import { GradientBackground, Typography, RoundedButton } from '../components';
import { TypographyType } from '../components/Typography';
import { dataRealmStore } from '../stores';
import { ActivityIndicator, Button, Dialog, Paragraph } from 'react-native-paper';
import { translate } from '../translations/translate'
import { moderateScale, scale } from 'react-native-size-matters';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';


export interface PollsScreenParams {
    showSearchInput?: boolean;
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, PollsScreenParams>;
}

export interface State {
    title: string,
    url: string,
    isFinished: boolean
}

/**
 * Describes who created the application.
 */
export class PollsScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.setDefaultScreenParams();
        this.initState();
    }
    public static navigationOptions = ({ navigation }: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState>>): NavigationStackOptions => {
        return {
            // API: https://bit.ly/2koKtOw
            headerTitle: "asdasdasdas",
        };
    };
    private initState() {

        const polls = this.props.navigation.state.params?.polls;

        let state: State = {
            title: "",
            url: "",
            isFinished: false,
        }

        if (polls) {
            const activePolls = polls

            state.title = activePolls.title;
            state.url = activePolls.link;
        };


        this.state = state;
    };

    private setDefaultScreenParams() {
        let defaultScreenParams: PollsScreenParams = {
            showSearchInput: false,
        };


        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private gotoBack() {
        this.props.navigation.goBack();
    }

    private async canPollsBeOpened() {
        const netInfo = await NetInfo.fetch();

        if (netInfo.isConnected && netInfo.isInternetReachable) {
            return true;
        } else {
            return false;
        }
    }

    private goBack() {
        this.props.navigation.goBack();
    }

    private onMessage() {
        this.setState({
            isFinished: true
        });

        let polls = this.props.navigation.state.params?.polls;

        if (polls) {
            let id = polls.id;
            let updated_at = polls.updated_at

            dataRealmStore.onPollFinished(id, updated_at)
        };

    };

    private loader() {
        let top = Dimensions.get('window').height / 2;
        return <ActivityIndicator size='large' style={{ top: -top }} />
    }

    public render() {
        if (!this.canPollsBeOpened()) {
            return (
                <View style={{ alignContent: 'stretch', alignItems: 'center', justifyContent: 'center', paddingTop: 50 }}>
                    <Typography style={{ textAlign: 'center', padding: 20 }} type={TypographyType.headingSecondary}>{translate('pollsNoInternet')}</Typography>
                </View>
            )
        }
        return (
            <>
                <KeyboardAvoidingView
                    style={{flex: 1}}
                    keyboardVerticalOffset={-500}
                    contentContainerStyle={{flex: 1}}
                    behavior="padding"
                    enabled={Platform.OS === "android"}
                >
                    <WebView
                        style={{ flex: 1 }}
                        renderLoading={this.loader}
                        startInLoadingState={true}
                        source={{
                            uri: this.state.url
                        }}

                        onMessage={() => this.onMessage()}
                    />
                </KeyboardAvoidingView>

                <Dialog visible={this.state.isFinished} style={{ backgroundColor: 'transparent' }}>
                    <View style={{ backgroundColor: "#6967E4", padding: scale(20), borderRadius: 10, marginTop: scale(-15) }}>
                        <View style={{ flexDirection: "row", }}>
                            <IconFontAwesome5
                                name="comments"
                                style={{ lineHeight: 25, color: 'white', fontSize: moderateScale(22), marginRight: scale(10) }}
                                solid={true}
                            />
                            <Paragraph style={{ fontSize: moderateScale(20), color: 'white', fontWeight: 'bold', lineHeight: 29, }}>
                                {translate("PollsSuccessMessage")}
                            </Paragraph>
                        </View>

                        <Button
                            style={{ marginTop: 10 }}
                            labelStyle={{ color: 'white' }}
                            onPress={() => this.goBack()}
                        >
                            {translate("PollsBack")}
                        </Button>
                    </View>
                </Dialog>
            </>
        );
    }

}

export interface PollsScreenStyles {
    container?: ViewStyle;
}

