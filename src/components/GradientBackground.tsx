import React from 'react';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export interface Props {
    colors: string[];
    style?: StyleProp<ViewStyle>;
}

export class GradientBackground extends React.Component<Props> {
    static defaultProps: Props = {
        colors: ['#541AA9', '#2E1D77', '#081F44']
    };

    constructor(props: Props) {
        super(props);
    }

    public render() {
        return (
            <LinearGradient
                colors={ this.props.colors }
                style={ [styles.container, this.props.style] }
            >
                {this.props.children}
            </LinearGradient>
        );
    }
}

export interface GradientBackgroundStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<GradientBackgroundStyles>({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    },
});
