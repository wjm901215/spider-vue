import {select} from "@/api/sys/role";

export default {
    namespaced: true,
    state: {
        selectOption: [],
    },
    mutations: {
        updateSelectOption(state, list) {
            state.selectOption = list
        }
    },
    actions: {
        updateSelect({commit},tenantIds) {
            return new Promise((resolve, reject) => {
                if(tenantIds) {
                    select(tenantIds).then(({data}) => {
                        if (data && data.code === 200) {
                            commit('updateSelectOption', data.list)
                            resolve(data.list)
                        } else {
                            reject(data.msg)
                        }
                    })
                }else{
                    //无租户数据，则将人员角色设置空
                    commit('updateSelectOption', [])
                    resolve()
                }
            })
        }
    }
}
