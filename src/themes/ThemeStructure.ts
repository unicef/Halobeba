import { ViewStyle, TextStyle } from "react-native";

/**
 * Describes the structure of the theme, of course you are
 * free to change this class as you see fit.
 * 
 * After you update this class, you need to update all theme files
 * (defaultTheme/index.ts etc)
 */
export class ThemeStructure {
    variables?: Variables;
    screenContainer?: ViewStyle;
    contentContainer?: ViewStyle;
    headerTitle?: TextStyle;
    snackbarNormal?: Snackbar;
    snackbarError?: Snackbar;
}

interface Variables {
    colors?: {
        /**
         * Most frequently displayed color across your application.
         */
        primary?: string;
        primaryText?: string;
        /**
         * Used to accent and distinguish certain parts of your application.
         */
        secondary?: string;
        secondaryText?: string;

        /**
         * Application background color.
         */
        background?: string;
        /**
         * Background color for elements containing content, such as cards, lists etc.
         */
        surface?: string;
        surfaceText?: string;
        /**
         * Modals backdrop color.
         */
        backdrop?: string;

        switchColor?: string;
        checkboxColor?: string;

        headerBackground?: string;
        headerBackButton?: string;
        headerIcon?: string;
        headerTitle?: string;
    },

    sizes: {
        verticalPaddingNormal: number,
        verticalPaddingSmall: number,
        verticalPaddingLarge: number,
    },
}

interface Snackbar {
    textColor?: string;
    actionButtonColor?: string;
    backgroundColor?: string;
    fontSize?: number;
}