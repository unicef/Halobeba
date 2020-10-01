import { dataRealmStore } from "../stores";
import { appConfig } from "./appConfig";
import * as RNLocalize from "react-native-localize";
import { Locale } from "react-native-localize";

class Localize {
    private static instance: Localize;

    private constructor() {}

    static getInstance(): Localize {
        if (!Localize.instance) {
            Localize.instance = new Localize();
        }
        return Localize.instance;
    }

    /**
     * Set language & country if they are not set.
     */
    public setLocalesIfNotSet() {
        let languageCode = dataRealmStore.getVariable('languageCode');
        let countryCode = dataRealmStore.getVariable('countryCode');

        if (!languageCode) {
            this.setLanguage(this.getDefaultLanguage());
        }

        if (!countryCode) {
            this.setCountry(this.getDefaultCountry());
        }
    }

    public getDefaultLanguage() {
        const locales = RNLocalize.getLocales();
        
        let firstLocale: Locale|null = null;
        if (locales && locales.length > 0) {
            firstLocale = locales[0];
        }

        // return firstLocale ? firstLocale.languageCode : appConfig.defaultLanguage;
        return "sr"
    }

    public getDefaultCountry() {
        const locales = RNLocalize.getLocales();
        
        let firstLocale: Locale|null = null;
        if (locales && locales.length > 0) {
            firstLocale = locales[0];
        }

        return firstLocale ? firstLocale.countryCode : appConfig.defaultCountry;
    }

    public getLanguage(): string {
        let languageCode = dataRealmStore.getVariable('languageCode');
        // return languageCode ? languageCode : this.getDefaultLanguage();
        return "sr" 
    }

    public getCountry(): string {
        let countryCode = dataRealmStore.getVariable('countryCode');
        return countryCode ? countryCode : this.getDefaultCountry();
    }

    public setLanguage(language:string) {
        if (language) {
            dataRealmStore.setVariable('languageCode', language);
        }
    }

    public setCountry(country:string) {
        if (country) {
            dataRealmStore.setVariable('countryCode', country);
        }
    }
}

export const localize = Localize.getInstance();