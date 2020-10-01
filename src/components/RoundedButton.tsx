import React, { Fragment } from 'react';
import { View, Text, StyleProp, ViewStyle, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IconMaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { translate } from '../translations/translate';

export interface Props {
    text: string;
    type?: RoundedButtonType;
    showArrow?: boolean;
    disabled?: boolean;
    iconName?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    iconStyle?: StyleProp<TextStyle>;
    onPress?: Function;
}

export interface State {
    text: string;
    icon?: JSX.Element;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
}

export enum RoundedButtonType {
    default,
    google,
    facebook,
    purple,
    hollowWhite,
    hollowPurple,
}

export class RoundedButton extends React.Component<Props, State> {
    static defaultProps: Props = {
        text: '',
        type: RoundedButtonType.default,
        showArrow: false,
    };

    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        let state: State = {
            text: '',
            containerStyle: {},
            textStyle: {},
        };

        // Google
        if (this.props.type === RoundedButtonType.google) {
            state.text = translate('loginGoogle');
            state.textStyle = {
                color: '#EB4747',
                fontFamily: 'SFUIDisplay-Semibold',
            };
            state.icon = <IconAntDesign name={"google"} style={[styles.iconStyle, { color: state.textStyle.color }]} />;
        }

        // Facebook
        if (this.props.type === RoundedButtonType.facebook) {
            state.text = translate('loginFacebook');
            state.textStyle = {
                color: '#2672CB',
                fontFamily: 'SFUIDisplay-Semibold',
            };
            state.icon = <IconFontAwesome name={"facebook"} style={[styles.iconStyle, { color: state.textStyle.color, fontSize: 24 }]} />;
        }

        // Purple
        if (this.props.type === RoundedButtonType.purple) {
            state.textStyle = {
                color: 'white',
                fontFamily: 'SFUIDisplay-Semibold',
            };
            state.containerStyle = {
                backgroundColor: '#AA40BF',
            };
        }

        // Hollow white
        if (this.props.type === RoundedButtonType.hollowWhite) {
            state.textStyle = {
                color: 'white',
            };
            state.containerStyle = {
                borderWidth: 1,
                borderColor: 'white',
                backgroundColor: 'transparent',
            };
        }

        // Hollow purple
        if (this.props.type === RoundedButtonType.hollowPurple) {
            state.textStyle = {
                color: '#AA40BF',
            };
            state.containerStyle = {
                borderWidth: 2,
                borderColor: '#AA40BF',
                backgroundColor: 'white',
            };
        }

        // Icon name
        if (this.props.iconName) {
            state.icon = <IconFontAwesome5 name={this.props.iconName} style={[styles.iconStyle, { color: state.textStyle?.color, fontSize: 20 }]} />;
        }

        this.state = state;
    }

    private onPress() {
        if (this.props.onPress) {
            this.props.onPress();
        }
    }

    public render() {
        let wrapper = this.props.disabled === true ? (
            (children: JSX.Element) => (
                <View
                    style={[styles.container, this.state.containerStyle, this.props.style, { opacity: 0.5 }]}
                >
                    {children}
                </View>
            )
        ) : (
                (children: JSX.Element) => (
                    <TouchableOpacity
                        onPress={() => { this.onPress() }}
                        style={[styles.container, this.state.containerStyle, this.props.style]}
                    >
                        {children}
                    </TouchableOpacity>
                )
            );

        return wrapper((
            <Fragment>
                {this.state.icon}
                <Text ellipsizeMode="tail" numberOfLines={1} style={[styles.textStyle, { textAlign: (this.state.icon ? 'left' : 'center') }, this.state.textStyle]}>{this.props.text ? this.props.text : this.state.text}</Text>
                {this.props.showArrow ? (
                    <IconMaterialCommunity name={"chevron-right"} style={{ fontSize: 24, paddingTop: 2, marginRight: scale(12), color: this.state.textStyle?.color }} />
                ) : null}
            </Fragment>
        ));
    }
}

export interface RoundedButtonStyles {
    container?: ViewStyle;
    textStyle?: TextStyle;
    iconStyle?: TextStyle;
    arrowIcon?: TextStyle;
}

const styles = StyleSheet.create<RoundedButtonStyles>({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: 'white',
        height: 48,
        borderRadius: 24,
    },

    textStyle: {
        flex: 1,
        fontFamily: 'SFUIDisplay-Regular',
        color: '#0D1F4A',
        fontSize: moderateScale(17),
        lineHeight: moderateScale(20),
    },

    iconStyle: {
        fontSize: moderateScale(20),
        color: '#0D1F4A',
        marginLeft: scale(16),
        marginRight: scale(16),
    },

    arrowIcon: {
        fontSize: moderateScale(20),
        color: '#0D1F4A',
        marginLeft: scale(16),
    },
});