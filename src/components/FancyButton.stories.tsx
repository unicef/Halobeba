import React from 'react';
import { ScrollView, View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { FancyButton, FancyButtonType } from './FancyButton';

storiesOf('FancyButton', module)

.add('all buttons', () => (
    <ScrollView contentContainerStyle={{padding:10, backgroundColor:'white'}}>
        <View style={{flexDirection:'row'}}>
            <FancyButton type={ FancyButtonType.growth } style={{flex:1}} onPress={ action('button clicked') } />
            <FancyButton type={ FancyButtonType.doctor } style={{flex:1}} onPress={ action('button clicked') } />
        </View>

        <View style={{flexDirection:'row'}}>
            <FancyButton type={ FancyButtonType.vaccination } style={{flex:1}} onPress={ action('button clicked') } />
            <FancyButton type={ FancyButtonType.development } style={{flex:1}} onPress={ action('button clicked') } />
        </View>

        <View style={{flexDirection:'row'}}>
            <FancyButton type={ FancyButtonType.food } style={{flex:1}} onPress={ action('button clicked') } />
            <FancyButton type={ FancyButtonType.health } style={{flex:1}} onPress={ action('button clicked') } />
        </View>

        <View style={{flexDirection:'row'}}>
            <FancyButton type={ FancyButtonType.safety } style={{flex:1}} onPress={ action('button clicked') } />
            <FancyButton type={ FancyButtonType.games } style={{flex:1}} onPress={ action('button clicked') } />
        </View>

        <View style={{flexDirection:'row'}}>
            <FancyButton type={ FancyButtonType.parents } style={{flex:1}} onPress={ action('button clicked') } />
            <FancyButton type={ FancyButtonType.faq } style={{flex:1}} onPress={ action('button clicked') } />
        </View>

        <View style={{flexDirection:'row'}}>
            <FancyButton title="O nama" style={{flex:1}} onPress={ action('button clicked') } />
            <FancyButton title="Kontakt" style={{flex:1}} onPress={ action('button clicked') } />
        </View>
    </ScrollView>
))
;