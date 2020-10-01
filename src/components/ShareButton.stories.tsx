import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { ShareButton } from './ShareButton';

storiesOf('ShareButton', module)

.add('default', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
        <ShareButton onPress={ action('share button clicked') } />
    </View>
))
;