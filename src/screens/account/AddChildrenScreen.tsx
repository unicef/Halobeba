import React, { createRef, Fragment, RefObject } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ViewStyle, Platform, AppState } from 'react-native';
import { copyFile, DocumentDirectoryPath, exists, mkdir, unlink } from "react-native-fs";
import 'react-native-get-random-values';
import { Image as ImageObject } from 'react-native-image-crop-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Colors, IconButton, Snackbar } from 'react-native-paper';
import { moderateScale, scale } from 'react-native-size-matters';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { v4 as uuidv4 } from 'uuid';
import { PhotoPicker } from "../../components/PhotoPicker";
import { RadioButtons } from "../../components/RadioButtons";
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import { RoundedTextInput } from "../../components/RoundedTextInput";
import { TextButton, TextButtonColor } from "../../components/TextButton";
import { Typography, TypographyType } from '../../components/Typography';
import { dataRealmStore, userRealmStore } from '../../stores';
import { ChildEntity, ChildEntitySchema, ChildGender } from '../../stores/ChildEntity';
import { UserRealmConsumer, UserRealmContextValue } from '../../stores/UserRealmContext';
import { translate } from '../../translations/translate';
import Orientation from 'react-native-orientation-locker';
import { utils } from '../../app/utils';
import { BackHandler } from 'react-native';
export interface Props {
    navigation: NavigationStackProp<NavigationStackState>;
}

export interface State {
    isSnackbarVisible: boolean;
    snackbarMessage: string;
    screenType: ScreenTypes;
    previousScreen: string;
}

export class AddChildrenScreen extends React.Component<Props, State> {

    private scrollView: RefObject<KeyboardAwareScrollView>;

    public constructor(props: Props) {
        super(props);
        this.scrollView = createRef<KeyboardAwareScrollView>();
        this.initState();
        this.addFirstChild();
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this)
    }

    public componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        Orientation.lockToPortrait();
    }

    private initState() {
        let screenType = "";
        let screenParam: ScreenTypes = this.props.navigation.state.params?.screenParam
        let previousScreen = "";
        
        if(this.props.navigation.state.params?.previousScreen){
            previousScreen = this.props.navigation.state.params?.previousScreen;
        }

        if (screenParam) {
            screenType = screenParam;
        };

        if (screenType === "EditChild") {

        }

        const state: State = {
            isSnackbarVisible: false,
            snackbarMessage: '',
            screenType: screenType as ScreenTypes,
            previousScreen: previousScreen,
        };

        this.state = state;
    }

    private addFirstChild() {
        let numberOfChildren = userRealmStore.realm?.objects<ChildEntity>(ChildEntitySchema.name).length;


        if (numberOfChildren !== undefined && numberOfChildren !== 0 && this.state.screenType !== "NewChild") {
            return;
        }

        userRealmStore.create<ChildEntity>(ChildEntitySchema, this.getNewChild());
    }

    componentWillUnmount(){
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);

    }

    handleBackButtonClick() {
        if(this.state.previousScreen === "ChildProfileScreen"){
            userRealmStore.removeEmptyChild()
            this.props.navigation.goBack(null);
            return true;
        };
    };

    private getNewChild(): ChildEntity {
        return {
            uuid: uuidv4(),
            name: '',
            gender: 'girl',
            createdAt: new Date(),
            updatedAt: new Date(),
            measures: "",
            measurementPlace: "doctor"
        };
    }

    private onChildGenderChange(child: ChildEntity | undefined, newGender: ChildGender) {
        if (child) {
            userRealmStore.realm?.write(() => {
                child.gender = newGender;
                child.updatedAt = new Date();
            });
        };
        utils.logAnalitic("onChildGenderSave", { eventName: "onChildGenderSave" });
    };

    private onChildNameChange(child: ChildEntity | undefined, newName: string) {
        if (child) {
            userRealmStore.realm?.write(() => {
                child.name = newName;
                child.updatedAt = new Date();
            });
        };
    };

    private async onChildPhotoChange(child: ChildEntity | undefined, image: ImageObject) {
        // Create Documents/children folder if it doesnt exist
        if (!(await exists(`${DocumentDirectoryPath}/children`))) {
            mkdir(`${DocumentDirectoryPath}/children`);
        }

        // Set newFilename
        let newFilename: string;

        let parts = image.path.split('.');
        let extension: string | null = null;
        if (parts.length > 1) {
            extension = parts[parts.length - 1].toLowerCase();
        };

        let timestamp = new Date().getTime();

        if (child) {
            if (extension) {
                newFilename = `${child.uuid}_${timestamp}.${extension}`;
            } else {
                newFilename = child.uuid + "_" + timestamp;
            };

            // Set destPath
            let destPath = `${DocumentDirectoryPath}/children/${newFilename}`;

            // Delete image if it exists
            if (await exists(destPath)) {
                await unlink(destPath);
            };

            // Copy image
            await copyFile(image.path, destPath);

            // Save imageUri to realm
            userRealmStore.realm?.write(() => {
                child.photoUri = destPath.replace(DocumentDirectoryPath, '');
            });
        };
    };

    private async addAnotherChild() {
        await userRealmStore.create<ChildEntity>(ChildEntitySchema, this.getNewChild());
        utils.logAnalitic('onAdditionalChildEntered', { eventName: "onAdditionalChildEntered" });
        setTimeout(() => {
            this.scrollView.current?.scrollToEnd();
        }, 0);
    }

    private showRemoveButton() {
        let allChildren = userRealmStore.getAllChildren();

        if (allChildren.length > 1) {
            return true
        } else {
            return false;
        }
    }

    private async removeChild(child: ChildEntity | undefined) {
        await userRealmStore.delete(child);
        if (this.state.screenType !== "" && this.state.screenType !== "EditChild") {
            this.props.navigation.navigate('HomeStackNavigator_ChildProfileScreen')
        }

    }

    private gotoAddParentsScreen() {
        if (this.validate()) {
            dataRealmStore.setVariable('userEnteredChildData', true);

            if (this.state.screenType !== "") {
                this.props.navigation.navigate('HomeStackNavigator_ChildProfileScreen');
            } else {
                this.props.navigation.navigate('AccountStackNavigator_AddParentsScreen');
            };
        } else {
            this.setState({
                isSnackbarVisible: true,
                snackbarMessage: translate('accountErrorAllNamesMustBeGiven'),
            });
        };
    };

    private validate(): boolean {
        let rval = true;
        const allChildren = userRealmStore.realm?.objects<ChildEntity>(ChildEntitySchema.name);
        if (this.state.screenType !== "" && this.state.screenType !== "NewChild") {
            // TODO 

            const childId = this.props.navigation.state.params?.id;

            if (childId) {
                let child = allChildren?.find(item => item.uuid === childId);

                if (child) {
                    if (!child.name || child.name === "") {
                        rval = false;
                    };
                };
            }
        } else {
            allChildren?.forEach((child) => {
                if (!child.name || child.name === '') {
                    rval = false;
                };
            });
        };

        return rval;
    };

    private getAbsolutePathToDocumentFolder(relativePath: string | undefined) {
        let finalPath = relativePath;

        finalPath = DocumentDirectoryPath + finalPath;
        finalPath = utils.addPrefixForAndroidPaths(finalPath);

        return finalPath;
    };

    private renderDefaultScreen(userRealmContext: UserRealmContextValue) {
        return (
            <Fragment>
                {userRealmContext.realm?.objects<ChildEntity>(ChildEntitySchema.name).map((child, childIndex) => (
                    <View key={childIndex}>
                        {/* CHILD HEADER */}
                        {childIndex !== 0 && (
                            <View style={{ height: scale(45), paddingLeft: scale(10), backgroundColor: '#F8F8F8', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ flex: 1, fontSize: moderateScale(16), fontWeight: 'bold' }}>
                                    {translate('accountSisterOrBrother')}
                                </Text>
                                {
                                    this.showRemoveButton() ?
                                        <IconButton
                                            icon="close"
                                            size={scale(25)}
                                            onPress={() => { this.removeChild(child) }}
                                        /> : null
                                }

                            </View>
                        )}

                        {/* PHOTO PICKER */}
                        <PhotoPicker
                            imageUri={this.getAbsolutePathToDocumentFolder(child.photoUri)}
                            onChange={image => this.onChildPhotoChange(child, image)}
                        />

                        <View style={{ height: scale(30) }}></View>

                        <View style={{ padding: scale(30), alignItems: 'center' }}>
                            {/* CHOOSE GENDER */}
                            <RadioButtons
                                value={child.gender}
                                buttons={[{ text: translate('accountGirl'), value: 'girl' }, { text: translate('accountBoy'), value: 'boy' }]}
                                onChange={value => { if (value) { this.onChildGenderChange(child, value as ChildGender) } }}
                            />

                            <View style={{ height: scale(20) }}></View>

                            {/* NAME */}
                            <RoundedTextInput
                                label={translate('accountName')}
                                icon="account-outline"
                                value={child.name}
                                onChange={(value) => { this.onChildNameChange(child, value) }}
                            />

                            <View style={{ height: scale(20) }}></View>

                            {/* ADD SIBLING */}
                            {(userRealmContext.realm?.objects(ChildEntitySchema.name) && childIndex === userRealmContext.realm?.objects(ChildEntitySchema.name).length - 1) && (
                                <TextButton color={TextButtonColor.purple} onPress={() => { this.addAnotherChild() }}>
                                    + { translate('accountHasSibling')}
                                </TextButton>
                            )}

                            {/* <View style={{height:scale(20)}}></View> */}
                        </View>
                    </View>
                ))}
            </Fragment>
        );
    };

    private renderOtherScreens(userRealmContext: UserRealmContextValue) {
        let allChildren = userRealmContext.realm?.objects<ChildEntity>(ChildEntitySchema.name).map((child) => child);
        let uuid = this.props.navigation.state.params?.id ? this.props.navigation.state.params?.id : ""

        if (allChildren) {
            let child = this.state.screenType === "NewChild" ?
                allChildren[allChildren.length - 1] :
                allChildren.find(item => item.uuid === uuid);


            if (child) {
                return (
                    <Fragment>
                        <View key={child.uuid}>
                            {/* CHILD HEADER */}
                            <View style={{ height: scale(45), paddingLeft: scale(10), backgroundColor: '#F8F8F8', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ flex: 1, fontSize: moderateScale(16), fontWeight: 'bold' }}>
                                    {this.state.screenType === "EditChild" ? null : translate('accountSisterOrBrother')}
                                </Text>
                                {
                                    this.showRemoveButton() ?
                                        <IconButton
                                            icon="close"
                                            size={scale(25)}
                                            onPress={() => { this.removeChild(child) }}
                                        /> : null
                                }


                            </View>

                            {/* PHOTO PICKER */}
                            <PhotoPicker
                                imageUri={this.getAbsolutePathToDocumentFolder(child.photoUri)}
                                onChange={image => this.onChildPhotoChange(child, image)}
                            />

                            <View style={{ height: scale(30) }}></View>

                            <View style={{ padding: scale(30), alignItems: 'center' }}>
                                {/* CHOOSE GENDER */}
                                <RadioButtons
                                    value={child.gender}
                                    buttons={[{ text: translate('accountGirl'), value: 'girl' }, { text: translate('accountBoy'), value: 'boy' }]}
                                    onChange={value => { if (value) { this.onChildGenderChange(child, value as ChildGender) } }}
                                />

                                <View style={{ height: scale(20) }}></View>

                                {/* NAME */}
                                <RoundedTextInput
                                    label={translate('accountName')}
                                    icon="account-outline"
                                    value={child.name}
                                    onChange={(value) => { this.onChildNameChange(child, value) }}
                                />

                                <View style={{ height: scale(20) }}></View>

                            </View>
                        </View>
                    </Fragment>
                );
            };
        };
    };

    private renderScreen(userRealmContext: UserRealmContextValue) {
        if (this.state.screenType === "") {
            return this.renderDefaultScreen(userRealmContext);
        } else {
            return this.renderOtherScreens(userRealmContext);
        };
    };

    public render() {
        return (
            <SafeAreaView style={[styles.container]}>
                <KeyboardAwareScrollView
                    ref={this.scrollView}
                    keyboardShouldPersistTaps='always'
                    contentContainerStyle={{ backgroundColor: 'white', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch' }}>
                    {/* TITLE */}
                    <Typography style={{ margin: scale(30) }} type={TypographyType.headingPrimary}>
                        {this.state.screenType === "EditChild" ? translate('childProfileEditChildTitle') : translate('accountTitle')}
                    </Typography>

                    {/* CHILDREN */}

                    <UserRealmConsumer>
                        {(userRealmContext: UserRealmContextValue) => (
                            this.renderScreen(userRealmContext)
                        )}
                    </UserRealmConsumer>

                    <View style={{ height: scale(20) }}></View>

                    {/* NEXT BUTTON */}
                    {
                        this.state.screenType !== "" ?
                            <RoundedButton
                                text={"Save"}
                                type={RoundedButtonType.purple}
                                style={{ marginHorizontal: scale(30) }}
                                onPress={() => { this.gotoAddParentsScreen() }}
                            />
                            :
                            <RoundedButton
                                text={translate('accountNext')}
                                type={RoundedButtonType.purple}
                                showArrow={true}
                                style={{ marginHorizontal: scale(30) }}
                                onPress={() => { this.gotoAddParentsScreen() }}
                            />
                    }


                    <View style={{ height: scale(40) }}></View>

                </KeyboardAwareScrollView>

                <Snackbar
                    visible={this.state.isSnackbarVisible}
                    duration={Snackbar.DURATION_SHORT}
                    onDismiss={() => { this.setState({ isSnackbarVisible: false }) }}
                    theme={{ colors: { onSurface: Colors.red500, accent: 'white' } }}
                    action={{
                        label: 'Ok',
                        onPress: () => {
                            this.setState({ isSnackbarVisible: false });
                        },
                    }}
                >
                    <Text style={{ fontSize: moderateScale(16) }}>
                        {this.state.snackbarMessage}
                    </Text>
                </Snackbar>
            </SafeAreaView>
        );
    };
};

export type ScreenTypes = "NewChild" | "EditChild" | "";

export interface AddChildrenScreenStyles {
    container?: ViewStyle;
};

const styles = StyleSheet.create<AddChildrenScreenStyles>({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
});
