import React from 'react';
import { View, StyleProp, ViewStyle, StyleSheet , Text, KeyboardTypeOptions} from 'react-native';
import { TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Typography } from './Typography';

export interface Props {
    label?: string;
    suffix?: string;
    value?: string;
    keyboardType: KeyboardTypeOptions;
    secureTextEntry: boolean
    /**
     * Search for icons [here](https://materialdesignicons.com).
     */
    icon?: string;
    style?: StyleProp<ViewStyle>;
    onChange?: (text:string)=>void;
    onFocus?: ()=>void;
}

export class RoundedTextInput extends React.Component<Props> {
    static defaultProps: Props = {
        keyboardType: "default",
        secureTextEntry: false,
    };

    constructor(props: Props) {
        super(props);
    }

    private onChangeText(text:string) {
        if (this.props.onChange) {
            this.props.onChange(text);
        }
    }

    private onTextFocus() {
        if (this.props.onFocus) {
            this.props.onFocus();
        }
    }

    public render() {
        return (
            <View style={[styles.container, this.props.style]}>
                {this.props.icon ? (
                    <Icon
                        name={ this.props.icon }
                        style={{ fontSize:20, color:'#464646', paddingTop:5 }}
                    />
                ) : null}

                <View style={ styles.textInputContainer }>
                    <TextInput
                        secureTextEntry={this?.props?.secureTextEntry}
                        keyboardType={this?.props?.keyboardType}
                        label={ this?.props?.label }
                        value={ this?.props?.value }
                        style={ styles.textInput }
                        dense={ true }
                        underlineColor="transparent"
                        theme={ {colors:{primary:'#767676'}} }
                        autoCapitalize='none'
                        autoCompleteType="off"
                        autoCorrect={ false }
                        onChangeText={ (text:string) => {this.onChangeText(text)} }
                        onFocus={ () => {this.onTextFocus()} }
                    />
                    {this.props.suffix ? (
                        <View style={ styles.suffixContainer }>
                            <Typography>
                                {this.props.suffix}
                            </Typography>
                        </View>
                    ) : null}
                </View>
            </View>
        );
    }
}

export interface RoundedTextInputStyles {
    container?: ViewStyle;
    textInputContainer?: ViewStyle;
    textInput?: ViewStyle;
    suffixContainer?: ViewStyle;
}

const styles = StyleSheet.create<RoundedTextInputStyles>({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#F3F3F3',
        height: 60,
        borderRadius: 24,
        paddingLeft: 16,
    },

    textInputContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        borderRadius: 4,
        height: 55,
        overflow: 'hidden',
        flex: 1
    },

    textInput: {
        flex: 1,
        borderRadius: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        height: 57,
        overflow: 'hidden',
        backgroundColor: 'transparent',
    },

    suffixContainer: {
        justifyContent:'center',
        alignSelf:'stretch',
        paddingRight: 15,
    },
});
