import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { RoundedTextInput } from './RoundedTextInput';

storiesOf('RoundedTextInput', module)

.add('default', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'stretch', backgroundColor:'white'}}>
        <RoundedTextInput label="Username" onChange={ action('text changed') } />
    </View>
))

.add('with icon', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'stretch', backgroundColor:'white'}}>
        <RoundedTextInput label="Email" icon="email-outline" onChange={ action('text changed') } />
    </View>
))

.add('with suffix', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'flex-start', backgroundColor:'white'}}>
        <RoundedTextInput label="Weight" suffix="g" icon="weight" style={{width:150}} onChange={ action('text changed') } />
    </View>
))
;