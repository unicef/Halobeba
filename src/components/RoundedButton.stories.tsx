import React from 'react';
import { Alert, View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { RoundedButton, RoundedButtonType } from './RoundedButton';
import { GradientBackground } from './GradientBackground';

storiesOf('RoundedButton', module)

.add('default', () => (
    <GradientBackground style = {{padding:24, justifyContent:'center', alignItems:'stretch'}}>
        <RoundedButton
            text = "Default button"
            onPress={action('default button clicked')}
        />
    </GradientBackground>
))

.add('disabled', () => (
    <GradientBackground style = {{padding:24, justifyContent:'center', alignItems:'stretch'}}>
        <RoundedButton
            text = "Disabled button"
            disabled = {true}
            onPress={action('disabled button clicked')}
        />
    </GradientBackground>
))

.add('show arrow', () => (
    <GradientBackground style = {{padding:24, justifyContent:'center', alignItems:'stretch'}}>
        <RoundedButton
            text = "Show arrow"
            showArrow = {true}
            onPress={action('button with arrow clicked')}
        />
    </GradientBackground>
))

.add('type - google', () => (
    <GradientBackground style = {{padding:24, justifyContent:'center', alignItems:'stretch'}}>
        <RoundedButton
            type = { RoundedButtonType.google }
            onPress={action('google button clicked')}
        />
    </GradientBackground>
))

.add('type - facebook', () => (
    <GradientBackground style = {{padding:24, justifyContent:'center', alignItems:'stretch'}}>
        <RoundedButton
            type = { RoundedButtonType.facebook }
            onPress={action('facebook button clicked')}
        />
    </GradientBackground>
))

.add('type - purple', () => (
    <GradientBackground style = {{padding:24, justifyContent:'center', alignItems:'stretch'}}>
        <RoundedButton
            text = "Purple button"
            type = { RoundedButtonType.purple }
            onPress={action('purple button clicked')}
        />
    </GradientBackground>
))

.add('type - hollow white', () => (
    <GradientBackground style = {{padding:24, justifyContent:'center', alignItems:'stretch'}}>
        <RoundedButton
            text = "Hollow white button"
            type = { RoundedButtonType.hollowWhite }
            onPress={action('hollow white button clicked')}
        />
    </GradientBackground>
))

.add('type - hollow purple', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'stretch', backgroundColor:'white'}}>
        <RoundedButton
            text = "Hollow purple button"
            type = { RoundedButtonType.hollowPurple }
            onPress={action('hollow purple button clicked')}
        />
    </View>
))
;