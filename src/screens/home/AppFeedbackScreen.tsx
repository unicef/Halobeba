import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ViewStyle, ScrollView } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Typography, TypographyType } from '../../components/Typography';
import { TextButton, TextButtonColor } from '../../components/TextButton';
import { RoundedTextArea } from '../../components/RoundedTextArea';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';

export interface AppFeedbackScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, AppFeedbackScreenParams>;
}

export interface State {

}

export class AppFeedbackScreen extends React.Component<Props, State> {

    public constructor(props:Props) {
        super(props);

        this.setDefaultScreenParams();
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: AppFeedbackScreenParams = {
            
        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    private gotoBack() {
        this.props.navigation.goBack();
    }

    public render() {
        const screenParams = this.props.navigation.state.params!;

        return (
            <ThemeConsumer>
            {(themeContext:ThemeContextValue) => (
                <KeyboardAwareScrollView
                    style={{backgroundColor:'white'}}
                    contentContainerStyle={ [styles.container, {alignItems:'stretch', padding:themeContext.theme.screenContainer?.padding}] }
                >

                    {/* TITLE */}
                    <Typography type={TypographyType.headingPrimary}>
                        { translate('appFeedbackTitle') }
                    </Typography>

                    {/* SUB TITLE */}
                    <Typography type={TypographyType.bodyRegular}>
                        { translate('appFeedbackSubTitle') }
                    </Typography>

                    <View style={{height:themeContext.theme.variables?.sizes.verticalPaddingLarge}} />

                    {/* QUESTION 1 */}
                    <Typography type={TypographyType.bodyRegular} style={{fontWeight:'bold', fontSize:moderateScale(20), lineHeight:moderateScale(22), marginBottom:scale(10)}}>
                        { translate('appFeedbackQuestion1') }
                    </Typography>

                    <RoundedTextArea placeholder={ translate('fieldLabelComment') } style={ styles.textArea }></RoundedTextArea>

                    <View style={{height:themeContext.theme.variables?.sizes.verticalPaddingLarge}} />

                    {/* QUESTION 2 */}
                    <Typography type={TypographyType.bodyRegular} style={{fontWeight:'bold', fontSize:moderateScale(20), lineHeight:moderateScale(22), marginBottom:scale(10)}}>
                        { translate('appFeedbackQuestion2') }
                    </Typography>

                    <RoundedTextArea placeholder={ translate('fieldLabelComment') } style={ styles.textArea }></RoundedTextArea>

                    <View style={{height:themeContext.theme.variables?.sizes.verticalPaddingLarge}} />

                    {/* QUESTION 3 */}
                    <Typography type={TypographyType.bodyRegular} style={{fontWeight:'bold', fontSize:moderateScale(20), lineHeight:moderateScale(22), marginBottom:scale(10)}}>
                        { translate('appFeedbackQuestion3') }
                    </Typography>

                    <RoundedTextArea placeholder={ translate('fieldLabelComment') } style={ styles.textArea }></RoundedTextArea>

                    <View style={{height:themeContext.theme.variables?.sizes.verticalPaddingLarge}} />

                    {/* QUESTION 4 */}
                    <Typography type={TypographyType.bodyRegular} style={{fontWeight:'bold', fontSize:moderateScale(20), lineHeight:moderateScale(22), marginBottom:scale(10)}}>
                        { translate('appFeedbackQuestion4') }
                    </Typography>

                    <RoundedTextArea placeholder={ translate('fieldLabelComment') } style={ styles.textArea }></RoundedTextArea>

                    <View style={{height:themeContext.theme.variables?.sizes.verticalPaddingLarge}} />

                    {/* QUESTION 5 */}
                    <Typography type={TypographyType.bodyRegular} style={{fontWeight:'bold', fontSize:moderateScale(20), lineHeight:moderateScale(22), marginBottom:scale(10)}}>
                        { translate('appFeedbackQuestion5') }
                    </Typography>

                    <RoundedTextArea placeholder={ translate('fieldLabelComment') } style={ styles.textArea }></RoundedTextArea>

                    <View style={{height:themeContext.theme.variables?.sizes.verticalPaddingLarge}} />

                    {/* SUBMIT BUTTON */}
                    <RoundedButton
                        text = { translate('appFeedbackButtonSend') }
                        type = { RoundedButtonType.purple }
                        onPress={ () => {} }
                    />
                    
                    <View style={{height:themeContext.theme.variables?.sizes.verticalPaddingLarge}} />
                </KeyboardAwareScrollView>
            )}
            </ThemeConsumer>
        );
    }

}

export interface AppFeedbackScreenStyles {
    container?: ViewStyle;
    textArea?: ViewStyle;
}

const styles = StyleSheet.create<AppFeedbackScreenStyles>({
    container: {
        
    },

    textArea: {
        backgroundColor: '#F3F3F3',
        // shadowColor: 'black',
        // shadowOffset: {width:2, height:2},
        // shadowOpacity: 0.2,
        // elevation: 2,
    },
});
