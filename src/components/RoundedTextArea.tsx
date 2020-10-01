import React from 'react';
import { View, StyleProp, ViewStyle, StyleSheet, TextStyle, TextInput, Text, TouchableWithoutFeedback } from 'react-native';

export interface Props {
    label?: string;
    placeholder?: string;
    value?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    labelStyle?: StyleProp<TextStyle>;
    onChange?: (value:string)=>void;
}

export interface State {
    value: string;
}

export class RoundedTextArea extends React.Component<Props, State> {
    private readonly textArea: React.RefObject<TextInput>;

    static defaultProps: Props = {
        
    };

    constructor(props: Props) {
        super(props);
        this.textArea = React.createRef();
        this.initState();
    }

    private initState() {
        let state: State = {
            value: this.props.value ?? '',
        };

        this.state = state;
    }

    private onChange(value:string) {
        this.setState({
            value: value
        }, () => {
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        });
    }

    private onComponentPress() {
        this.textArea.current?.focus();
    }

    public render() {
        return (
            <TouchableWithoutFeedback
                onPress={ () => {this.onComponentPress()} }
            >
                <View style={ [styles.container, this.props.style] }>
                    {this.props.label ? (
                        <Text style={ [styles.label, this.props.labelStyle] }>{ this.props.label }</Text>
                    ) : null}
                    
                    <TextInput
                        placeholder={ this.props.placeholder }
                        ref={ this.textArea }
                        style={ [styles.textInput, this.props.textStyle] }
                        multiline={ true }
                        value={ this.state.value }
                        onChangeText={ (value) => {this.onChange(value)} }
                        autoCorrect={ false }
                    />
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

export interface RoundedTextAreaStyles {
    container?: ViewStyle;
    textInputWrapper?: ViewStyle;
    label?: TextStyle;
    textInput?: TextStyle;
}

const styles = StyleSheet.create<RoundedTextAreaStyles>({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#F3F3F3',
        borderRadius: 20,
        paddingTop:20, paddingRight:20, paddingBottom:20, paddingLeft:20,
    },

    label: {
        color: '#767676',
        fontSize: 17,
        fontFamily: 'SFUIDisplay-Regular',
        marginBottom: 5,
    },

    textInput: {
        textAlignVertical: 'top',
        minHeight:90,
        fontSize: 17,
        fontFamily: 'SFUIDisplay-Regular',
        backgroundColor: 'transparent',
    }
});
