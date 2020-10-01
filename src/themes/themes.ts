import { Dimensions, PlatformOSType, Platform, PixelRatio } from "react-native";
import { Theme } from "./Theme";
import { ThemeProvider } from "./ThemeContext";
import { registeredThemes } from "./registeredThemes";

export const DEFAULT_THEME_NAME = 'defaultTheme';
export const ASYNC_STORAGE_KEY_THEME_NAME = '@themeName';

let windowWidth = Dimensions.get('window').width;
let windowHeight = Dimensions.get('window').height;

/**
 * This singleton contains several useful theme related methods.
 */
class Themes {
    private static instance: Themes;
    private themes: Theme[];
    private currentTheme: Theme;
    private orientation: Orientation;
    private platformOS: PlatformOSType;

    private constructor() {
        this.extendThemes(registeredThemes);
        this.themes = registeredThemes;
        this.currentTheme = this.getTheme(DEFAULT_THEME_NAME);
        this.orientation = this.getSystemOrientation();
        this.platformOS = Platform.OS;
    }

    static getInstance(): Themes {
        if (!Themes.instance) {
            Themes.instance = new Themes();
        }
        return Themes.instance;
    }

    public getTheme(themeName:string) {
        let rval: Theme = {info:{title:'', name:'', dark:false}, theme:{}};

        for (let i in this.themes) {
            let theme = this.themes[i];
            if (theme.info.name === themeName) {
                rval = theme;
            }
        }

        return rval;
    }

    public getCurrentTheme() {
        return this.currentTheme;
    }

    public getThemes() {
        return this.themes;
    }

    /**
     * Change current theme, it can only be called from ThemeProvider class.
     * 
     * If you want to change current theme from component, use ThemeContext.changeTheme()
     */
    public setCurrentTheme(themeName: string, themeProvider: ThemeProvider) {
        for (let i in this.themes) {
            let theme = this.themes[i];
            if (theme.info.name === themeName) {
                this.currentTheme = theme;
            }
        }
    }

    public setOrientation(orientation:Orientation) {
        this.orientation = orientation;
    }

    public getOrientation(): Orientation {
        return this.orientation;
    }

    public getPlatformOS() {
        return this.platformOS;
    }

    /**
     * Returns DP number from the given percentage string ('8%'),
     * where dimension is smaller window dimension (width or height).
     * 
     * This method is usually used for measures that don't accept percentage,
     * but need to be linearly responsive (font sizes for example)
     * 
     * Code is copied from [react-native-responsive-screen](https://github.com/marudy/react-native-responsive-screen)
     */
    public percentageToDP(percentage: string): number {
        return windowWidth <= windowHeight ? this.widthPercentageToDP(percentage) : this.heightPercentageToDP(percentage);
    }

    /**
     * Will extend given themes with base themes.
     * 
     * WARNING: Currently there can only be one level of extending.
     */
    private extendThemes(themes: Theme[]): void {
        // Validate that only one level of extension is given
        let hasMultipleLevels = false;

        for (let i in themes) {
            let themeToCheck = themes[i];
            let extendsThisThemeName = themeToCheck.info.extends;

            if (!extendsThisThemeName) continue;

            let extendsThisTheme: Theme | null = null;
            for (let i2 in themes) {
                let extendsTheme = themes[i2];
                if (extendsTheme.info.name === extendsThisThemeName) {
                    extendsThisTheme = extendsTheme;
                }
            }

            if (extendsThisTheme) {
                if (extendsThisTheme.info.extends) {
                    hasMultipleLevels = true;
                }
             }
        }

        if (hasMultipleLevels) {
            throw 'Theme can only extend a theme that doesnt extend another theme.';
        }

        // Extend themes
        for (let i in themes) {
            let themeThatExtends = themes[i];

            if (!themeThatExtends.info.extends) continue;

            let extendsThisTheme: Theme | null = null;
            for (let i2 in themes) {
                let extendsTheme = themes[i2];
                if (extendsTheme.info.name === themeThatExtends.info.extends) {
                    extendsThisTheme = extendsTheme;
                }
            }

            if (extendsThisTheme) {
                let themeStructureCopy: any = JSON.parse( JSON.stringify(extendsThisTheme.theme) );
                this.deepObjectMerge(themeStructureCopy, themeThatExtends.theme);
                themeThatExtends.theme = themeStructureCopy;
            }
        }
    }

    private deepObjectMerge(target:any, source:any) {
        for (const key of Object.keys(source)) {
            if (source[key] instanceof Object) {
                Object.assign(source[key], this.deepObjectMerge(target[key], source[key]));
            };
        }
    
        Object.assign(target || {}, source);
        return target;
    }

    private getSystemOrientation(width:number = Dimensions.get('window').width, height:number = Dimensions.get('window').height): Orientation {
        return height > width ? 'portrait' : 'landscape';
    }

    private widthPercentageToDP(widthPercent: number | string) {
        const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
        return PixelRatio.roundToNearestPixel(windowWidth * elemWidth / 100);
    };

    private heightPercentageToDP(heightPercent: number | string) {
        const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
        return PixelRatio.roundToNearestPixel(windowHeight * elemHeight / 100);
    };
}

type Orientation = 'portrait' | 'landscape';

export const themes = Themes.getInstance();