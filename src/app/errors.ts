import { Linking, Alert, Platform, Dimensions } from "react-native";
import { dataRealmStore, userRealmStore } from "../stores";
import { UserRealmContextValue } from "../stores/UserRealmContext";
import { navigation } from "./Navigators";
import DeviceInfo from 'react-native-device-info';
import NetInfo from "@react-native-community/netinfo";

/**
 * Redefines global error handler.
 */
export function initGlobalErrorHandler() {
    // During development, RN doesn't crash the app when error happens.
    // It shows the LogBox, and we will not change that.
    if (__DEV__) {
        return;
    }

    // In production, RN will crash the app on error, and we don't want that.
    ErrorUtils.setGlobalHandler((error: any, isFatal?: boolean) => {
        // Log error to Firebase Crashlytics
        sendErrorReportWithCrashlytics(error);

        // Give user an option to send bug report
        Alert.alert(
            'ERROR',
            'SEND REPORT TO BYTEOUT',
            [
                { text: 'Ok', onPress: () => { sendErrorReportWithEmail(error) } },
                { text: 'Cancel', style: 'cancel', },
            ],
        );
    });
}

export async function sendErrorReportWithEmail(error: any, componentStack?: string) {
    const unknownError = new UnknownError(error);

    const mailSubject = `HaloBeba bug report`;

    // Message
    let mailBody = `ERROR:\n${unknownError.name}: ${unknownError.message}\n\n`;

    // Device
    try {
        mailBody += `DEVICE:
OS: ${Platform.OS} (${DeviceInfo.getSystemVersion()})
App version: ${DeviceInfo.getVersion()}
Build number: ${DeviceInfo.getBuildNumber()}
Screen size: ${Math.round(Dimensions.get('window').width)} / ${Math.round(Dimensions.get('window').height)}
Bundle ID: ${DeviceInfo.getBundleId()}
Manufecturer: ${await DeviceInfo.getManufacturer()}
Brand: ${DeviceInfo.getBrand()}
Model: ${DeviceInfo.getModel()}
Device: ${await DeviceInfo.getDevice()}
Device name: ${await DeviceInfo.getDeviceName()}
Device ID: ${DeviceInfo.getDeviceId()}
Device type: ${DeviceInfo.getDeviceType()}
\n`;
    } catch (e) { }

    // Network status
    try {
        const netInfo = await NetInfo.fetch();
        mailBody += `NETWORK:
Phone can connect to net: ${netInfo.isConnected}
Is net reachable by the app: ${netInfo.isInternetReachable}
Type: ${netInfo.type}
Details: ${JSON.stringify(netInfo.details, null, 4)}\n\n`
    } catch (e) { }

    // Data realm variables
    try {
        if (dataRealmStore && dataRealmStore.realm && !dataRealmStore.realm.isClosed) {
            const prevNavigationState = dataRealmStore.getVariable('prevNavigationState');
            const nextNavigationState = dataRealmStore.getVariable('nextNavigationState');

            const dataRealmVariables = {
                'countryCode': dataRealmStore.getVariable('countryCode'),
                'currentActiveChildId': dataRealmStore.getVariable('currentActiveChildId'),
                'languageCode': dataRealmStore.getVariable('languageCode'),
                'lastSyncTimestamp': dataRealmStore.getVariable('lastSyncTimestamp'),
                'loginMethod': dataRealmStore.getVariable('loginMethod'),
                'userEmail': dataRealmStore.getVariable('userEmail'),
                'prevNavigationState': JSON.parse(prevNavigationState ? prevNavigationState : ''),
                'nextNavigationState': JSON.parse(nextNavigationState ? nextNavigationState : ''),
                'lastDataSyncError': dataRealmStore.getVariable('lastDataSyncError'),
                'syncDataReport': dataRealmStore.getVariable('syncDataReport'),
            };

            mailBody += 'DATA REALM VARIABLES:\n' + JSON.stringify(dataRealmVariables, null, 4) + '\n\n';
        }
    } catch (e) { };

    // User realm variables
    try {
        if (userRealmStore && userRealmStore.realm && !userRealmStore.realm.isClosed) {
            const userRealmVariables = {
                'userData': userRealmStore.getVariable('userData'),
                'userChildren': userRealmStore.getVariable('userChildren'),
                'checkedMilestones': userRealmStore.getVariable('checkedMilestones'),
            };

            mailBody += 'USER REALM VARIABLES:\n' + JSON.stringify(userRealmVariables, null, 4) + '\n\n';
        }
    } catch (e) { }

    // Children
    try {
        let allChildren = userRealmStore.getAllChildren();
        mailBody += `CHILDREN:\n${JSON.stringify(allChildren, null, 4)}\n\n`;
    } catch (e) { }

    // Stack
    try {
        mailBody += (unknownError.stack ? 'ERROR STACK:\n' + unknownError.stack + '\n\n' : 'Please describe error here\n\n');
    } catch (e) { }

    // Component stack
    if (componentStack) {
        mailBody += `COMPONENT ERROR STACK:\n${componentStack}\n\n`;
    }

    const mailUrl = `mailto:anastasia@byteout.com,milos.ciganovic@byteout.com,misha@byteout.com?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`;

    // console.log(mailBody);
    Linking.openURL(mailUrl);
}

export function sendErrorReportWithCrashlytics(error: any, componentStack?: string) {
    const unknownError = new UnknownError(error);
}

// GENERAL ERRORS
export class UnknownError extends Error {
    constructor(error: any) {
        let message = '';

        if (typeof error === 'string') {
            message = error;
        } else if (typeof error === 'number') {
            message = error + '';
        } else if (error instanceof Error) {
            message = error.message;
        } else {
            message = JSON.stringify(error, null, 4);
        };

        super(message);

        if (error instanceof Error) {
            this.name = error.name;
            this.stack = error.stack;
        }
    }
};