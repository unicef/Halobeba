import { navigation } from './Navigators';
import { dataRealmStore, ContentEntity } from '../stores';
import SendSMS, { AndroidSuccessTypes } from 'react-native-sms'
import URLParser from 'url';
import RNFS from 'react-native-fs';
import { appConfig } from './appConfig';
import analytics from '@react-native-firebase/analytics';
import { Platform } from 'react-native';
import { ContentEntitySchema } from '../stores/ContentEntity';

/**
 * Various utils methods.
 */
class Utils {
    private static instance: Utils;

    private constructor() { }

    static getInstance(): Utils {
        if (!Utils.instance) {
            Utils.instance = new Utils();
        }
        return Utils.instance;
    }

    public logAnalitic(eventName: string, payload: object) {
        let send = true;
        let allowAnonymousUsage = dataRealmStore.getVariable('allowAnonymousUsage');
        if (eventName === "onParentGenderSave" || eventName === "onChildAgeSave" ||
            eventName === "onAdditionalChildEntered" || eventName === "onChildGenderSave") {
            if (allowAnonymousUsage === null) {
                send = false;
            } else {
                send = allowAnonymousUsage;
            };
        }else {
            send = true;
        };
        if (send) {
            analytics().logEvent(eventName, {
                ...payload
            });
        } else {
            // if allow anonimus usage === false
            if (appConfig.showLog) {
                console.log("allowUsage je false")
            }
        };
    };

    /**
     * When app opens, there is an order of screens that should open,
     * before the home screen is finally opened.
     */
    public gotoNextScreenOnAppOpen() {
        // Flags
        const userIsLoggedIn = dataRealmStore.getVariable('userIsLoggedIn');
        const userIsOnboarded = dataRealmStore.getVariable('userIsOnboarded');
        const userEnteredChildData = dataRealmStore.getVariable('userEnteredChildData');
        const userParentalRole = dataRealmStore.getVariable('userParentalRole');

        // Set routeName
        let routeName: string | null = 'LoginStackNavigator';

        if (userIsLoggedIn) {
            if (!userIsOnboarded) {
                routeName = 'WalkthroughStackNavigator';
            } else if (!userEnteredChildData || !userParentalRole) {
                routeName = 'AccountStackNavigator';
            } else if (userIsLoggedIn && userIsOnboarded && userEnteredChildData && userParentalRole) {
                routeName = 'DrawerNavigator'; // Contains home screen
            }
        }

        // Navigate
        if (routeName) {
            navigation.resetStackAndNavigate(routeName);
        }
    }

    public sendSms(text: string) {
        SendSMS.send({
            body: text,
            // @ts-ignore
            successTypes: ['sent', 'queued'],
            allowAndroidSendWithoutReadPermission: true
        }, (completed: boolean, cancelled: boolean, error: boolean) => {
            console.log('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
        });
    }

    public getExtensionFromUrl(url: string): string | null {
        let rval: string | null = null;

        let parsedUrl = URLParser.parse(url);

        if (parsedUrl?.pathname) {
            let parts = parsedUrl.pathname.split('.');
            if (parts.length > 1) {
                rval = parts[parts.length - 1].toLowerCase();

                // ext must not have / in it
                let re = new RegExp('/');
                let match = rval.match(re);
                if (match) {
                    rval = null;
                }
            }
        }

        return rval;
    }

    public randomizeArray(arr: any[]) {
        var currentIndex = arr.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = arr[currentIndex];
            arr[currentIndex] = arr[randomIndex];
            arr[randomIndex] = temporaryValue;
        }

        return arr;
    }

    /**
    * email validator
    */
    public emailValidator(email: string): boolean {
        const re = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return re.test(email)
    }

    /**
     * Get YouTube video ID from given url.
     */
    public getYoutubeId(url: string): string {
        let rval: string = url;

        // https://www.youtube.com/watch?v=LjkSW_j6-hA
        if (url.indexOf('youtu.be') === -1) {
            let re = new RegExp('v=([^&]+)', 'img');
            let result = re.exec(url)

            if (result && result[1]) {
                rval = result[1];
            }
        }

        // https://youtu.be/uMcgJR8ESRc
        if (url.indexOf('youtu.be') !== -1) {
            let re = new RegExp('youtu.be/([^?]+)', 'img');
            let result = re.exec(url)

            if (result && result[1]) {
                rval = result[1];
            }
        }

        return rval;
    }

    /**
     * Get Vimeo video ID from given url.
     * 
     * url = https://vimeo.com/277586602?foo=bar
     */
    public getVimeoId(url: string): string {
        let rval: string = url;

        let re = new RegExp('vimeo.com/([0-9]+)[^0-9]*', 'img');
        let result = re.exec(url)

        if (result && result[1]) {
            rval = result[1];
        }

        return rval;
    }

    public setMyDebbugTxt(text: string) {
        var path = RNFS.DocumentDirectoryPath + '/my_debug.txt';
        RNFS.writeFile(path, text);
    }

    public async waitMilliseconds(milliseconds: number): Promise<string> {
        return new Promise((resolve, reject) => {
            setTimeout(() => { resolve('success') }, milliseconds);
        });
    }

    public upperCaseFirstLetter(text: string): string {
        return text && text.length > 0 ? text.charAt(0).toUpperCase() + text.slice(1) : text;
    }

    /**
     * File paths on Android must start with file://, so add that prefix if needed.
     */
    public addPrefixForAndroidPaths(path: string): string {
        let finalPath = path;
        
        if (finalPath && Platform.OS === 'android') {
            let re = new RegExp('^file:');
            let match = finalPath.match(re);
            if (!match) {
                finalPath = 'file://' + finalPath;
            };
        };

        return finalPath;
    }

    /**
     * App can be opened only if API data was downloaded.
     */
    public canAppBeOpened(): boolean {
        let rval = false;

        try {
            const lastSyncTimestamp = dataRealmStore.getVariable('lastSyncTimestamp');
            const numberOfContentItems = dataRealmStore.realm?.objects<ContentEntity>(ContentEntitySchema.name).length;

            if (numberOfContentItems && numberOfContentItems > 0 && lastSyncTimestamp) {
                rval = true;
            }
        } catch(e) {}

        return rval;
    }
}

export const utils = Utils.getInstance();