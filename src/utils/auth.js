import Vue from 'vue'

const TokenKey = 'token'

const LangKey = 'lang'

export function getToken() {
    return Vue.cookie.get(TokenKey)
}

export function setToken(token) {
    return Vue.cookie.set(TokenKey, token)
}

export function delToken() {
    return Vue.cookie.delete(TokenKey)
}

export function setLang(lang) {
    return Vue.cookie.set(LangKey, lang)
}
