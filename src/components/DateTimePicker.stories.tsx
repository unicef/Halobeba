import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { DateTimePicker, DateTimePickerType } from './DateTimePicker';

storiesOf('DateTimePicker', module)

.add('date', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'stretch', backgroundColor:'white'}}>
        <DateTimePicker label="Date" type={ DateTimePickerType.date } onChange={ action('text changed') } />
    </View>
))

.add('time', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'stretch', backgroundColor:'white'}}>
        <DateTimePicker label="Time" type={ DateTimePickerType.time } onChange={ action('text changed') } />
    </View>
))
;