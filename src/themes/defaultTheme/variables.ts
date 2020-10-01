import { ThemeStructure } from "../ThemeStructure";
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';

type ThemeVariables = typeof ThemeStructure.prototype.variables;

export const variables: ThemeVariables = {
    colors: {
        primary: '#AA40BF',
        primaryText: 'white',
        secondary: '#29a19c',
        secondaryText: '#fefefe',

        background: '#F7F8FA',
        surface: '#ffffff',
        surfaceText: '#2e343b',
        backdrop: 'rgba(34,40,49,0.6)',

        switchColor: '#A940BE',
        checkboxColor: '#A940BE',

        headerBackground: '#F8F8F8',
        headerBackButton: '#AA40BF',
        headerIcon: 'black',
        headerTitle: '#262626',
    },

    sizes: {
        verticalPaddingNormal: scale(15),
        verticalPaddingSmall: scale(5),
        verticalPaddingLarge: scale(30),
    }
};