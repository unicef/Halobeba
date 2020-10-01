import React from 'react';
import { View, Text, StyleProp, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { ThemeContextValue, ThemeConsumer } from '../themes/ThemeContext';
import { scale } from 'react-native-size-matters';

export interface Props {
    style?: StyleProp<ViewStyle>;
}

export class Divider extends React.Component<Props> {
    static defaultProps: Props = {
        
    };

    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <ThemeConsumer>
            {(themeContext:ThemeContextValue) => (
                <View style={ [styles.container, this.props.style] }>
                </View>
            )}
            </ThemeConsumer>
        );
    }
}

export interface DividerStyles {
    [index:string]: ViewStyle | TextStyle | ImageStyle;
    container: ViewStyle;
}

const styles = StyleSheet.create<DividerStyles>({
    container: {
        height: 1,
        minWidth: scale(50),
        alignSelf: 'stretch',        
        backgroundColor: '#D8D8D8',
        marginTop: scale(10),
        marginBottom: scale(10),
    },
});
