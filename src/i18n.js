import Vue from 'vue'
import VueI18n from 'vue-i18n'
import getBrowserLocale from "@/i18n/get-browser-locale"
import { supportedLocalesInclude } from "./i18n/supported-locales"


Vue.use(VueI18n)

function loadLocaleMessages () {
    const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
    const messages = {}
    locales.keys().forEach(key => {
        const matched = key.match(/([A-Za-z0-9-_]+)\./i)
        if (matched && matched.length > 1) {
            const locale = matched[1]
            messages[locale] = locales(key)
        }
    })
    return messages
}

function getStartingLocale() {
    const browserLocale = getBrowserLocale({ countryCodeOnly: true })

    if (supportedLocalesInclude(browserLocale)) {
        return browserLocale
    } else {
        return process.env.VUE_APP_I18N_LOCALE || "en"
    }
}

const dateTimeFormats = {
    'en': {
        short: {
            year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
        }
    },
    'cs': {
        short: {
            year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
        }
    },
    'es': {
        short: {
            year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
        }
    },
    'it': {
        short: {
            year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'
        }
    }
}

export default new VueI18n({
    locale: process.env.VUE_APP_I18N_LOCALE || getStartingLocale(),
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
    messages: loadLocaleMessages(),
    dateTimeFormats
})