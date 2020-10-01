import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { RateAChild } from './RateAChild';

storiesOf('RateAChild', module)

.add('default', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'stretch', backgroundColor:'white'}}>
        <RateAChild />
    </View>
))
;