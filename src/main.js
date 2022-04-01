import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import '@/assets/icons'
import '@/element-ui'
import '@/element-ui-theme'
import '@/assets/scss/index.scss'
import '@/extension'
import {i18n} from '@/i18n';

Vue.config.productionTip = false

new Vue({
    i18n,
    router,
    store,
    render: h => h(App),
}).$mount('#app')
