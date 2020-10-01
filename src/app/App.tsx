import React from 'react';
import { navigation, AppNavigationContainer } from './Navigators';
import { NavigationContainerComponent } from 'react-navigation';
import { YellowBox, Platform, UIManager, AppState } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider } from '../themes/ThemeContext';
import { googleAuth } from './googleAuth';
import { DataRealmProvider } from '../stores/DataRealmContext';
import { UserRealmProvider } from '../stores/UserRealmContext';
import { localize } from './localize';
// @ts-ignore
import { decode as atob, encode as btoa } from 'base-64';
import { apiStore, dataRealmConfig, dataRealmStore, userRealmStore } from '../stores';
import { initGlobalErrorHandler, sendErrorReportWithCrashlytics } from './errors';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '../components/ErrorFallback';
import { utils } from '.';
import crashlytics from '@react-native-firebase/crashlytics';
import SplashScreen from 'react-native-splash-screen'

// ADD GLOBAL POLYFILLS: atob, btoa
if (!(global as any).btoa) (global as any).btoa = btoa;
if (!(global as any).atob) (global as any).atob = atob;

// Warnings to ignore
YellowBox.ignoreWarnings([
    'Warning: ',
    'Require cycle',
    'Sending `onAnimatedValueUpdate` with no listeners registered',
    'Unable to find module for UIManager',

    // WebView with Vimeo: https://bit.ly/2YqNaR0
    'startLoadWithResult invoked',
    'Did not receive response to shouldStartLoad',

    // Lottie
    'ReactNative.NativeModules.LottieAnimationView',
]);

// Turn on layout animations on Android
if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

/**
 * First component to render.
 */
export class App extends React.Component<object> {
    constructor(props: object) {
        super(props);
    }

    public async componentDidMount() {
        SplashScreen.hide();

        userRealmStore.removeEmptyChild();
        // crashlytics().log(‘APP MOUNTED’);
        crashlytics().log('Updating user count.');
        AppState.addEventListener("change", state => {
            if (state === "active") {
                utils.logAnalitic("appHasOpened", {eventName: "appHasOpened"});
            } else if (state === "background") {
                console.log("BACKGROUND")
            } else if (state === "inactive") {
                utils.logAnalitic("ExitApp", {eventName: "ExitApp"})
            }
        });

        this.addItemsToDevMenu();
        googleAuth.configure();
        localize.setLocalesIfNotSet();
        this.initOnboarding();
        initGlobalErrorHandler();
    }

    private async initOnboarding() {
        const notificationsApp = dataRealmStore.getVariable('notificationsApp');
        const followGrowth = dataRealmStore.getVariable('followGrowth');
        const followDevelopment = dataRealmStore.getVariable('followDevelopment');
        const followDoctorVisits = dataRealmStore.getVariable('followDoctorVisits');

        if (notificationsApp === null) await dataRealmStore.setVariable('notificationsApp', true);
        if (followGrowth === null) await dataRealmStore.setVariable('followGrowth', true);
        if (followDevelopment === null) await dataRealmStore.setVariable('followDevelopment', true);
        if (followDoctorVisits === null) await dataRealmStore.setVariable('followDoctorVisits', true);
    };

    private addItemsToDevMenu() {
        if (__DEV__) {
            const DevMenu = require('react-native-dev-menu');
            DevMenu.addItem('Storybook', () => this.gotoStorybookScreen());
        }
    }

    private gotoStorybookScreen() {
        navigation.navigate('RootModalStackNavigator_StorybookScreen');
    };
    
    public render() {
        return (
            <ErrorBoundary FallbackComponent={ErrorFallback} onError={sendErrorReportWithCrashlytics}>
                <ThemeProvider>
                    <PaperProvider>
                        <DataRealmProvider>
                            <UserRealmProvider>
                                <AppNavigationContainer
                                    ref={(navigatorRef: NavigationContainerComponent) => {
                                        return navigation.setTopLevelNavigator(navigatorRef);
                                    }}
                                    onNavigationStateChange={(prevState, nextState) => {
                                        try {
                                            dataRealmStore.setVariable('prevNavigationState', JSON.stringify(prevState, null, 4));
                                            dataRealmStore.setVariable('nextNavigationState', JSON.stringify(nextState, null, 4));
                                        } catch (e) { }
                                    }}
                                />
                            </UserRealmProvider>
                        </DataRealmProvider>
                    </PaperProvider>
                </ThemeProvider>
            </ErrorBoundary>
        );
    }
}