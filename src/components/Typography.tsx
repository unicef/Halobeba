import React from 'react';
import { Text, TextStyle, StyleProp, StyleSheet, GestureResponderEvent } from 'react-native';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

export interface Props {
    type?: TypographyType;
    style?: StyleProp<TextStyle>;
}

export interface State extends TextStyle {
    fontFamily: string;
    fontSize: number;
    lineHeight: number;
}

export enum TypographyType {
    logo,
    headingPrimary,
    headingSecondary,
    bodyRegular,
    bodyRegularLargeSpacing,
}

export class Typography extends React.Component<Props, State> {
    static defaultProps: Props = {
        type: TypographyType.bodyRegular
    };

    constructor(props: Props) {
        super(props);
        this.initState();
    }

    private initState() {
        let state: State = {
            fontFamily: 'SFUIDisplay-Regular',
            fontSize: moderateScale(17),
            lineHeight: moderateScale(22),
            color: '#262626',
        };

        if (this.props.type === TypographyType.logo) {
            state.fontFamily = 'SFUIDisplay-Heavy',
                state.fontSize = scale(56);
            state.lineHeight = scale(67);
            state.marginBottom = scale(34);
        }

        if (this.props.type === TypographyType.headingPrimary) {
            state.fontFamily = 'SFUIDisplay-Heavy',
                state.fontSize = scale(28);
            state.lineHeight = scale(34);
            state.marginBottom = scale(20);
        }

        if (this.props.type === TypographyType.headingSecondary) {
            state.fontFamily = 'SFUIDisplay-Bold',
                state.fontSize = scale(20);
            state.lineHeight = scale(25);
            state.marginBottom = scale(8);
        }

        if (this.props.type === TypographyType.bodyRegularLargeSpacing) {
            state.fontFamily = 'SFUIDisplay-Regular',
                state.fontSize = scale(17);
            state.lineHeight = scale(25);
        }

        this.state = state;
    }

    public render() {
        return (
            <Text style={[styles.container, this.state, this.props.style]}>{this.props.children}</Text>
        );
    }
}

export interface TypographyStyles {
    container?: TextStyle;
}

const styles = StyleSheet.create<TypographyStyles>({
    container: {
        // backgroundColor: 'yellow',
    },
});
