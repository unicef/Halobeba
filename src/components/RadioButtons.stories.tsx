import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { RadioButtons } from './RadioButtons';

storiesOf('RadioButtons', module)

.add('default', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'stretch', backgroundColor:'white'}}>
        <RadioButtons
            value="mama"
            buttons={ [{text:'Mama', value:'mama'}, {text:'Tata', value:'tata'}] }
            onChange={ action('value changed') }
        />
    </View>
))
;