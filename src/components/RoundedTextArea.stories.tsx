import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { RoundedTextArea } from './RoundedTextArea';

storiesOf('RoundedTextArea', module)

.add('default', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'stretch', backgroundColor:'white'}}>
        <RoundedTextArea label="Comments" onChange={ action('text area changed') } />
    </View>
))
;