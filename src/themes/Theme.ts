import { ThemeStructure } from "./ThemeStructure";

/**
 * Theme object contains theme meta information and theme structure.
 */
export class Theme {
    public info: ThemeInfo;
    public theme: ThemeStructure;

    public constructor(args:ConstructorArgs) {
        this.info = args.info;
        this.theme = args.theme;
    }
}

export interface ThemeInfo {
    /**
     * Descriptive name of the theme.
     */
    title: string;
    /**
     * Internal name of the theme.
     */
    name: string;
    /**
     * Name of the base theme from which you want this theme extended.
     */
    extends?: string;
    description?: string;
    /**
     * True if theme is dark.
     */
    dark: boolean;
}

interface ConstructorArgs {
    info: ThemeInfo;
    theme: ThemeStructure;
}