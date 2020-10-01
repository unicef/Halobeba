import React, { Fragment } from 'react';
import { View, Linking, StyleProp, StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Typography, TypographyType } from '../../components/Typography';
import { TextButton, TextButtonColor } from '../../components/TextButton';

export interface Props {
    style?: StyleProp<ViewStyle>;
}

/**
 * Shows contact info.
 */
export class DidntFindAnswers extends React.Component<Props> {
    static defaultProps: Props = {

    };

    constructor(props: Props) {
        super(props);
    }

    private sendEmail() {
        Linking.openURL(`mailto:${translate('appEmail')}`).catch(() => { });
    }

    private callPhone() {
        Linking.openURL(`tel:${translate('appPhone')}`).catch(() => { });
    }

    public render() {
        return (
            <ThemeConsumer>
                {(themeContext: ThemeContextValue) => (
                    <View style={[styles.container, this.props.style]}>
                        <Typography style={{ marginBottom: scale(25) }} type={TypographyType.headingSecondary}>
                            {translate('didntFindAnswerInSearchResults')}
                        </Typography>

                        <Typography style={{ fontWeight: 'bold' }} type={TypographyType.bodyRegular}>
                            {translate('writeUsEmail')}
                        </Typography>

                        <View style={{ height: scale(5) }} />

                        <TextButton onPress={() => { this.sendEmail() }} icon="envelope" color={TextButtonColor.purple}>
                            {translate('appEmail')}
                        </TextButton>

                        <View style={{ height: scale(20) }} />

                        {translate('appPhone') != '' ? (
                            <Fragment>
                                <Typography style={{ fontWeight: 'bold' }} type={TypographyType.bodyRegular}>
                                    {translate('callUs')}
                                </Typography>

                                <View style={{ height: scale(5) }} />

                                <TextButton onPress={() => { this.callPhone() }} icon="phone" color={TextButtonColor.purple}>
                                    {translate('appPhone')}
                                </TextButton>
                            </Fragment>
                        ) : null}
                    </View>
                )}
            </ThemeConsumer>
        );
    }
}

export interface DidntFindAnswersStyles {
    [index: string]: ViewStyle | TextStyle | ImageStyle;
    container: ViewStyle;
}

const styles = StyleSheet.create<DidntFindAnswersStyles>({
    container: {
        // flexDirection: 'column',
        // justifyContent: 'flex-start',
        // alignItems: 'stretch',
        // backgroundColor: 'orange',
        // padding: 15,
    },
});
