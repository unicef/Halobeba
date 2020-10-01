import React from 'react';
import { Text, View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { Typography, TypographyType } from './Typography';

storiesOf('Typography', module)

.add('all types', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'stretch', backgroundColor:'white'}}>
        <Typography type={ TypographyType.logo }>Logo</Typography>
        <View style={{height:16}} />
        
        <Typography type={ TypographyType.headingPrimary }>Heading primary</Typography>
        
        <Typography type={ TypographyType.headingSecondary }>Heading secondary</Typography>
        <View style={{height:16}} />

        <Typography>Body regular</Typography>
        <View style={{height:16}} />

        <Typography type={ TypographyType.bodyRegularLargeSpacing }>Body regular large vertical spacing</Typography>
        <View style={{height:16}} />
    </View>
))
;