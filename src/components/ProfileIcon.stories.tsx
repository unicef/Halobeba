import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { ProfileIcon } from './ProfileIcon';

storiesOf('ProfileIcon', module)

.add('default', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'flex-start', backgroundColor:'white'}}>
        <ProfileIcon />
    </View>
))

.add('with image', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'flex-start', backgroundColor:'white'}}>
        <ProfileIcon image="https://images.pexels.com/photos/266098/pexels-photo-266098.jpeg?cs=srgb&dl=adorable-baby-beautiful-child-266098.jpg&fm=jpg" />
    </View>
))
;