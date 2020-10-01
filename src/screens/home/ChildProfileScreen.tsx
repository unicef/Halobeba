import React, { Fragment } from 'react';
import { View, Text, Image, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { translate } from '../../translations/translate';
import { scale, moderateScale } from 'react-native-size-matters';
import { KeyboardAwareScrollView as ScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Typography, TypographyType } from '../../components/Typography';
import { TextButton, TextButtonColor } from '../../components/TextButton';
import { RoundedTextInput } from '../../components/RoundedTextInput';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import FastImage from 'react-native-fast-image';
import { ChildGender, ChildEntity, ChildEntitySchema } from '../../stores/ChildEntity';
import { userRealmStore, dataRealmStore } from '../../stores';
import { UserRealmConsumer, UserRealmContextValue } from '../../stores/UserRealmContext';
import { RadioButtons } from '../../components';
import { Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ScreenTypes } from '../account/AddChildrenScreen';

export interface ChildProfileScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, ChildProfileScreenParams>;
}

export interface State {
    parentRole: "mother" | "father",
    parentName: string,
    isSnackbarVisible: boolean
}

export class ChildProfileScreen extends React.Component<Props, State> {

    public constructor(props: Props) {
        super(props);
        this.setDefaultScreenParams();
        this.initState();
    };

    private initState() {

        let parentRole = dataRealmStore.getVariable('userParentalRole');
        let parentName = dataRealmStore.getVariable('userName');

        if (parentRole && parentName) {
            let state: State = {
                parentName: parentName,
                parentRole: parentRole,
                isSnackbarVisible: false,
            };

            this.state = state;
        };
    };

    private setDefaultScreenParams() {
        let defaultScreenParams: ChildProfileScreenParams = {

        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        };
    };

    private gotoBack() {
        this.props.navigation.goBack();
    };

    private setActiveChildId(id: string) {
        dataRealmStore.setVariable('currentActiveChildId', id);
        this.props.navigation.goBack();
    };

    private onParentNameChange(value: string) {
        this.setState({
            parentName: value
        });
    };

    private changeParentData() {
        if (this.state.parentName !== "") {
            dataRealmStore.setVariable('userParentalRole', this.state.parentRole);
            dataRealmStore.setVariable('userName', this.state.parentName);
            this.props.navigation.goBack();
        } else {
            this.setState({
                isSnackbarVisible: true,
            });
        };
    };

    private goToChildScreen(screnType: ScreenTypes, id?: string) {
        let screenParam = {
            screenParam: "",
            id: "",
            previousScreen: "ChildProfileScreen"
        };

        if (screnType === "EditChild") {
            let childId = id ? id : ""
            screenParam.screenParam = "EditChild"
            screenParam.id = childId
        } else {
            screenParam.screenParam = "NewChild"
        };

        this.props.navigation.navigate('AccountStackNavigator_AddChildrenScreen', screenParam);
    };

    private renderChildList(child: Child, themeContext: ThemeContextValue) {
        return (
            <View style={[child.isCurrentActive ? { backgroundColor: 'rgba(216,216,216,0.42)' } : {}, styles.childList]}>
                <View style={{ height: scale(40) }} />
                {child.isCurrentActive ?
                    <Typography style={{ marginBottom: moderateScale(15) }}>
                        {translate('activeChildProfile')}
                    </Typography>
                    : null}

                {/* PHOTO */}
                {child.photo ?
                    <Image
                        style={styles.photo}
                        key={child.photo}
                        source={{
                            uri: child.photo,
                            // @ts-ignore
                            // cache: FastImage.cacheControl.cacheOnly,
                            // priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    : <Icon
                        name='baby'
                        style={styles.defaultImg}
                    />}


                <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingNormal }} />
                {/* NAME */}
                <Typography type={TypographyType.headingPrimary} style={{ marginBottom: scale(5) }}>
                    {child.name}
                </Typography>

                {/* BIRTH DATE */}
                {child.birthDay ? (
                    <Typography type={TypographyType.bodyRegular} style={{ fontSize: moderateScale(15), color: 'grey' }}>
                        {child.gender === "girl" ? translate('childProfileBirthDateGirl') : translate('childProfileBirthDateBoy')}
                        {' ' + child.birthDay}
                    </Typography>
                ) : null}

                <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingNormal }} />
                {child.isCurrentActive === false ?
                    <RoundedButton
                        text={translate('activateChildProfile')}
                        type={RoundedButtonType.hollowPurple}
                        style={{ width: moderateScale(193), marginBottom: 15 }}
                        onPress={() => this.setActiveChildId(child.childId)}
                    />
                    : null}

                {/* EDIT PROFILE */}
                <TextButton
                    color={TextButtonColor.purple}
                    onPress={() => this.goToChildScreen("EditChild", child.id)}
                >
                    {translate('childProfileChange')}
                </TextButton>

                <View style={{ height: themeContext.theme.variables?.sizes.verticalPaddingLarge }} />

                {/* ADD SIBLING */}
            </View>
        )
    }

    public render() {
        const screenParams = this.props.navigation.state.params!;
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <ScrollView
                        style={[styles.container]}
                        contentContainerStyle={{ alignItems: 'center', padding: themeContext.theme.screenContainer?.padding }}
                    >
                        <UserRealmConsumer>
                            {(userRealmContext: UserRealmContextValue) => (
                                <Fragment>
                                    {userRealmStore.getAllChildren().map((child) => (
                                        this.renderChildList(child, themeContext)
                                    ))}
                                </Fragment>
                            )}
                        </UserRealmConsumer>
                        {/* Add new child */}
                        <TextButton style={{ marginTop: moderateScale(25) }}
                            color={TextButtonColor.purple}
                            onPress={() => this.goToChildScreen("NewChild")}
                        >
                            + {translate('childProfileAddSibling')}
                        </TextButton>

                        {/* User profile change */}
                        <View style={styles.userEditContainer}>
                            <Typography style={styles.userEditHeader}>{translate('childProfileParent')}</Typography>
                            <RadioButtons
                                value={this.state.parentRole}
                                buttons={
                                    [{ text: translate('accountMother'), value: 'mother' },
                                    { text: translate('accountFather'), value: 'father' }]
                                }
                                onChange={(text: any) => { this.setState({ parentRole: text }) }}
                            />
                            <RoundedTextInput
                                style={{ marginBottom: 20, marginTop: 20 }}
                                label={translate('accountName')}
                                icon="account-outline"
                                value={this.state.parentName}
                                onChange={(value) => { this.onParentNameChange(value) }}
                            />
                            <RoundedButton
                                style={{ marginBottom: 30 }} type={RoundedButtonType.purple}
                                onPress={() => this.changeParentData()} text={translate('newMeasureScreenSaveBtn')}
                            />
                        </View>

                        <Snackbar
                            visible={this.state.isSnackbarVisible}
                            duration={Snackbar.DURATION_SHORT}
                            onDismiss={() => { this.setState({ isSnackbarVisible: false }) }}
                            theme={{ colors: { onSurface: "red", accent: 'white' } }}
                            action={{
                                label: 'Ok',
                                onPress: () => {
                                    this.setState({ isSnackbarVisible: false });
                                },
                            }}
                        >
                            <Text style={{ fontSize: moderateScale(16) }}>
                                {translate('accountErrorEnterName')}
                            </Text>
                        </Snackbar>
                    </ScrollView>
                )}

            </ThemeConsumer>
        );
    };
};

export interface Child {
    childId: string,
    birthDay: string,
    name: string,
    photo: string | null,
    gender: ChildGender,
    isCurrentActive: boolean
    id: string
}

export interface ChildProfileScreenStyles {
    container?: ViewStyle;
    photo?: ImageStyle;
    childList: ViewStyle;
    defaultImg: TextStyle;
    userEditContainer: ViewStyle;
    userEditHeader: TextStyle;
}

const styles = StyleSheet.create<ChildProfileScreenStyles>({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    userEditContainer: {
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#D0D0D0',
        width: '90%',
    },
    userEditHeader: {
        paddingTop: 20,
        paddingBottom: 20,
        textAlign: 'center',
    },
    defaultImg: {
        fontSize: moderateScale(150),
        color: '#B8B8B8',
        paddingTop: 5
    },
    childList: {
        width: "90%",
        alignContent: 'center',
        alignItems: "center"
    },
    photo: {
        width: scale(120),
        height: scale(120),
        borderRadius: scale(60),
    },
});
