import {queryCascadeList} from "@/api/sys/area";


export default {
    namespaced: true,
    state: {
        cascadeList: []
    },
    mutations: {
        updateCascadeList(state, cascadeList) {
            state.cascadeList = cascadeList
        }
    },
    getters: {
        namespace: () => 'sys/area'
    },
    actions: {
        queryCascadeList({commit}) {
            return new Promise((resolve, reject) => {
                queryCascadeList().then(({data}) => {
                    if (data && data.code === 200) {
                        commit("updateCascadeList", data.data)
                        resolve(data.data)
                    } else {
                        reject(data.msg)
                    }
                })
            })
        }
    }
}
