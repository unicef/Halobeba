import React from 'react';
import { Text, StyleProp, ViewStyle, StyleSheet, TouchableOpacity, View, TextStyle } from 'react-native';

export interface Props {
    buttons: RadioButton[];
    value?: string;
    style?: StyleProp<ViewStyle>;
    buttonStyle?: StyleProp<ViewStyle>,
    onChange?: (value:string|undefined)=>void,
}

export interface State {
    value?: string;
}

interface RadioButton {
    text:string;
    value:string;
}

export class RadioButtons extends React.Component<Props, State> {
    static defaultProps: Props = {
        buttons: [],
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            value: this.props.value
        };
    }

    private onButtonPress(button:RadioButton) {
        this.setState({
            value: button.value
        }, () => {
            if (this.props.onChange) {
                this.props.onChange(this?.state?.value);
            }
        });
    }

    public render() {
        return (
            <View style={ [styles.container, this.props.style] }>
                {this.props.buttons.length === 0 ? (
                    <Text>No radio buttons</Text>
                ) : null}

                {this.props.buttons.map((button, index) => 
                    <TouchableOpacity
                        key={index}
                        style={ [styles.button, this.props.buttonStyle, (button.value === this.state.value ? styles.buttonSelected : {})] }
                        onPress={ () => {this.onButtonPress(button)} }
                    >
                        <Text 
                            style={ [styles.text, (button.value === this.state.value ? styles.textSelected : {})] }
                        >{button.text}</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}

export interface RadioButtonsStyles {
    container?: ViewStyle;
    button?: ViewStyle;
    buttonSelected?: ViewStyle;
    text?: TextStyle;
    textSelected?: TextStyle;
}

const styles = StyleSheet.create<RadioButtonsStyles>({
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },

    button: {
        backgroundColor: '#F3F3F3',
        paddingLeft:32, paddingRight:32,
        paddingTop:16, paddingBottom:16,
        borderRadius: 25,
    },

    buttonSelected: {
        backgroundColor: '#AA40BF',
    },

    text: {
        fontFamily: 'SFUIDisplay-Regular',
        fontSize: 17,
        color: '#8C8C8C', // #262626, #8C8C8C
    },

    textSelected: {
        color: 'white',
    }
});
