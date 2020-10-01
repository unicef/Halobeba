import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { action } from '@storybook/addon-actions';
import { SearchInput, SearchInputSize } from './SearchInput';

storiesOf('SearchInput', module)

.add('default', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
        <SearchInput placeholder="Enter search term" onChange={ action('searching') } style={{width:'100%'}} />
    </View>
))

.add('small', () => (
    <View style = {{flex:1, padding:24, justifyContent:'center', alignItems:'center', backgroundColor:'white'}}>
        <SearchInput placeholder="Enter search term" size={SearchInputSize.small} onChange={ action('searching') } style={{width:'100%'}} />
    </View>
))
;