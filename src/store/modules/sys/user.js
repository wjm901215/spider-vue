import {delToken, setLang, setToken} from "@/utils/auth";
import {login, logout, getUserInfo} from "@/api/common/login"
import {i18n} from '@/i18n'
import router from '@/router'
import {
    switchLanguage,
    switchTenantId
} from "@/api/sys/user";

export default {
    namespaced: true,
    state: {
        id: 0,
        name: '',
        lang: '',
        jobType: '',
        headUrl: ''
    },
    mutations: {
        updateId(state, id) {
            state.id = id
        },
        updateName(state, name) {
            state.name = name
        },
        updateLang(state, lang) {
            setLang(lang)
            state.lang = lang
        },
        updateJobType(state, jobType) {
            state.jobType = jobType
        },
        updateHeadUrl(state, headUrl) {
            state.headUrl = headUrl
        }
    },
    actions: {
        login({state, dispatch}, {account, password}) {
            return new Promise((resolve, reject) => {
                login({account, password}).then(({data}) => {
                    if (data && data.code === 200) {
                        setToken(data.token)
                        resolve()
                    } else {
                        reject(data.msg)
                    }
                })
            })
        },
        logout({commit, dispatch}) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    delToken()
                    router.options.isAddDynamicMenuRoutes = false
                    router.push({
                        name: 'login'
                    })
                    commit('sys/menu/updateMenuList', [], {root: true})
                    resolve()
                }).catch(errMsg => {
                    reject(errMsg)
                })
            })
        },
        getUserInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                getUserInfo().then(({data}) => {
                    if (data && data.code === 200) {
                        let {userId, username, lang, jobType,headUrl} = data.user
                        commit('updateId', userId)
                        commit('updateName', username)
                        commit('updateLang', lang)
                        commit('updateJobType', jobType)
                        commit('updateHeadUrl',headUrl)
                        i18n.locale = lang
                        resolve({userId, username, lang, jobType,headUrl})
                    } else {
                        reject(data.msg)
                    }
                })
            })
        },
        switchLanguage({commit}, lang) {
            return new Promise((resolve, reject) => {
                switchLanguage(lang).then(({data}) => {
                    if (data && data.code === 200) {
                        commit('updateLang', lang)
                        resolve()
                    } else {
                        reject(data.msg)
                    }
                })
            })
        },
        switchTenantId({}, tenantId) {
            return new Promise((resolve, reject) => {
                switchTenantId(tenantId).then(({data}) => {
                    if (data && data.code === 200) {
                        resolve()
                    } else {
                        reject(data.msg)
                    }
                })
            })
        }

    },
}
