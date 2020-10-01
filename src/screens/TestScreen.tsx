import React from 'react';
import { View, SafeAreaView, Text,Button } from 'react-native';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';

export interface TestScreenParams {
    text?: string;
}

export interface Props {
    navigation: NavigationStackProp<NavigationStackState, TestScreenParams>;
}

/**
 * Use this screen for testing.
 */
export class TestScreen extends React.Component<Props, object> {

    public constructor(props: Props) {
        super(props);
        this.setDefaultScreenParams();
    }

    private setDefaultScreenParams() {
        let defaultScreenParams: TestScreenParams = {
            text: '',
        };

        if (this.props.navigation.state.params) {
            this.props.navigation.state.params = Object.assign({}, defaultScreenParams, this.props.navigation.state.params);
        } else {
            this.props.navigation.state.params = defaultScreenParams;
        }
    }

    public render() {
        return (
            <SafeAreaView style={ {flex:1} }>
                <View style={ {flex:1, flexDirection:'column', justifyContent:'flex-start', alignItems:'stretch'} }>
                    <Text style={ {fontSize:20, textAlign:'left'} }> TestScreen </Text>
                    <Button title="About" onPress={() => {this.props.navigation.navigate('RootModalStackNavigator_AboutScreen')}} />
                </View>
            </SafeAreaView>
        );
    }

}
