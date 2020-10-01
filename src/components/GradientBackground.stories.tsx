import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { GradientBackground } from './GradientBackground';

storiesOf('GradientBackground', module)

.add('default', () => (
    <GradientBackground>
        <Text style={{color:'white'}}>It can contain any components</Text>
    </GradientBackground>
))

.add('custom colors', () => (
    <GradientBackground colors={['yellow', 'red']}>
        <Text style={{color:'black'}}>It can contain any components</Text>
    </GradientBackground>
))
;