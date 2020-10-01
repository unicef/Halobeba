import React from 'react';
import { Text, StyleProp, ViewStyle, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
// https://materialdesignicons.com
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// https://fontawesome.com/icons?d=gallery&m=free
import Icon from 'react-native-vector-icons/FontAwesome';

export interface Props {
    color?: TextButtonColor;
    size?: TextButtonSize;
    /**
     * Search for icons [here](https://fontawesome.com/icons?d=gallery&m=free).
     */
    icon?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    iconStyle?: StyleProp<TextStyle>;
    onPress?: Function;
}

export interface State {
    textStyle: TextStyle;
    iconStyle: TextStyle;
}

export enum TextButtonColor {
    white,
    black,
    purple,
}

export enum TextButtonSize {
    normal,
    small
}

export class TextButton extends React.Component<Props, State> {
    static defaultProps: Props = {
        
    };

    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        let state: State = {
            textStyle: {
                color: '#262626',
                fontSize: 17,
                lineHeight: 20,
                fontFamily: 'SFUIDisplay-Regular',
            },

            iconStyle: {
                fontSize: 20,
                lineHeight: 20,
                color: '#262626',
                paddingTop: 2,
                marginRight: 10,
            }
        };

        if (this.props.color === TextButtonColor.white) {
            state.textStyle.color = 'white';
            // state.iconStyle.color = 'white';
        }

        if (this.props.color === TextButtonColor.purple) {
            state.textStyle.color = '#AA40BF';
            // state.iconStyle.color = '#AA40BF';
        }

        if (this.props.size === TextButtonSize.small) {
            state.textStyle.fontSize = 15;
            state.textStyle.lineHeight = 18;

            state.iconStyle.fontSize = 15;
            state.iconStyle.lineHeight = 18;
        }

        this.state = state;
    }

    private onPress() {
        if (this.props.onPress) {
            this.props.onPress();
        }
    }

    public render() {
        return (
            <TouchableOpacity style={ [styles.container, this.props.style] } onPress={ () => {this.onPress()} }>
                {this.props.icon ? (
                    <Icon
                        name={ this.props.icon }
                        style={ [this.state.iconStyle, this.props.iconStyle] }
                    />
                ) : null}
                <Text style={ [styles.textStyle, this.state.textStyle, this.props.textStyle] }>{ this.props.children }</Text>
            </TouchableOpacity>
        );
    }
}

export interface TextButtonStyles {
    container?: ViewStyle;
    textStyle?: TextStyle;
}

const styles = StyleSheet.create<TextButtonStyles>({
    container: {
        // backgroundColor: 'yellow',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        // padding: 10,
    },

    textStyle: {
        // flex: 1,
    }
});
