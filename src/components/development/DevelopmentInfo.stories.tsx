import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import {DevelopmentInfo} from './DevelopmentInfo';

const dummyHtml = `
    <p>Obavestite pedijatra ako primetite da dete:</p>
    <ul>
        <li>Ne reguje na glasne zvuke</li>
        <li>Ne prati stvari koje se pomeraju</li>
        <li>Ne prinosi ruke ustima</li>
        <li>Ne prinosi ruke ustima</li>
        <li>Ne može da odigne glavu od podloge kada leži na stomaku</li>
    </ul>
`

storiesOf('Development info', module)
    .add('default', () => (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'stretch', backgroundColor: 'white' }}>
            <DevelopmentInfo 
                html={dummyHtml}
            />
        </View>
    ));