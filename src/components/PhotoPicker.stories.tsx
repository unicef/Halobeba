import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { PhotoPicker } from './PhotoPicker';
import { Typography, TypographyType } from './Typography';

storiesOf('PhotoPicker', module)

.add('default', () => (
    <View style = {{flex:1, padding:0, justifyContent:'flex-start', alignItems:'stretch', backgroundColor:'white'}}>
        <Typography type={ TypographyType.headingSecondary }>Choose photo</Typography>
        
        {/* imageData="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==" */}
        <PhotoPicker onChange={ action('image changed') } />
    </View>
))
;