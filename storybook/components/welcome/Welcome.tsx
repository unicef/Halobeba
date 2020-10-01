import React from 'react';
import { View, Text } from 'react-native';
import { displayName } from '../../../app.json';

export class Welcome extends React.Component {
    render() {
        return (
            <View style={{ flex:1, padding:24 }}>
                <Text style={{ fontSize: 28, marginBottom: 18 }}>Welcome</Text>
                <Text style={{ fontSize: 16, marginBottom: 16, lineHeight: 20 }}>
                    This is the catalog of UI components used in "{displayName}" application.
                </Text>
            </View>
        );
    }
}