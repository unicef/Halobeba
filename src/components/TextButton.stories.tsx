import React from 'react';
import { Text, View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { TextButton, TextButtonColor, TextButtonSize } from './TextButton';
import { action } from '@storybook/addon-actions';

storiesOf('TextButton', module)

.add('default', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'stretch', backgroundColor:'white'}}>
        <TextButton onPress={ action('text button pressed') }>Default text button</TextButton>
    </View>
))

.add('purple', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'stretch', backgroundColor:'white'}}>
        <TextButton color={TextButtonColor.purple} onPress={ action('text button pressed') }>Purple text button</TextButton>
    </View>
))

.add('with icon', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'stretch', backgroundColor:'white'}}>
        <TextButton icon="envelope" onPress={ action('text button pressed') }>Text button with icon</TextButton>
        <View style={{height:20}} />
        <TextButton icon="chevron-left" onPress={ action('text button pressed') }>Text button with icon</TextButton>
    </View>
))

.add('small size', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'stretch', backgroundColor:'white'}}>
        <TextButton size={ TextButtonSize.small } onPress={ action('text button pressed') }>Small text button</TextButton>
    </View>
))

.add('underline', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'stretch', backgroundColor:'white'}}>
        <TextButton color={TextButtonColor.purple} textStyle={{textDecorationLine:'underline'}} onPress={ action('text button pressed') }>Underlined text button</TextButton>
    </View>
))
;