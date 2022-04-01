import {queryDictionaryList} from "@/api/sys/dictionary";


export default {
    namespaced: true,
    state: {
        dictList: []
    },
    mutations: {
        updateDictList(state, dictList) {
            state.dictList = dictList
        },
    },
    getters: {
        namespace: () => 'sys/dictionary',
        dictList: state => state.dictList,
        queryDictionary: state => (codeType, codeValue) => {
            let dicList = new Array()
            let dictS = state.dictList
            if (null == codeValue || "" === codeValue) {
                dicList = dictS.filter(d =>
                    d.codeType == codeType
                )
            } else {
                dicList = dictS.filter(d =>
                    d.codeType == codeType && d.codeValue == codeValue
                )
            }
            return dicList
        },
        queryDictionaryText: (state, getters) => (codeType, codeValue) => {
            let dicList = getters.queryDictionary(codeType, codeValue)
            if (dicList.length > 0) {
                return dicList[0].codeText
            } else {
                return ''
            }
        },
    },
    actions: {
        queryDictionaryList({commit}) {
            return new Promise((resolve, reject) => {
                queryDictionaryList().then(({data}) => {
                    if (data && data.code === 200) {
                        commit('updateDictList', data.rows)
                        resolve(data.rows)
                    } else {
                        reject(data.msg)
                    }
                })
            })
        }
    }
}
