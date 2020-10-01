import React from 'react';
import { SafeAreaView, StyleSheet, ViewStyle, StatusBar, View } from 'react-native';
import { NavigationStackProp, NavigationStackState } from 'react-navigation-stack';
import { GestureResponderEvent } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Storybook from '../../storybook';
import { IconButton } from "react-native-paper";
import { scale } from 'react-native-size-matters';

export interface Props {
    navigation: NavigationStackProp<NavigationStackState>;
}

export class StorybookScreen extends React.Component<Props, object> {

    public constructor(props:Props) {
        super(props);
    }

    private onCloseIconPress() {
        this.props.navigation.goBack();
    };

    public render() {
        return (
            <SafeAreaView style={ styles.container }>
                <StatusBar barStyle="dark-content" />
                <View style={{flex:1}}>
                    <Storybook />
                    <IconButton
                        icon="close"
                        size={scale(30)}
                        color="white"
                        style={{ position:'absolute', top:10, right:5, shadowOffset:{width:1,height:1}, shadowColor:'black', shadowOpacity:0.7, elevation:2 }}
                        onPress={ () => {this.onCloseIconPress()} }
                    />
                </View>
            </SafeAreaView>
        );
    }

}

export interface StorybookScreenStyles {
    container?: ViewStyle;
}

const styles = StyleSheet.create<StorybookScreenStyles>({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: 'white',
    },
});
