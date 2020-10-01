import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { ScaledSheet, moderateScale, scale } from "react-native-size-matters";
import { Typography, TypographyType } from "../../../src/components/Typography";
import { Button, Colors } from "react-native-paper";
import RNFS from "react-native-fs";
import { googleAuth } from "../../../src/app/googleAuth";
import { googleDrive } from "../../../src/app/googleDrive";

export class Google extends React.Component {
    private googleLogIn = async () => {
        let user = await googleAuth.signIn();
        console.warn(JSON.stringify(user, null, 4));
    };

    private googleIsLoggedIn = async () => {
        const isSignedIn = await googleAuth.isSignedIn();
        console.warn(isSignedIn);
    };

    private googleGetUser = async () => {
        const currentUser = await googleAuth.getCurrentUser();
        console.warn(JSON.stringify(currentUser, null, 4));
    };

    private googleGetTokens = async () => {
        const tokens = await googleAuth.getTokens();
        console.warn(JSON.stringify(tokens, null, 4));
    };

    private googleLogout = async () => {
        await googleAuth.signOut();
        console.warn('Logged out');
    };

    private gdriveCreateFile = async () => {
        const response = await googleDrive.createFileMultipart({
            name: 'file1.txt',
            content: `Hello file`,
            parentFolderId: '1hRrrAeG9UAiqZFeyHNWdycOLgMA6ztn4', // root
            contentType: 'text/plain',
        });

        if (response instanceof Error) {
            console.warn(response.message);
        } else {
            console.warn('File created. ID = ', response);
        }
    };

    private createPermissions = async () => {
        const response = await googleDrive.createPermissions(
            '1hryg0QQEhW6ZgjFET1mQZWBaLPJm6TrP', // fileId
            {
                emailAddress: 'halobebaapp@gmail.com',
                role: 'writer',
                type: 'user',
            },
            {
                emailMessage: `This is your backup.`,
            }
        );

        if (response instanceof Error) {
            console.warn(response.message);
        } else {
            console.warn('Permission created', response);
        }
    }

    private gdriveCreateFolder = async () => {
        const response = await googleDrive.safeCreateFolder({
            name: 'HaloBeba',
            parentFolderId: 'root',
        });

        if (response instanceof Error) {
            console.warn(response.message);
        } else {
            console.warn('Folder created. ID = ', response);
        }
    };

    private gdriveGetMetadata = async () => {
        const response = await googleDrive.getMetadata(
            '1Qxn-e29NpmPvXg6fRRTgZC67lwYnPi_M'
        );

        if (response instanceof Error) {
            console.warn(response.message);
        } else {
            console.warn(JSON.stringify(response, null, 4));
        }
    };

    private gdriveGetId = async () => {
        const response = await googleDrive.getId({
            name: 'HaloBeba',
            parentFolderId: 'root',
            mimeType: 'application/vnd.google-apps.folder',
            trashed: false,
        });

        if (response instanceof Error) {
            console.warn(response.message);
        } else {
            console.warn(response);
        }
    };

    private gdriveGetFiles = async () => {
        const response = await googleDrive.list({
            filter: 'trashed=false',
            orderBy: 'name asc'
        });

        if (response instanceof Error) {
            console.warn(response.message);
        } else {
            console.warn(JSON.stringify(response, null, 4));
        }
    };

    private gdriveDownloadFile = async () => {
        const fileId = '1Qxn-e29NpmPvXg6fRRTgZC67lwYnPi_M';
        const filePath = RNFS.TemporaryDirectoryPath + '/foo.txt';

        const response = await googleDrive.download({
            fileId,
            filePath,
        });

        if (response instanceof Error) {
            console.warn(response.message);
        } else {
            const fileContent = await RNFS.readFile(filePath);
            console.warn(fileContent);
        }
    };

    render() {
        return (
            <ScrollView contentContainerStyle={{ flex: 1, padding: 24, alignItems: 'center' }}>
                {/* GOOGLE AUTH */}
                <Typography type={TypographyType.headingSecondary}>
                    Google Auth
                </Typography>

                <Button mode="contained" uppercase={false} onPress={this.googleLogIn} color={Colors.blue700}>
                    Log in
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.googleIsLoggedIn} color={Colors.blue700}>
                    Is logged in?
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.googleGetUser} color={Colors.blue700}>
                    Get user
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.googleGetTokens} color={Colors.blue700}>
                    Get tokens
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.googleLogout} color={Colors.blue700}>
                    Logout
                </Button>
                <View style={{ height: scale(30) }} />

                {/* GOOGLE DRIVE */}
                <Typography type={TypographyType.headingSecondary}>
                    Google Drive
                </Typography>

                <Button mode="contained" uppercase={false} onPress={this.gdriveCreateFolder} color={Colors.deepPurple500}>
                    Create folder
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.gdriveCreateFile} color={Colors.deepPurple500}>
                    Create file
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.createPermissions} color={Colors.deepPurple500}>
                    Give permissions
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.gdriveGetMetadata} color={Colors.deepPurple500}>
                    Get metadata
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.gdriveGetId} color={Colors.deepPurple500}>
                    Get ID
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.gdriveGetFiles} color={Colors.deepPurple500}>
                    Get files
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={this.gdriveDownloadFile} color={Colors.deepPurple500}>
                    Download file
                </Button>
                <View style={{ height: scale(10) }} />
            </ScrollView>
        );
    }
}