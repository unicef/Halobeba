import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { Tag, TagColor } from './Tag';

storiesOf('Tag', module)

.add('all colors', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'flex-start', backgroundColor:'white'}}>
        <Tag>Default tag</Tag>
        <View style={{height:20}}/>
        
        <Tag color={ TagColor.orange }>Orange tag</Tag>
        <View style={{height:20}}/>

        <Tag color={ TagColor.green }>Green tag</Tag>
        <View style={{height:20}}/>
    </View>
))
;