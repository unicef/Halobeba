import * as RNLocalize from 'react-native-localize'
import i18n from 'i18n-js'
import memoize from 'lodash.memoize'

const translationGetters: { [language: string]: any } = {
    // en: () => require('./en.json'),
    en: () => require('./sr.json'),
    sr: () => require('./sr.json')
}

/**
 * Function that returns a translation for the given key.
 * 
 * ```
 * translate('Good morning')
 * ```
 */
export const translate = memoize(
    (key, config = null) => i18n.t(key, config),
    (key, config = null) => (config ? key + JSON.stringify(config) : key)
);

export const setI18nConfig = () => {
    const fallback = { languageTag: 'en' };

    const { languageTag } =
        RNLocalize.findBestAvailableLanguage(Object.keys(translationGetters)) ||
        fallback;

    if (translate?.cache?.clear) {
        translate.cache.clear();
    }

    i18n.translations = { [languageTag]: translationGetters[languageTag]() }
    i18n.locale = languageTag;
}

// Call setI18nConfig when user changes the language.
RNLocalize.addEventListener('change', setI18nConfig);
setI18nConfig();