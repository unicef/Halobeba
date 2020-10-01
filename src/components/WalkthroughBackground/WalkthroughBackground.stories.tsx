import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { WalkthroughBackground, WalkthroughBackgroundType } from './index';
import { Typography, TypographyType } from '../Typography';

storiesOf('WalkthroughBackground', module)

.add('walkthrough1', () => (
    <WalkthroughBackground type={ WalkthroughBackgroundType.walkthrough1 }>
        <Typography type={ TypographyType.headingPrimary } style={{color:'white', textAlign:'center'}}>Heading primary</Typography>
        <Typography type={ TypographyType.bodyRegular } style={{color:'white', textAlign:'center'}}>Aliquip aute consectetur fugiat in velit. Occaecat laborum amet consequat amet laboris fugiat exercitation et do irure laboris. </Typography>
    </WalkthroughBackground>
))

.add('walkthrough2', () => (
    <WalkthroughBackground type={ WalkthroughBackgroundType.walkthrough2 }>
        <Typography type={ TypographyType.headingPrimary } style={{color:'#262628', textAlign:'center'}}>Heading primary</Typography>
        <Typography type={ TypographyType.bodyRegular } style={{color:'#262628', textAlign:'center'}}>Aliquip aute consectetur fugiat in velit. Occaecat laborum amet consequat amet laboris fugiat exercitation et do irure laboris. </Typography>
    </WalkthroughBackground>
))

.add('walkthrough3', () => (
    <WalkthroughBackground type={ WalkthroughBackgroundType.walkthrough3 }>
        <Typography type={ TypographyType.headingPrimary } style={{color:'white', textAlign:'center'}}>Heading primary</Typography>
        <Typography type={ TypographyType.bodyRegular } style={{color:'white', textAlign:'center'}}>Aliquip aute consectetur fugiat in velit. Occaecat laborum amet consequat amet laboris fugiat exercitation et do irure laboris. </Typography>
    </WalkthroughBackground>
))

.add('walkthrough4', () => (
    <WalkthroughBackground type={ WalkthroughBackgroundType.walkthrough4 }>
        <Typography type={ TypographyType.headingPrimary } style={{color:'#262628', textAlign:'center'}}>Heading primary</Typography>
        <Typography type={ TypographyType.bodyRegular } style={{color:'#262628', textAlign:'center'}}>Aliquip aute consectetur fugiat in velit. Occaecat laborum amet consequat amet laboris fugiat exercitation et do irure laboris. </Typography>
    </WalkthroughBackground>
))

.add('walkthrough5', () => (
    <WalkthroughBackground type={ WalkthroughBackgroundType.walkthrough5 }>
        <Typography type={ TypographyType.headingPrimary } style={{color:'#262628', textAlign:'center'}}>Heading primary</Typography>
        <Typography type={ TypographyType.bodyRegular } style={{color:'#262628', textAlign:'center'}}>Aliquip aute consectetur fugiat in velit. Occaecat laborum amet consequat amet laboris fugiat exercitation et do irure laboris. </Typography>
    </WalkthroughBackground>
))
;