import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ScaledSheet, moderateScale, scale } from "react-native-size-matters";
import { Typography, TypographyType } from "../../../src/components/Typography";
import { Button, Colors } from "react-native-paper";
import { LoginManager, GraphRequest, GraphRequestManager, AccessToken } from 'react-native-fbsdk';
import { facebook } from "../../../src/app/facebook";

export class Facebook extends React.Component {
    private logIn = async () => {
        const loginResult = await facebook.logIn();

        if (loginResult.isCancelled) {
            console.warn("Login cancelled");
        } else if (loginResult.error) {
            console.warn("Login fail with error: " + loginResult.error);
        } else {
            console.warn("Login success with permissions: " + loginResult.grantedPermissions?.toString());
        }
    };

    private getUser = async () => {
        const currentUser = await facebook.getCurrentUser();
        console.warn( JSON.stringify(currentUser, null, 4) );
    };

    private getAccessToken = async () => {
        const accessToken = await facebook.getCurrentAccessToken();
        console.warn( JSON.stringify(accessToken, null, 4) );
    };

    private logOut = async () => {
        facebook.logOut();
        console.warn('Logged out');
    };

    render() {
        return (
            <ScrollView contentContainerStyle={{ flex: 1, padding: 24, alignItems: 'center' }}>
                <Typography type={TypographyType.headingSecondary}>
                    Facebook
                </Typography>

                <Button mode="contained" uppercase={false} onPress={this.logIn} color={Colors.blue700}>
                    Log in
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.getUser} color={Colors.blue700}>
                    Get user
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.getAccessToken} color={Colors.blue700}>
                    Get access token
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.logOut} color={Colors.blue700}>
                    Logout
                </Button>
                <View style={{ height: scale(10) }} />
            </ScrollView>
        );
    }
}