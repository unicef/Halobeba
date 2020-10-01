import React from 'react';
import { PixelRatio, Dimensions, ScaledSize, PlatformOSType, Platform } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import { ThemeStructure } from './ThemeStructure';
import { Theme, ThemeInfo } from './Theme';
import { themes, ASYNC_STORAGE_KEY_THEME_NAME } from './themes';

export interface ThemeContextValue {
    theme: ThemeStructure,
    themeInfo: ThemeInfo,
    orientation: Orientation,
    platformOS: PlatformOSType,
    windowWidth: number,
    windowHeight: number,
    getThemes: () => Theme[],
    /**
     * For example, name can be "defaultTheme"
     */
    changeTheme: (name: string) => void,
    /**
     * Returns DP number from the given percentage string ('8%'),
     * where dimension is by default the smaller window dimension (width or height).
     * 
     * This method is usually used for measures that don't accept percentage,
     * but need to be linearly responsive (font sizes for example)
     * 
     * Code is copied from [react-native-responsive-screen](https://github.com/marudy/react-native-responsive-screen)
     */
    percentageToDP: (percentage: string, dimension?: Dimension) => number
}

interface ThemeContextState {
    theme: ThemeStructure;
    themeInfo: ThemeInfo;
    orientation: Orientation,
    windowWidth: number,
    windowHeight: number,
}

/**
 * Use this context to theme your components (access theme values & change current theme)
 */
export const ThemeContext = React.createContext<ThemeContextValue>({} as ThemeContextValue);

export class ThemeProvider extends React.Component<object, ThemeContextState> {

    constructor(props: object) {
        super(props);
        let currentTheme = themes.getCurrentTheme();

        this.state = {
            theme: currentTheme?.theme,
            themeInfo: currentTheme.info,
            orientation: this.getOrientation(),
            windowWidth: Dimensions.get('window').width,
            windowHeight: Dimensions.get('window').height,
        };

        Dimensions.addEventListener('change', (changeArgs) => { this.onOrientationChange(changeArgs) });

        AsyncStorage.getItem(ASYNC_STORAGE_KEY_THEME_NAME).then((themeName: string | null) => {
            if (themeName) {
                this.changeTheme(themeName);
            }
        });
    }

    private getThemes = () => {
        return themes.getThemes();
    };

    private changeTheme = (name: string) => {
        themes.setCurrentTheme(name, this);
        let currentTheme = themes.getCurrentTheme();

        this.setState({
            theme: currentTheme.theme,
            themeInfo: currentTheme.info,
        });

        AsyncStorage.setItem(ASYNC_STORAGE_KEY_THEME_NAME, currentTheme.info.name).then(() => { });
    };

    private onOrientationChange(changeArgs: { window: ScaledSize, screen: ScaledSize }) {
        let newOrientation = this.getOrientation(changeArgs.window.width, changeArgs.window.height);
        
        themes.setOrientation(newOrientation);
        
        this.setState({
            orientation: newOrientation,
            windowWidth: changeArgs.window.width,
            windowHeight: changeArgs.window.height,
        });
    }

    private getOrientation(width: number = Dimensions.get('window').width, height: number = Dimensions.get('window').height): Orientation {
        return height > width ? 'portrait' : 'landscape';
    }

    private percentageToDP(percentage: string, dimension?: Dimension): number {
        if (dimension === 'width') return this.widthPercentageToDP(percentage);
        if (dimension === 'height') return this.heightPercentageToDP(percentage);
        return this.state.windowWidth <= this.state.windowHeight ? this.widthPercentageToDP(percentage) : this.heightPercentageToDP(percentage);
    }

    private widthPercentageToDP(widthPercent: number | string) {
        const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
        return PixelRatio.roundToNearestPixel(this.state.windowWidth * elemWidth / 100);
    };

    private heightPercentageToDP(heightPercent: number | string) {
        const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
        return PixelRatio.roundToNearestPixel(this.state.windowHeight * elemHeight / 100);
    };

    public render() {
        const contextValue: ThemeContextValue = {
            theme: this.state.theme,
            themeInfo: this.state.themeInfo,
            orientation: this.state.orientation,
            windowWidth: this.state.windowWidth,
            windowHeight: this.state.windowHeight,
            platformOS: Platform.OS,
            getThemes: this.getThemes.bind(this),
            changeTheme: this.changeTheme.bind(this),
            percentageToDP: this.percentageToDP.bind(this),
        };

        return (
            <ThemeContext.Provider value={contextValue}>{this.props.children}</ThemeContext.Provider>
        );
    }
}

type Orientation = 'portrait' | 'landscape';
type Dimension = 'width' | 'height';

export const ThemeConsumer = ThemeContext.Consumer;