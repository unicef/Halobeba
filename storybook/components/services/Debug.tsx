import React from 'react';
import { ScrollView, View, Text, TextInput } from 'react-native';
import { ScaledSheet, moderateScale, scale } from "react-native-size-matters";
import { Typography, TypographyType } from "../../../src/components/Typography";
import { Button, Colors } from "react-native-paper";
import { dataRealmStore, userRealmStore } from '../../../src/stores';
import { syncData } from '../../../src/app/syncData';
import RNFS from 'react-native-fs';

type State = {
    myDebuggText?: string;
};

export class Debug extends React.Component<object, State> {
    constructor(props:object) {
        super(props);
        
        this.initState();
        this.loadMyDebbugText();
    }

    private initState() {
        this.state = {
            myDebuggText: '',
        };
    }

    private async loadMyDebbugText() {
        var path = RNFS.DocumentDirectoryPath + '/my_debug.txt';

        try {
            if (RNFS.exists(path)) {
                const fileContent = await RNFS.readFile(path);
                this.setState({
                    myDebuggText: fileContent,
                });
            }
        } catch(e) {

        }
    }

    private deleteAllOnboardingData() {
        dataRealmStore.deleteVariable('userEmail');
        dataRealmStore.deleteVariable('userIsLoggedIn');
        dataRealmStore.deleteVariable('followGrowth');
        dataRealmStore.deleteVariable('followDoctorVisits');
        dataRealmStore.deleteVariable('followDevelopment');
        dataRealmStore.deleteVariable('allowAnonymousUsage');
        dataRealmStore.deleteVariable('userIsOnboarded');
        dataRealmStore.deleteVariable('userEnteredChildData');
        dataRealmStore.deleteVariable('userParentalRole');
        dataRealmStore.deleteVariable('userName');
    }

    private logRealmPath() {
        // console.log( userRealmStore.realm?.path.replace('user.realm', '') );
        console.log( RNFS.DocumentDirectoryPath );
    }

    private async syncData() {
        console.warn('Sync started');
        const timestamp = Math.round(Date.now()/1000);
        
        await syncData.sync();
        
        const timestampDiff = Math.round(Date.now()/1000) - timestamp;
        console.warn(`Sync finished in ${timestampDiff} s`);
    }

    private async deleteLastSyncTimestamp() {
        await dataRealmStore.deleteVariable('lastSyncTimestamp');
        console.log('Deleted');
    }

    private getLastSyncTimestamp() {
        const lastSyncTimestamp = dataRealmStore.getVariable('lastSyncTimestamp');
        console.warn(lastSyncTimestamp);
    }

    render() {
        return (
            <ScrollView contentContainerStyle={{ padding: 24, alignItems: 'center' }}>
                <Typography type={TypographyType.headingSecondary}>
                    Debug
                </Typography>

                <Button mode="contained" uppercase={false} onPress={ () => {this.logRealmPath()} } color={Colors.blue700}>
                    Log realms path
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={ () => {this.deleteAllOnboardingData()} } color={Colors.blue700}>
                    Delete all onboarding data
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={ () => {this.syncData()} } color={Colors.blue700}>
                    Sync data
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={ () => {this.deleteLastSyncTimestamp()} } color={Colors.blue700}>
                    Delete last sync timestamp
                </Button>
                <View style={{ height: scale(10) }} />

                <Button mode="contained" uppercase={false} onPress={ () => {this.getLastSyncTimestamp()} } color={Colors.blue700}>
                    Get last sync timestamp
                </Button>
                <View style={{ height: scale(20) }} />

                <Typography type={TypographyType.headingSecondary}>
                    my_debug.txt
                </Typography>

                <Text
                    style={{
                        width:'100%',
                        // borderWidth: 2,
                        // borderColor: 'grey',
                    }}
                >
                    {this.state.myDebuggText}
                </Text>
            </ScrollView>
        );
    }
}