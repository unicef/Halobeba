import React from 'react';
import { View, Text, StyleProp, ViewStyle, StyleSheet, ScrollView, Alert } from 'react-native';
import { ThemeContextValue, ThemeConsumer } from '../themes/ThemeContext';
import { translate } from '../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { navigation } from '../app/Navigators';
import { FancyButton, FancyButtonType, FancyButtonIconPosition } from "../components/FancyButton";
import { Typography, TypographyType } from "../components/Typography";
import { BorderlessButton } from "react-native-gesture-handler";
import { HomeScreenParams } from './home/HomeScreen';
import { DrawerActions } from 'react-navigation-drawer';
import { CategoryArticlesScreenParams } from './home/CategoryArticlesScreen';
import { dataRealmStore } from '../stores';
import { StackActions, NavigationActions } from 'react-navigation';

export interface Props {
    style?: StyleProp<ViewStyle>;
}

export class Drawer extends React.Component<Props> {
    static defaultProps: Props = {

    };

    constructor(props: Props) {
        super(props);
    }

    private gotoScreen(fancyButtonType: FancyButtonType) {
        navigation.navigate('HomeStackNavigator_HomeScreen');

        // Go to HomeScreen
        if (fancyButtonType === FancyButtonType.home) {
            // navigation.navigate('HomeStackNavigator_HomeScreen');
            navigation.dispatch(DrawerActions.closeDrawer());
        }

        // Go to CategoryArticlesScreen
        if (
            fancyButtonType === FancyButtonType.games ||
            fancyButtonType === FancyButtonType.health ||
            fancyButtonType === FancyButtonType.safety ||
            fancyButtonType === FancyButtonType.responsive ||
            fancyButtonType === FancyButtonType.parents ||
            fancyButtonType === FancyButtonType.food
        ) {
            let categoryId: number | null = null;
            let categoryName: string | null = null;

            if (fancyButtonType === FancyButtonType.games) categoryId = 55;
            if (fancyButtonType === FancyButtonType.health) categoryId = 2;
            if (fancyButtonType === FancyButtonType.safety) categoryId = 3;
            if (fancyButtonType === FancyButtonType.responsive) categoryId = 56;
            if (fancyButtonType === FancyButtonType.parents) categoryId = 4;
            if (fancyButtonType === FancyButtonType.food) categoryId = 1;

            if (categoryId) categoryName = dataRealmStore.getCategoryNameFromId(categoryId);
            if (categoryId && categoryName) {
                const params: CategoryArticlesScreenParams = {
                    categoryId: categoryId,
                    categoryName: categoryName,
                };
                navigation.navigate('HomeStackNavigator_CategoryArticlesScreen', params);
                navigation.dispatch(DrawerActions.closeDrawer());
            }
        }

        if (fancyButtonType === FancyButtonType.faq) {
            navigation.navigate('HomeStackNavigator_FaqScreenScreen');
            navigation.dispatch(DrawerActions.closeDrawer());
        }

        // Set notificationsApp
        const notificationsApp = dataRealmStore.getVariable('notificationsApp');

        if (fancyButtonType === FancyButtonType.growth) {
            const followGrowth = dataRealmStore.getVariable('followGrowth');
            
            if (notificationsApp && followGrowth) {
                navigation.navigate('HomeStackNavigator_GrowthScreen');
                navigation.dispatch(DrawerActions.closeDrawer());
            } else {
                Alert.alert(
                    translate('alertNoFunctionalityTitle'),
                    translate('alertNoFunctionalityBody'),
                    [
                        {   text: translate('alertNoFunctionalityGotoSettings'),
                            onPress:() => {
                                navigation.resetStackAndNavigate('RootModalStackNavigator_SettingsScreen');
                                navigation.dispatch(DrawerActions.closeDrawer());
                            }
                        },
                        {
                            text: translate('alertNoFunctionalityCancel'),
                            style: 'cancel',
                        }
                    ]
                );
            }
        }

        if(fancyButtonType === FancyButtonType.development){
            const followDevelopment = dataRealmStore.getVariable('followDevelopment');

            if (notificationsApp && followDevelopment) {
                navigation.navigate('HomeStackNavigator_DevelopmentScreen');
                navigation.dispatch(DrawerActions.closeDrawer())
            } else {
                Alert.alert(
                    translate('alertNoFunctionalityTitle'),
                    translate('alertNoFunctionalityBody'),
                    [
                        {   text: translate('alertNoFunctionalityGotoSettings'),
                            onPress:() => {
                                navigation.resetStackAndNavigate('RootModalStackNavigator_SettingsScreen');
                                navigation.dispatch(DrawerActions.closeDrawer());
                            }
                        },
                        {
                            text: translate('alertNoFunctionalityCancel'),
                            style: 'cancel',
                        }
                    ]
                );
            }
        }

        if (fancyButtonType === FancyButtonType.vaccination) {
            navigation.navigate('HomeStackNavigator_VaccinationScreen');
            navigation.dispatch(DrawerActions.closeDrawer());
        }

        if (fancyButtonType === FancyButtonType.doctor) {
            navigation.navigate('HomeStackNavigator_DoctorVisitsScreen');
            navigation.dispatch(DrawerActions.closeDrawer());
        }

        if (fancyButtonType === FancyButtonType.settings) {
            // navigation.navigate('HomeStackNavigator_SettingsScreen');
            navigation.resetStackAndNavigate('RootModalStackNavigator_SettingsScreen');
            navigation.dispatch(DrawerActions.closeDrawer());
        }

        if (fancyButtonType === FancyButtonType.aboutUs) {
            navigation.navigate('HomeStackNavigator_AboutScreen');
            navigation.dispatch(DrawerActions.closeDrawer());
        }

        // if (fancyButtonType === FancyButtonType.contact) {
        //     navigation.navigate('RootModalStackNavigator_StorybookScreen');
        //     navigation.dispatch(DrawerActions.closeDrawer());
        // }
    }

    private onClosePress() {
        navigation.goBack();
    }

    public render() {
        return (
            <ThemeConsumer>
            {(themeContext:ThemeContextValue) => (
                <ScrollView contentContainerStyle={ styles.contentContainer }>
                    {/* ARTICLES */}
                    <View style={{marginBottom:scale(5), flexDirection:'row', alignItems:'center'}}>
                        <Typography type={ TypographyType.headingPrimary } style={{flex:1, marginBottom:0}}>
                            {translate('drawerTitleArticles')}
                        </Typography>
                        <BorderlessButton onPress={() => {this.onClosePress()}}>
                            <Icon
                                name={ "close" }
                                style={{ fontSize:22, marginRight:scale(5)}}
                            />
                        </BorderlessButton>
                    </View>

                    <View style={{flexDirection:'row'}}>
                        <FancyButton type={ FancyButtonType.home } style={{flex:1}} onPress={ ()=>{this.gotoScreen(FancyButtonType.home)} } />
                    </View>

                    <View style={{flexDirection:'row'}}>
                        <FancyButton type={ FancyButtonType.games } style={{flex:1}} onPress={ ()=>{this.gotoScreen(FancyButtonType.games)} } />
                        <FancyButton type={ FancyButtonType.health } style={{flex:1}} onPress={ ()=>{this.gotoScreen(FancyButtonType.health)} } />
                    </View>
            
                    <View style={{flexDirection:'row'}}>
                        <FancyButton type={ FancyButtonType.safety } style={{flex:1}} onPress={ ()=>{this.gotoScreen(FancyButtonType.safety)} } />
                        <FancyButton type={ FancyButtonType.responsive } style={{flex:1}} onPress={ ()=>{this.gotoScreen(FancyButtonType.responsive)} } />
                    </View>
            
                    <View style={{flexDirection:'row'}}>
                        <FancyButton type={ FancyButtonType.parents } style={{flex:1}} onPress={ ()=>{this.gotoScreen(FancyButtonType.parents)} } />
                        <FancyButton type={ FancyButtonType.food } style={{flex:1}} onPress={ ()=>{this.gotoScreen(FancyButtonType.food)} } />
                    </View>

                    <FancyButton type={ FancyButtonType.faq } style={{flex:1}} onPress={ ()=>{this.gotoScreen(FancyButtonType.faq)} } />

                        {/* DIARY */}
                        <Typography type={TypographyType.headingPrimary} style={{ marginTop: scale(20), marginBottom: scale(5) }}>
                            {translate('drawerTitleGrowthDiary')}
                        </Typography>

                        <View style={{ flexDirection: 'row' }}>
                            <FancyButton type={FancyButtonType.growth} style={{ flex: 1 }} onPress={() => { this.gotoScreen(FancyButtonType.growth) }} />
                            <FancyButton type={FancyButtonType.development} style={{ flex: 1 }} onPress={() => { this.gotoScreen(FancyButtonType.development) }} />
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <FancyButton type={FancyButtonType.vaccination} style={{ flex: 1 }} onPress={() => { this.gotoScreen(FancyButtonType.vaccination) }} />
                            <FancyButton type={FancyButtonType.doctor} style={{ flex: 1 }} onPress={() => { this.gotoScreen(FancyButtonType.doctor) }} />
                        </View>

                        {/* APP RELATED BUTTONS  */}
                        <Typography type={TypographyType.headingPrimary} style={{ marginTop: scale(20), marginBottom: scale(5) }}>
                            {translate('appName')}
                        </Typography>

                        <View style={{ flexDirection: 'row' }}>
                            <FancyButton title={translate('drawerButtonAboutUs')} style={{ flex: 1 }} onPress={() => { this.gotoScreen(FancyButtonType.aboutUs) }} />
                            <FancyButton type={FancyButtonType.settings} iconPosition={FancyButtonIconPosition.left} style={{ flex: 1 }} onPress={() => { this.gotoScreen(FancyButtonType.settings) }} />
                            {/* <FancyButton title={translate('drawerButtonContact')} style={{ flex: 1 }} onPress={() => { this.gotoScreen(FancyButtonType.contact) }} /> */}
                        </View>
                    </ScrollView>
                )}
            </ThemeConsumer>
        );
    }
}

export interface DrawerStyles {
    contentContainer?: ViewStyle;
}

const styles = StyleSheet.create<DrawerStyles>({
    contentContainer: {
        padding: scale(15),
        backgroundColor: 'white',
    },
});
