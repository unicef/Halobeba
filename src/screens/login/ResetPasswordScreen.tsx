import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ViewStyle, StatusBar, Alert } from 'react-native';
import { NavigationSwitchProp, NavigationState } from 'react-navigation';
import { translate } from '../../translations';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { GradientBackground } from '../../components/GradientBackground';
import { RoundedTextInput } from '../../components/RoundedTextInput';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import { TextButton, TextButtonSize } from '../../components/TextButton';
import { apiStore, } from '../../stores';
import { Snackbar } from 'react-native-paper';
import { themes } from '../../themes';
import { utils, navigation } from '../../app';

export interface Props {
    navigation: NavigationSwitchProp<NavigationState>;
}

export interface State {
    email: string,
    snackBarVisible: boolean,
    snackBarMessage: string,
}

/**
 * User can register new account with our server here.
 */
export class ResetPasswordScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.initState()
    }

    private initState() {
        const state: State = {
            email: "",
            snackBarVisible: false,
            snackBarMessage: "",
        }

        this.state = state;
    }

    private async resetPassword() {
        const { email } = this.state;

        if (this.state.email === "") {
            this.setState({
                snackBarVisible: true,
                snackBarMessage: translate('resetPasswordEmailEmpty')
            });
        } else {
            if (utils.emailValidator(email)) {
                const resetPassword = await apiStore.resetPassword(email);
                if (resetPassword) {
                    Alert.alert(translate('resetPasswordSuccess'), "", [{ text: translate('resetPasswordGoBack'), onPress: () => navigation.navigate('LoginStackNavigator_LoginScreen') }])
                } else {
                    this.setState({
                        snackBarVisible: true,
                        snackBarMessage: translate('resetPasswordWrongEmail')
                    });
                };
            };
        };
    };

    public render() {

        const snackbarErrorStyle = themes.getCurrentTheme().theme.snackbarError;

        return (
            <GradientBackground>
                <StatusBar
                    barStyle="light-content"
                />
                <SafeAreaView style={[styles.container]}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps='always'
                        style={{ borderWidth: 0, borderColor: 'red' }} contentContainerStyle={{ borderWidth: 0, borderColor: 'green', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', margin: 30 }}
                    >
                        {/* INPUT: email */}
                        <RoundedTextInput
                            label={translate('fieldLabelEmail')}
                            icon="email-outline"
                            onChange={(value) => { this.setState({ email: value }) }}
                            onFocus={() => { }}
                            style={{ marginBottom: 15 }}
                        />

                        {/* BUTTON: resetPassword */}
                        <RoundedButton
                            text={translate('resetPasswordBtn')}
                            type={RoundedButtonType.purple}
                            onPress={() => { this.resetPassword() }}
                            style={{ marginTop: 15, marginBottom: 25 }}
                        />

                        {/* BUTTON: alreadyHaveAccount */}
                        <TextButton size={TextButtonSize.normal} textStyle={{ color: 'white', textAlign: 'center' }} onPress={() => { this.props.navigation.navigate("LoginStackNavigator_LoginScreen") }}>
                            {translate('resetPasswordGoBack')}
                        </TextButton>

                        <View style={{ height: 40 }}></View>
                    </KeyboardAwareScrollView>
                    <Snackbar
                        visible={this.state.snackBarVisible}
                        duration={Snackbar.DURATION_SHORT}
                        onDismiss={() => { this.setState({ snackBarVisible: false }) }}
                        theme={{ colors: { onSurface: snackbarErrorStyle?.backgroundColor, accent: snackbarErrorStyle?.actionButtonColor } }}
                        action={{
                            label: 'Ok',
                            onPress: () => {
                                this.setState({ snackBarVisible: false });
                            },
                        }}
                    >
                        <Text style={{ fontSize: snackbarErrorStyle?.fontSize }}>
                            {this.state.snackBarMessage}
                        </Text>
                    </Snackbar>
                </SafeAreaView>
            </GradientBackground>
        );
    }

}

export interface ResetPasswordScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<ResetPasswordScreenStyles>({
    container: {
        flex: 1,
    },
});
