import React from 'react';
import { View, Text, StyleProp, ViewStyle, StyleSheet, TextStyle } from 'react-native';

export interface Props {
    color?: TagColor;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
}

export interface State {
    backgroundColor: string;
}

export enum TagColor {
    purple = '#AA40BF',
    orange = '#F5893E',
    green = '#2CBB39',
}

export class Tag extends React.Component<Props, State> {
    static defaultProps: Props = {
        
    };

    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        let state: State = {
            backgroundColor: TagColor.purple
        };

        if (this.props.color === TagColor.green) {
            state.backgroundColor = TagColor.green;
        }

        if (this.props.color === TagColor.orange) {
            state.backgroundColor = TagColor.orange;
        }

        this.state = state;
    }

    public render() {
        return (
            <View style={ [styles.container, {backgroundColor:this.state.backgroundColor}, this.props.style] }>
                <Text style={ [styles.textStyle, this.props.textStyle] }>{ this.props.children }</Text>
            </View>
        );
    }
}

export interface TagStyles {
    container?: ViewStyle;
    textStyle?: TextStyle;
}

const styles = StyleSheet.create<TagStyles>({
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        paddingLeft:20, paddingRight:20,
        paddingTop:5, paddingBottom:5,
        borderRadius: 16,
    },

    textStyle: {
        color: 'white',
        fontSize: 15,
        fontFamily: 'SFUIDisplay-Semibold',
    },
});
