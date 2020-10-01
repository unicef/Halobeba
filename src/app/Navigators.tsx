import React from "react";
import { BackHandler, ScrollView, Text, View, Platform } from "react-native";
import { IconButton } from "react-native-paper";
import { moderateScale, scale } from "react-native-size-matters";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { createAppContainer, createSwitchNavigator, NavigationAction, NavigationActions, NavigationContainerComponent, NavigationScreenConfigProps, SafeAreaView, StackActions } from "react-navigation";
import { createDrawerNavigator, DrawerActions } from 'react-navigation-drawer';
import { createStackNavigator, NavigationStackOptions, NavigationStackProp, NavigationStackState } from "react-navigation-stack";
import { ProfileIcon } from "../components/ProfileIcon";
import { SearchInput, SearchInputSize } from "../components/SearchInput";
import { AddChildrenScreen } from "../screens/account/AddChildrenScreen";
import { AddParentsScreen } from "../screens/account/AddParentsScreen";
import { Drawer } from "../screens/Drawer";
import { CategoryArticlesScreen } from "../screens/home/CategoryArticlesScreen";
import { HomeScreen } from "../screens/home/HomeScreen";
import { LoginScreen } from "../screens/login/LoginScreen";
import { RegisterCreatedScreen } from "../screens/login/RegisterCreatedScreen";
import { RegisterScreen } from "../screens/login/RegisterScreen";
import { TermsScreen } from "../screens/login/TermsScreen";
import { WalkthroughScreen } from "../screens/login/WalkthroughScreen";
import { StorybookScreen } from "../screens/StorybookScreen";
import { SyncingScreen } from "../screens/SyncingScreen";
import { themes } from "../themes/themes";
import { translate } from '../translations/translate';
import { ArticleScreen } from "../screens/home/ArticleScreen";
import { SearchResultsScreen } from "../screens/home/SearchResultsScreen";
import { FaqScreen } from "../screens/home/FaqScreen";
import { FaqCategoryScreen } from "../screens/home/FaqCategoryScreen";
import { AboutScreen } from "../screens/AboutScreen";
import { SettingsScreen } from "../screens/home/SettingsScreen";
import { AppFeedbackScreen } from "../screens/home/AppFeedbackScreen";
import { VideoScreen } from "../screens/VideoScreen";
import { BirthDataScreen } from "../screens/home/BirthDataScreen";
import { ExaminationReminderScreen } from "../screens/home/ExaminationReminderScreen";
import { ChildProfileScreen } from "../screens/home/ChildProfileScreen";
import { GrowthScreen } from "../screens/growth/GrowthScreen";
import { NewMeasurementScreen } from "../screens/growth/NewMeasurementScreen";
import { VaccinationScreen, VaccinationDataScreen, DevelopmentScreen, EditPeriodScreen } from "../screens/home";
import { NewDoctorVisitScreen } from "../screens/vaccination/NewDoctorVisitScreen";
import { AllMeasurementsScreen } from "../screens/growth/AllMeasurementsScreen";
import { ChartFullScreen } from '../screens/growth/ChartFullScreen';
import { userRealmStore } from "../stores";
import RNFS from 'react-native-fs';
import { PrivacyPolocyScreen } from "../screens/login/PrivacyPolicyScreen";
import { utils } from "./utils";
import { ResetPasswordScreen } from "../screens/login";
import { UserRealmConsumer } from "../stores/UserRealmContext";
import { getFontScale } from "react-native-device-info";
import { DoctorVisitsScreen } from "../screens/doctor-visit/DoctorVisitsScreen";
import { AddDoctorVisitReminderScreen } from "../screens/vaccination/AddDoctorVisitReminderScreen";
import { PollsScreen } from "../screens/PollsScreen";

/**
* Use it to [navigate screens](https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html)
* from anywhere in the code.
*/
class Navigation {
    public navigator?: NavigationContainerComponent;
    private static instance: Navigation;

    private constructor() {
        // Back button handler
        BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackButtonPressAndroid
        );
    }

    static getInstance(): Navigation {
        if (!Navigation.instance) {
            Navigation.instance = new Navigation();
        }
        return Navigation.instance;
    }

    /**
     * Called from App.tsx
     */
    public setTopLevelNavigator(navigatorRef: NavigationContainerComponent) {
        this.navigator = navigatorRef;
    }

    /**
     * Send an action to the router.
     * 
     * Read [docs](https://bit.ly/33J1lBS)
     */
    public dispatch(action: NavigationAction) {
        this.navigator!.dispatch(action);
    }

    /**
     * Navigate to any route.
     */
    public navigate(routeName: string, params: any = {}) {
        this.navigator!.dispatch(
            NavigationActions.navigate({ routeName, params })
        );
    }

    /**
     * Unload all the screens from the stack, and open given route
     * as the first screen on the stack.
     */
    public resetStackAndNavigate(routeName: string, params: any = undefined) {
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName, params })],
        });

        this.dispatch(resetAction);
    }

    public goBack() {
        this.navigator!.dispatch(
            NavigationActions.back()
        );
    }

    private handleBackButtonPressAndroid() {
        return true;
    }
}

export const navigation = Navigation.getInstance();

const secondaryHomeNavigationOptions = {
    headerBackImage: function () {
        return (
            <Icon
                name={"chevron-left"}
                style={{ paddingLeft: 5, fontSize: 34, color: themes.getCurrentTheme().theme.variables?.colors?.headerBackButton }}
            />
        );
    },
    headerBackTitleVisible: false,
    headerLeft: undefined,
    headerTitle: undefined,
    headerStyle: {
        backgroundColor: themes.getCurrentTheme().theme.variables?.colors?.headerBackground,
    },
    headerTitleStyle: {
        color: themes.getCurrentTheme().theme.variables?.colors?.headerTitle,
        fontSize: scale(16),
    },
    headerRight: undefined,
};

const HomeStackNavigator = createStackNavigator({
    HomeStackNavigator_HomeScreen: {
        screen: HomeScreen,
        navigationOptions: {
            title: "Home"
        }
    },
    HomeStackNavigator_CategoryArticlesScreen: {
        screen: CategoryArticlesScreen,
        navigationOptions: {
            title: "Category"
        }
    },
    HomeStackNavigator_ArticleScreen: {
        screen: ArticleScreen,
        navigationOptions: {
            title: "Article"
        }
    },
    HomeStackNavigator_SearchResultsScreen: {
        screen: SearchResultsScreen,
        navigationOptions: {
            title: "Search results"
        }
    },
    HomeStackNavigator_TermsScreen: {
        screen: TermsScreen,
        navigationOptions: {

            title: translate('termsAndConditionsTitle'),
        }
    },
    HomeStackNavigator_FaqScreenScreen: {
        screen: FaqScreen,
        navigationOptions: {
            title: "FAQ"
        }
    },
    HomeStackNavigator_FaqCategoryScreen: {
        screen: FaqCategoryScreen,
        navigationOptions: {
            title: "FAQ"
        }
    },
    HomeStackNavigator_AboutScreen: {
        screen: AboutScreen,
        navigationOptions: ({ navigation }: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState, any>>): NavigationStackOptions => {
            return {
                title: translate('aboutUs').toUpperCase(),
                ...secondaryHomeNavigationOptions
            }
        }
    },

    HomeStackNavigator_AppFeedbackScreen: {
        screen: AppFeedbackScreen,
        navigationOptions: ({ navigation }: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState, any>>): NavigationStackOptions => {
            return {
                title: translate('appFeedbackHeaderTitle'),
                ...secondaryHomeNavigationOptions
            }
        }
    },
    HomeStackNavigator_BirthDataScreen: {
        screen: BirthDataScreen,
        navigationOptions: ({ navigation }: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState, any>>): NavigationStackOptions => {
            return {
                title: translate('birthDataTitle'),
                ...secondaryHomeNavigationOptions
            }
        }
    },
    HomeStackNavigator_ExaminationReminderScreen: {
        screen: ExaminationReminderScreen,
        navigationOptions: ({ navigation }: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState, any>>): NavigationStackOptions => {
            return {
                title: translate('examReminderTitle'),
                ...secondaryHomeNavigationOptions
            }
        }
    },
    HomeStackNavigator_ChildProfileScreen: {
        screen: ChildProfileScreen,
        navigationOptions: ({ navigation }: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState, any>>): NavigationStackOptions => {
            return {
                title: translate('childProfileTitle'),
                ...secondaryHomeNavigationOptions
            }
        }
    },
    HomeStackNavigator_GrowthScreen: {
        screen: GrowthScreen,
        navigationOptions: {
            title: translate('growScreenTitle')
        }
    },

    HomeStackNavigator_DevelopmentScreen: {
        screen: DevelopmentScreen,
        navigationOptions: {
            title: translate('childDevelopmentTitle')
        }
    },

    HomeStackNavigator_EditPeriodScreen: {
        screen: EditPeriodScreen,
        navigationOptions: ({ navigation }: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState, any>>): NavigationStackOptions => {
            return {
                title: translate('questionnaireAboutChildDevelopment'),
                ...secondaryHomeNavigationOptions
            }
        }
    },

    HomeStackNavigator_NewMeasurementScreen: {
        screen: NewMeasurementScreen,
        navigationOptions: ({ navigation }: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState, any>>): NavigationStackOptions => {
            return {
                title: translate('newMeasureScreenTitle'),
                ...secondaryHomeNavigationOptions
            }
        }
    },

    HomeStackNavigator_PollsScreen: {
        screen: PollsScreen,
        navigationOptions: ({ navigation }: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState, any>>): NavigationStackOptions => {
            return {
                title: navigation.state.params?.title ? navigation.state.params?.title : "",
                ...secondaryHomeNavigationOptions

            }
        },
    },

    HomeStackNavigator_AllMeasurementScreen: {
        screen: AllMeasurementsScreen,
        navigationOptions: ({ navigation }: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState, any>>): NavigationStackOptions => {
            return {
                title: translate('allMeasurements'),
                ...secondaryHomeNavigationOptions
            }
        }
    },

    HomeStackNavigator_VaccinationScreen: {
        screen: VaccinationScreen,
        navigationOptions: {
            title: 'aaa'
        }
    },

    HomeStackNavigator_NewDoctorVisitScreen: {
        screen: NewDoctorVisitScreen,
        navigationOptions: ({ navigation }: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState, any>>): NavigationStackOptions => {
            return {
                title: translate('NewDoctorVisitScreenTitle'),
                ...secondaryHomeNavigationOptions
            }
        }
    },
    HomeStackNavigator_AddDoctorVisitReminderScreen: {
        screen: AddDoctorVisitReminderScreen,
        navigationOptions: ({ navigation }: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState, any>>): NavigationStackOptions => {
            return {
                title: translate('NewDoctorVisitScreenTitle'),
                ...secondaryHomeNavigationOptions
            }
        }
    },
    HomeStackNavigator_VaccinationDataScreen: {
        screen: VaccinationDataScreen,
        navigationOptions: ({ navigation }: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState, any>>): NavigationStackOptions => {
            return {
                title: "Podaci sa vakcinacije 3.mesec",
                ...secondaryHomeNavigationOptions
            }
        }
    },

    HomeStackNavigator_DoctorVisitsScreen: {
        screen: DoctorVisitsScreen
    },

}, {
    defaultNavigationOptions: ({ navigation }: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState, any>>): NavigationStackOptions => {
        function toggleSearchInput() {
            const screenParams = navigation.state.params!;
            navigation.setParams({ showSearchInput: !screenParams.showSearchInput });
        }

        function onMenuIconPress() {
            navigation.dispatch(DrawerActions.toggleDrawer());
        }

        function onSubmitEditing(value: string) {
            if (value.length >= 3) {
                navigation.navigate('HomeStackNavigator_SearchResultsScreen', {
                    searchTerm: value,
                    showSearchInput: true,
                });

                setTimeout(() => {
                    navigation.state.params.searchTerm = '';
                    navigation.state.params.showSearchInput = false;
                }, 1000);
            }
        }

        function openBirthDataScreen() {
            // navigation.navigate('HomeStackNavigator_BirthDataScreen');
            navigation.navigate('HomeStackNavigator_ChildProfileScreen')
        }

        return {
            // API: https://bit.ly/2koKtOw
            headerLeft: () => (
                <IconButton
                    icon="menu"
                    color={themes.getCurrentTheme().theme.variables?.colors?.headerIcon}
                    size={moderateScale(25)}
                    onPress={() => { onMenuIconPress() }}
                />
            ),
            headerTitle: () => {
                const screenParams = navigation.state.params!;
                let headerTitle: JSX.Element | null = null;

                if (!screenParams.showSearchInput) {
                    headerTitle = (<Text onLongPress={(event) => { throw (new Error('Example error')) }} style={themes.getCurrentTheme().theme.headerTitle}>{translate('appName')}</Text>);
                }

                return headerTitle;
            },
            headerRightContainerStyle: { width: '80%' },
            headerRight: () => {
                const screenParams = navigation.state.params!;
                let images: null | object = null;

                const currentChild = userRealmStore.getCurrentChild();

                if (currentChild) {
                    if (currentChild.photoUri) {
                        const finalUri = utils.addPrefixForAndroidPaths(`${RNFS.DocumentDirectoryPath}/${currentChild.photoUri}`);
                        images = { image: finalUri };
                    }
                }

                return (
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingRight: moderateScale(10) }}>
                        {(screenParams && screenParams.showSearchInput) ? (
                            <View style={{ width: '100%', paddingLeft: scale(15), paddingRight: scale(15) }}>
                                <SearchInput
                                    value={screenParams.searchTerm}
                                    placeholder={translate('enterSearchTerm')}
                                    style={{ width: '100%' }}
                                    size={SearchInputSize.small}
                                    alwaysShowClear={true}
                                    onClearPress={() => { toggleSearchInput() }}
                                    onSubmitEditing={(value) => { onSubmitEditing(value) }}
                                />
                            </View>
                        ) : (
                                <IconButton
                                    icon="magnify"
                                    color={themes.getCurrentTheme().theme.variables?.colors?.headerIcon}
                                    size={moderateScale(25)}
                                    onPress={() => { toggleSearchInput() }}
                                />
                            )}
                        <UserRealmConsumer>
                            {(user) => (
                                <ProfileIcon onPress={openBirthDataScreen} {...images} />
                            )}
                        </UserRealmConsumer>
                    </View>
                );
            },
        };
    }
});

const DrawerSwitchNavigator = createSwitchNavigator({
    HomeStackNavigator: {
        screen: HomeStackNavigator
    }
}, {
    navigationOptions: {
        title: "Home"
    }
});

const LoginStackNavigator = createStackNavigator({
    LoginStackNavigator_LoginScreen: {
        screen: LoginScreen,
        navigationOptions: {
            title: "Tab 01"
        }
    },
    LoginStackNavigator_RegisterScreen: {
        screen: RegisterScreen,
        navigationOptions: {
            title: "Tab 02"
        }
    },
    LoginStackNavigator_ResetPasswordScreen: {
        screen: ResetPasswordScreen,
        navigationOptions: {
            title: "Tab 03"
        }
    }
}, {
    headerMode: "none"
});

const WalkthroughStackNavigator = createStackNavigator({
    WalkthroughStackNavigator_WalkthroughScreen: {
        screen: WalkthroughScreen,
        navigationOptions: {
            // title: "Title"
        }
    },
    WalkthroughStackNavigator_TermsScreen: {
        screen: TermsScreen,
        navigationOptions: {
            // title: "Title"
        }
    }
}, {
    headerMode: "none"
});

const AccountStackNavigator = createStackNavigator({
    AccountStackNavigator_AddChildrenScreen: {
        screen: AddChildrenScreen,
        navigationOptions: {
            title: "Title",
            headerShown: false
        }
    },
    AccountStackNavigator_AddParentsScreen: {
        screen: AddParentsScreen,
        navigationOptions: {
            title: "Title",
            headerBackTitleVisible: false,
            headerBackImage: function (props) {
                // misha
                return (
                    <Icon
                        name={"chevron-left"}
                        style={{ paddingLeft: 5, fontSize: 34, color: themes.getCurrentTheme().theme.variables?.colors?.headerBackButton }}
                    />
                );
            },
            headerStyle: {
                backgroundColor: themes.getCurrentTheme().theme.variables?.colors?.headerBackground,
            },
            headerTitleStyle: {
                color: themes.getCurrentTheme().theme.variables?.colors?.headerTitle
            }
        }
    }
}, {
    initialRouteName: "AccountStackNavigator_AddChildrenScreen"
});

const DrawerNavigator = createDrawerNavigator({
    DrawerSwitchNavigator: {
        screen: DrawerSwitchNavigator
    }
}, {
    // @ts-ignore
    drawerWidth: "100%",
    contentComponent: function (props) {
        return (
            <ScrollView>
                <SafeAreaView style={{ flex: 1 }} forceInset={{ top: 'always', horizontal: 'never' }}>
                    <Drawer />
                </SafeAreaView>
            </ScrollView>
        );
    }
});

const RootModalStackNavigator = createStackNavigator({
    LoginStackNavigator: {
        screen: LoginStackNavigator
    },
    WalkthroughStackNavigator: {
        screen: WalkthroughStackNavigator
    },
    AccountStackNavigator: {
        screen: AccountStackNavigator
    },
    RootModalStackNavigator_RegisterCreatedScreen: {
        screen: RegisterCreatedScreen,
        navigationOptions: {
            title: "Title"
        }
    },
    RootModalStackNavigator_StorybookScreen: {
        screen: StorybookScreen,
        navigationOptions: {
            title: "Title"
        }
    },
    RootModalStackNavigator_SyncingScreen: {
        screen: SyncingScreen,
        navigationOptions: {
            title: "Title"
        }
    },
    RootModalStackNavigator_PrivacyPolicyScreen: {
        screen: PrivacyPolocyScreen,
        navigationOptions: ({ navigation }: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState, any>>): NavigationStackOptions => {
            return {
                title: translate('termsAndConditionsTitle'),
                ...secondaryHomeNavigationOptions
            }
        }
    },
    RootModalStackNavigator_VideoScreen: {
        screen: VideoScreen,
        navigationOptions: {
            title: "Video"
        }
    },
    RootModalStackNavigator_SettingsScreen: {
        screen: SettingsScreen,
        // navigationOptions: ({ navigation }: NavigationScreenConfigProps<NavigationStackProp<NavigationStackState, any>>): NavigationStackOptions => {
        //     return {
        //         title: translate('settingsTitle'),
        //         ...secondaryHomeNavigationOptions
        //     }
        // }
    },
    RootModalStackNavigator_ChartFullScreen: {
        screen: ChartFullScreen,
        navigationOptions: {
            title: "Video"
        }
    },
    DrawerNavigator: {
        screen: DrawerNavigator
    }
}, {
    navigationOptions: {
        headerBackTitle: null
    },
    mode: "modal",
    headerMode: "none",
    initialRouteName: "RootModalStackNavigator_SyncingScreen"
});

export const AppNavigationContainer = createAppContainer(RootModalStackNavigator);
