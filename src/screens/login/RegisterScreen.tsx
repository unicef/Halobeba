import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ViewStyle, StatusBar } from 'react-native';
import { NavigationSwitchProp, NavigationState } from 'react-navigation';
import { translate } from '../../translations';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { GradientBackground } from '../../components/GradientBackground';
import { RoundedTextInput } from '../../components/RoundedTextInput';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import { TextButton, TextButtonSize } from '../../components/TextButton';
import { apiStore, } from '../../stores';
import { DrupalRegisterArgs, } from '../../stores/apiStore';
import { Snackbar } from 'react-native-paper';
import { themes } from '../../themes';
import { utils } from '../../app';
import NetInfo from "@react-native-community/netinfo";

export interface Props {
    navigation: NavigationSwitchProp<NavigationState>;
}

export interface State {
    firstName: string,
    lastName: string,
    mail: string,
    password: string,
    passwordRepeat: string,
    snackBarMessage: string,
    isSnackBarVisible: boolean,
}

/**
 * User can register new account with our server here.
 */
export class RegisterScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.initState()
    }

    private initState() {
        const state: State = {
            firstName: "",
            lastName: "",
            mail: "",
            password: "",
            passwordRepeat: "",
            snackBarMessage: "",
            isSnackBarVisible: false,
        }

        this.state = state;
    }

    private gotoLoginScreen() {
        this.props.navigation.navigate('LoginStackNavigator_LoginScreen');
    };

    private dataValidation(): boolean {
        let isValid = true;

        let { firstName, lastName, mail, passwordRepeat, password } = this.state;
        mail = mail.trim();

        if (firstName === "" || lastName === "" || mail === "" || password === "" || passwordRepeat === "") {
            this.setState({
                snackBarMessage: translate('allFieldsMustBeFilled'),
                isSnackBarVisible: true,
            })
            return false
        }

        if (!utils.emailValidator(mail)) {
            this.setState({
                snackBarMessage: translate('notValidEmail'),
                isSnackBarVisible: true,
            })
            return false
        }

        if (password.length < 6) {
            this.setState({
                snackBarMessage: translate('passwordToShort'),
                isSnackBarVisible: true,
            });
            return false
        }

        if (password.length >= 6 && password !== passwordRepeat) {
            this.setState({
                snackBarMessage: translate('passwordDosntMatch'),
                isSnackBarVisible: true,
            });
            return false
        }


        return isValid;
    }

    private async createAccount() {
        let { firstName, lastName, mail, password } = this.state;
        mail = mail.trim();
        
        const netInfo = await NetInfo.fetch();

        if(!netInfo.isConnected || !netInfo.isInternetReachable){
            this.setState({
                isSnackBarVisible: true,
                snackBarMessage: translate('appCantOpen'),
            });

            return;
        }


        let userRegisterResponse: boolean =  false;

        if (this.dataValidation()) {
            const body: DrupalRegisterArgs = {
                field_first_name: firstName,
                field_last_name: lastName,
                mail: mail,
                password: password,
                name: mail,
            }

            try {
                userRegisterResponse = await apiStore.drupalRegister(body)
            } catch (rejectError) { }

            if (userRegisterResponse) {
                utils.logAnalitic("userHasRegistered", {eventName: "userHasRegistered"});
                this.gotoRegisterCreatedScreen(mail, password);
            } else {
                this.setState({
                    snackBarMessage: translate('userAlreadyExist'),
                    isSnackBarVisible: true,
                })
            }
        }
    }

    private gotoRegisterCreatedScreen(email: string, password: string) {
        this.props.navigation.navigate('RootModalStackNavigator_RegisterCreatedScreen', { email: email, password: password });
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
                        {/* INPUT: name */}
                        <RoundedTextInput
                            label={translate('fieldLabelName')}
                            icon="account-outline"
                            onChange={(value) => { this.setState({ firstName: value }) }}
                            onFocus={() => { }}
                            style={{ marginBottom: 15 }}
                        />

                        {/* INPUT: surname */}
                        <RoundedTextInput
                            label={translate('fieldLabelSurname')}
                            icon="account-outline"
                            onChange={(value) => { this.setState({ lastName: value }) }}
                            onFocus={() => { }}
                            style={{ marginBottom: 15 }}
                        />

                        {/* INPUT: email */}
                        <RoundedTextInput
                            label={translate('fieldLabelEmail')}
                            icon="email-outline"
                            onChange={(value) => { this.setState({ mail: value }) }}
                            onFocus={() => { }}
                            style={{ marginBottom: 15 }}
                        />

                        {/* INPUT: password */}
                        <RoundedTextInput
                            label={translate('fieldLabelPassword')}
                            icon="lock-outline"
                            onChange={(value) => { this.setState({ password: value }) }}
                            onFocus={() => { }}
                            style={{ marginBottom: 15 }}
                            secureTextEntry={true}

                        />

                        {/* INPUT: repeatPassword */}
                        <RoundedTextInput
                            label={translate('fieldLabelRepeatPassword')}
                            icon="lock-outline"
                            onChange={(value) => { this.setState({ passwordRepeat: value }) }}
                            onFocus={() => { }}
                            style={{ marginBottom: 15 }}
                            secureTextEntry={true}

                        />

                        {/* BUTTON: createAccount */}
                        <RoundedButton
                            text={translate('createAccount')}
                            type={RoundedButtonType.purple}
                            onPress={() => { this.createAccount() }}
                            style={{ marginTop: 15, marginBottom: 25 }}
                        />

                        {/* BUTTON: alreadyHaveAccount */}
                        <TextButton size={TextButtonSize.normal} textStyle={{ color: 'white', textAlign: 'center' }} onPress={() => { this.gotoLoginScreen() }}>
                            {translate('alreadyHaveAccount')}
                        </TextButton>

                        <View style={{ height: 40 }}></View>
                    </KeyboardAwareScrollView>
                    <Snackbar
                        visible={this.state.isSnackBarVisible}
                        duration={Snackbar.DURATION_SHORT}
                        onDismiss={() => { this.setState({ isSnackBarVisible: false }) }}
                        theme={{ colors: { onSurface: snackbarErrorStyle?.backgroundColor, accent: snackbarErrorStyle?.actionButtonColor } }}
                        action={{
                            label: 'Ok',
                            onPress: () => {
                                this.setState({ isSnackBarVisible: false });
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

export interface RegisterScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<RegisterScreenStyles>({
    container: {
        flex: 1,
    },
});
