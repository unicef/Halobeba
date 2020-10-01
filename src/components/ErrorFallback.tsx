import React, { FunctionComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle, ImageStyle, StatusBar } from 'react-native';
import { scale, moderateScale } from 'react-native-size-matters';
import { sendErrorReportWithEmail } from '../app/errors';

export type ErrorFallbackProps = {
    error?: Error;
    componentStack?: string;
    style?: StyleProp<ViewStyle>;
};

/**
 * When JSX error happens anywhere in the app, this component will show full screen.
 * 
 * This component is used only as App component ErrorBoundary.
 * You can create custom error boundaries if you desire, for parts of your UI.
 */
export const ErrorFallback: FunctionComponent<ErrorFallbackProps> = (props) => {
    const { error, componentStack, style }: ErrorFallbackProps = props;

    return (
        <View style={[styles.container, style]}>
            <StatusBar barStyle="light-content" />

            <Text style={[styles.textTitle]}>
                Internal Error
            </Text>

            {/* <Text style={[styles.text]}>
                Restart the app please.
            </Text> */}

            <TouchableOpacity style={styles.button} onPress={() => { sendErrorReportWithEmail(error, componentStack) }}>
                <Text style={styles.buttonText}>
                    Send bug report
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export type ErrorFallbackStyles = {
    [index: string]: ViewStyle | TextStyle | ImageStyle;
    container: ViewStyle;
    textTitle: TextStyle;
    text: TextStyle;
    button: ViewStyle;
    buttonText: TextStyle;
};

const styles = StyleSheet.create<ErrorFallbackStyles>({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#d32f2f',
    },

    textTitle: {
        fontWeight: 'bold',
        fontSize: moderateScale(30),
        color: 'white',
        marginBottom: scale(20),
    },

    text: {
        fontSize: moderateScale(20),
        color: 'white',
        marginBottom: scale(30),
    },

    button: {
        backgroundColor: '#b71c1c',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: scale(25),
        paddingVertical: moderateScale(10),
        paddingHorizontal: moderateScale(30),
    },

    buttonText: {
        color: 'white',
        fontSize: moderateScale(16),
    },
});