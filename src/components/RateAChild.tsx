import React from 'react';
import { View, Text, StyleProp, ViewStyle, StyleSheet, TextStyle } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { scale } from 'react-native-size-matters';

export interface Props {
    value?: number,
    style?: StyleProp<ViewStyle>,
    onChange?: (value:number) => void
}

export interface State {
    value?: number;
}

export class RateAChild extends React.Component<Props, State> {
    static defaultProps: Props = {
        
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            value:this.props.value
        };
    }

    private onRadioPress(n:number) {
        this.setState({
            value: n
        }, () => {
            if (this.props.onChange) {
                this.props.onChange(n);
            }
        });
    }

    public render() {
        return (
            <View style={ [styles.container, this.props.style] }>
                {Array.from({length:10}).map((item, index) => (
                    <View style={{flexDirection:'column', justifyContent:'flex-start', alignItems:'center', width: scale(32)}}>
                        <RadioButton.Android
                            value=''
                            // color="red"
                            status={ this.state.value === index + 1 ? 'checked' : 'unchecked' }
                            onPress={() => { this.onRadioPress(index+1) }}
                        />
                        <Text onPress={() => { this.onRadioPress(index+1) }} style={ styles.radioText }>{index+1}</Text>
                    </View>
                ))}
            </View>
        );
    }
}

export interface RateAChildStyles {
    container?: ViewStyle;
    radioText?: TextStyle;
}

const styles = StyleSheet.create<RateAChildStyles>({
    container: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    radioText: {
        fontFamily: 'SFUIDisplay-Regular',
        fontSize: 17,
        width:30,
        color: '#262626',
        textAlign: 'center',
        // backgroundColor: 'red'
    },
});
