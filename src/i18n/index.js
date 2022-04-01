import VueI18n from 'vue-i18n'
import Vue from 'vue'
import VueCookie from 'vue-cookie'

Vue.use(VueI18n)
const lang = VueCookie.get('lang');
const defaultLang = navigator.language ? navigator.language : "zh-CN"

const i18n = new VueI18n({
    locale: lang ? lang : defaultLang, //默认使用语言
    messages: {
        'zh-CN': require('./lang/zh'), // 中文语言包
        'en-US': require('./lang/en') // 英文语言包
    }
})

export {
    i18n
};
