import React from 'react';
import { SafeAreaView, View, Text, Button, StyleSheet, ViewStyle } from 'react-native';
import { NavigationStackProp, NavigationStackState, NavigationStackOptions } from 'react-navigation-stack';
import { ThemeContextValue, ThemeConsumer } from '../../themes/ThemeContext';
import { translate } from '../../translations/translate';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Typography, TypographyType } from '../../components/Typography';
import { TextButton, TextButtonColor } from '../../components/TextButton';
import { DateTimePicker, DateTimePickerType } from '../../components/DateTimePicker';
import { RoundedButton, RoundedButtonType } from '../../components/RoundedButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface ExaminationReminderScreenParams {

}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, ExaminationReminderScreenParams>;
}

export interface State {

}

export class ExaminationReminderScreen extends React.Component<Props, State> {

    public constructor(props:Props) {
        super(props);

        this.setDefaultScreenParams();
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: ExaminationReminderScreenParams = {
            
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
                    // themeContext.theme.screenContainer?.backgroundColor
                    style={{backgroundColor:'white'}}
                    keyboardShouldPersistTaps='always'
                    contentContainerStyle={ [styles.container] }
                >
                    <View style={{alignItems:'flex-start', padding:themeContext.theme.screenContainer?.padding}}>

                        {/* DESCRIPTION */}
                        <View style={{flexDirection:'row', justifyContent:'flex-start', alignItems:'center'}}>
                            <Icon
                                name={ "clock-outline" }
                                style={{ fontSize:scale(24), color:"#2BABEE", marginRight:scale(12) }}
                            />
                            <Typography type={TypographyType.bodyRegular} style={{flex:1}}>
                                {translate('examReminderDescription')}
                            </Typography>
                        </View>

                        <View style={{height:themeContext.theme.variables?.sizes.verticalPaddingLarge}} />

                        {/* DATE */}
                        <DateTimePicker
                            label={translate('examReminderDate')} type={ DateTimePickerType.date }
                            style={{alignSelf:'stretch'}}
                            onChange={ () => {} }
                        />

                        <View style={{height:themeContext.theme.variables?.sizes.verticalPaddingNormal}} />

                        {/* TIME */}
                        <DateTimePicker
                            label={translate('examReminderTime')} type={ DateTimePickerType.time }
                            style={{alignSelf:'stretch'}}
                            onChange={ () => {} }
                        />

                        <View style={{height:themeContext.theme.variables?.sizes.verticalPaddingLarge}} />

                        {/* SUBMIT BUTTON */}
                        <RoundedButton
                            text = {translate('buttonAddExamReminder')}
                            type = { RoundedButtonType.purple }
                            onPress={() => {}}
                        />

                        <View style={{height:themeContext.theme.variables?.sizes.verticalPaddingLarge}} />
                    </View>
                </KeyboardAwareScrollView>
            )}
            </ThemeConsumer>
        );
    }

}

export interface ExaminationReminderScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<ExaminationReminderScreenStyles>({
    container: {
        flex: 1,
    },
});
