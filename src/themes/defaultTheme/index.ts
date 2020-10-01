import { Theme } from "../Theme";
import { variables } from "./variables";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import { Colors } from "react-native-paper";

/**
 * Default theme.
 */
export const defaultTheme = new Theme({
    info: {
        title: 'Default',
        name: 'defaultTheme',
        dark: false,
    },

    theme: {
        variables: variables,

        screenContainer: {
            padding: scale(20),
            backgroundColor: variables?.colors?.background
        },

        contentContainer: {
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            padding: scale(15),
        },

        headerTitle: {
            color: variables?.colors?.headerTitle,
            fontFamily: 'SFUIDisplay-Bold',
            fontSize: moderateScale(22),
        },

        snackbarNormal: {
            textColor: variables?.colors?.primary,
            fontSize: moderateScale(16),
        },

        snackbarError: {
            backgroundColor: Colors.red500,
            fontSize: moderateScale(16),
            actionButtonColor: 'white',
            textColor: 'white',
        }
    }
});