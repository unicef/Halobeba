import React from 'react';
import { View, Text, StyleProp, StyleSheet, ViewStyle, TextStyle, ImageStyle, LayoutAnimation, LayoutAnimationConfig } from 'react-native';
import { RoundedButtonType } from './RoundedButton';
import { scale, moderateScale } from 'react-native-size-matters';
import { Typography, RoundedButton, TextButton } from '.';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { IconButton, Colors } from 'react-native-paper';
import { TypographyType } from './Typography';
import { homeMessages } from '../app';
import { translate } from "../translations/translate";
import { TextButtonColor } from './TextButton';
import { dataRealmStore } from '../stores/dataRealmStore';

export interface Props {
    cardType?: 'purple' | 'white' | "blue";
    homeMessagesType?: 'polls' | 'homeMessages';
    showCloseButton?: boolean;
    style?: StyleProp<ViewStyle>;
    onClosePress?: () => void;
}

export interface State {
    messagesAreHidden: boolean;
}

export class HomeMessages extends React.Component<Props, State> {
    private oldMessages: Message[] | null = null;

    static defaultProps: Props = {
        cardType: 'white',
        showCloseButton: false,
    };

    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        let hideHomeMessages = dataRealmStore.getVariable('hideHomeMessages');
        if (hideHomeMessages === null) hideHomeMessages = false;

        let state: State = {
            messagesAreHidden: hideHomeMessages,
        };

        this.state = state;
    }

    private getTextStyle(): TextStyle {
        const rval: TextStyle = {};

        if (this.props.cardType === 'purple' || this.props.cardType === "blue") {
            rval.color = 'white';
        }

        if (this.props.cardType === "blue") {
            rval.fontSize = scale(20);
            rval.fontWeight = "bold";
        }

        return rval;
    }

    private getIconSolidStyle(message: Message): boolean {
        if (message.iconType === IconType.message) {
            return true;
        }

        return false;
    }

    private getIconStyle(message: Message): TextStyle {
        const rval: TextStyle = {
            color: 'black',
            fontSize: scale(18),
            lineHeight: scale(20),
            // marginRight: scale(13),
            width: scale(35)
        };

        if (message.iconType === IconType.growth) {
            rval.color = '#00B80C';
        }

        if (message.iconType === IconType.celebrate) {
            rval.color = '#AA40BF';
        }

        if (message.iconType === IconType.doctor) {
            rval.color = '#2CABEF';
        }

        if (message.iconType === IconType.heart) {
            rval.color = '#ED2223';
        }

        if (message.iconType === IconType.syringe) {
            rval.color = '#2CABEF';
        }

        if (message.iconType === IconType.user) {
            rval.color = '#ED2223';
        }

        if (message.iconType === IconType.message) {
            rval.color = "white";
        }

        if (message.iconType === IconType.reminder) {
            rval.color = '#AA40BF';
        }

        // WARNING: This should be last
        if (this.props.cardType === "purple" || this.props.cardType === "blue") {
            rval.color = 'white';
        }

        return rval;
    }

    private getIconName(message: Message): string {
        let rval: string = 'home';

        if (message.iconType === IconType.doctor) rval = 'stethoscope';
        if (message.iconType === IconType.heart) rval = 'heart';
        if (message.iconType === IconType.growth) rval = 'weight'; // weight, dashboard
        if (message.iconType === IconType.checked) rval = 'check-circle';
        if (message.iconType === IconType.celebrate) rval = 'crown'; // centos, crown, fire
        if (message.iconType === IconType.syringe) rval = 'syringe';
        if (message.iconType === IconType.user) rval = 'user';
        if (message.iconType === IconType.message) rval = 'comments'
        if (message.iconType === IconType.reminder) rval = 'bell';

        return rval;
    }

    private onCloseButtonPress() {
        let layoutAnimationConfig: LayoutAnimationConfig = {
            duration: 200,
            update: {
                springDamping: 0.4,
                type: LayoutAnimation.Types.easeInEaseOut,
            }
        };

        LayoutAnimation.configureNext(layoutAnimationConfig);

        this.setState({
            messagesAreHidden: true,
        }, () => {
            if (this.props.onClosePress) {
                this.props.onClosePress();
            }
        });

        dataRealmStore.setVariable('hideHomeMessages', true);
    }

    private onShowMessagesPress() {
        LayoutAnimation.spring();

        this.setState({
            messagesAreHidden: false,
        });

        dataRealmStore.setVariable('hideHomeMessages', false);
    }

    public render() {
        // console.log('RENDER: HomeMessages');

        let messagesType = this.props.homeMessagesType;

        // Get new messages
        let messages = homeMessages.getMessages();

        if (messagesType) {
            if (messagesType === "polls") {
                messages = homeMessages.getHomePollMessages();
            }
        }

        // Decide whether to unhide messages
        if (this.oldMessages !== null && this.state.messagesAreHidden) {
            if (JSON.stringify(this.oldMessages) !== JSON.stringify(messages)) {
                this.setState({
                    messagesAreHidden: false,
                });
                dataRealmStore.setVariable('hideHomeMessages', false);
            }
        }
        this.oldMessages = messages;

        // Are messages hidden?
        if (this.props.homeMessagesType !== "polls" && this.state.messagesAreHidden) {
            return (
                <TextButton onPress={() => { this.onShowMessagesPress() }} style={{ justifyContent: 'center', marginBottom: scale(15) }} color={TextButtonColor.purple}>{translate('showHomeMessages')}</TextButton>
            );
        }

        if (this.props.homeMessagesType === "polls" && this.state.messagesAreHidden) {
            return (
                <TextButton onPress={() => { this.onShowMessagesPress() }} style={{ justifyContent: 'center', marginBottom: scale(15) }} color={TextButtonColor.purple}>{translate('showPolls')}</TextButton>
            );
        }

        let cardType = styles.cardWhite;

        if (this.props.cardType === "purple") {
            cardType = styles.cardPurple
        }

        if (this.props.cardType === "blue") {
            cardType = styles.cardBlue
        }

        return (
            messages?.length > 0 && (
                <View style={[
                    styles.container,
                    cardType,
                    this.props.style
                ]}>
                    {messages?.map((message, index) => (
                        <View style={{ paddingRight: moderateScale(22) }}>
                            {message.text && (
                                <View style={{ flexDirection: 'row' }}>
                                    {message.iconType ? (
                                        <IconFontAwesome5
                                            name={this.getIconName(message)}
                                            style={this.getIconStyle(message)}
                                            solid={this.getIconSolidStyle(message)}
                                        />
                                    ) : null}

                                    <View style={{ flex: 1 }}>
                                        <Typography style={[this.getTextStyle(), message.textStyle]}>
                                            {message.text}
                                        </Typography>

                                        {message.subText ? (
                                            <Typography style={{ fontSize: moderateScale(14), color: (this.props.cardType === 'white' ? 'grey' : 'white') }} type={TypographyType.bodyRegular}>
                                                {message.subText}
                                            </Typography>
                                        ) : null}
                                    </View>
                                </View>
                            )}

                            {message.button ? (
                                <RoundedButton
                                    style={{ width: '100%', marginTop: message.text ? scale(10) : 0, marginBottom: scale(10), marginLeft: moderateScale(11) }}
                                    type={message.button.type}
                                    showArrow={message.button.showArrow}
                                    text={message.button.text}
                                    onPress={() => { if (message.button?.onPress) message.button?.onPress() }}
                                />
                            ) : null}


                            {message.textButton ? (
                                <TextButton
                                    textStyle={{ textAlign: 'center', marginTop: 10 }}
                                    color={message.textButton.color}
                                    onPress={() => { if (message.textButton?.onPress) message.textButton.onPress() }}
                                >
                                    {message.textButton.text}
                                </TextButton>
                            ) : null}

                            {messages?.length !== (index + 1) ? (
                                <View style={{ height: scale(15) }} />
                            ) : null}
                        </View>
                    ))}

                    {this.props.showCloseButton ? (
                        <IconButton
                            icon="close"
                            color={this.props.cardType === "white" ? 'grey' : 'white'}
                            size={moderateScale(20)}
                            style={{ position: 'absolute', right: scale(5), top: scale(5) }}
                            onPress={() => { this.onCloseButtonPress() }}
                        />
                    ) : null}
                </View>
            )
        );
    }
}

export interface HomeMessagesStyles {
    [index: string]: ViewStyle | TextStyle | ImageStyle;
    container: ViewStyle;
    cardWhite: ViewStyle;
    cardPurple: ViewStyle;
    cardBlue: ViewStyle;
}

const styles = StyleSheet.create<HomeMessagesStyles>({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: 'white',
        padding: 15,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 10,
        shadowOpacity: 0.2,
        elevation: 2,
        borderRadius: 8,
        marginBottom: scale(30),
    },

    cardWhite: {
        backgroundColor: 'white',
    },

    cardPurple: {
        backgroundColor: '#AA40BF',
    },
    cardBlue: {
        backgroundColor: '#6967E4'
    },
});

export type Message = {
    text?: string;
    textStyle?: TextStyle;
    subText?: string;
    iconType?: IconType;
    button?: {
        type: RoundedButtonType.purple | RoundedButtonType.hollowPurple | RoundedButtonType.default | RoundedButtonType.hollowWhite,
        text: string;
        showArrow?: boolean,
        onPress?: () => void
    };
    textButton?: {
        color: TextButtonColor,
        text: string;
        showArrow?: boolean;
        onPress?: () => void
    };
};

export enum IconType {
    celebrate = 'celebrate',
    syringe = 'syringe',
    growth = 'growth',
    doctor = 'doctor',
    heart = 'heart',
    checked = 'checked',
    user = 'user',
    message = 'message',
    reminder = 'reminder',
};