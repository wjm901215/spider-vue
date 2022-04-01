import {list, deleteList, saveOrUpdate} from "@/api/common";
import {select,selectTenantData} from "@/api/base/tenant";


export default {
    namespaced: true,
    state: {
        tenantOptions: [],
    },
    mutations: {
        updateTenantOption(state, list) {
            state.tenantOptions = list
        }
    },
    getters: {
        namespace: () => 'base/tenant'
    },
    actions: {
        updateSelect({commit}) {
            return new Promise((resolve, reject) => {
                select().then(({data}) => {
                    if (data && data.code === 200) {
                        commit('updateTenantOption', data.list)
                        resolve(data.list)
                    } else {
                        reject(data.msg)
                    }
                })
            })
        },
        selectTenantData() {
            return new Promise((resolve, reject) => {
                selectTenantData().then(({data}) => {
                    if (data && data.code === 200) {
                        let {list, tenantId} = data.result
                        resolve({list, tenantId})
                    } else {
                        reject(data.msg)
                    }
                })
            })
        },
        list({getters}, { name,code, }) {
            return new Promise((resolve, reject) => {
                list({
                    name,
                    code,
                }, getters.namespace).then(({data}) => {
                    if (data && data.code === 200) {
                        let {list, totalCount} = data.page
                        resolve({list, totalCount})
                    } else {
                        reject(data.msg)
                    }
                })
            })
        },
        delete({getters}, ids) {
            return new Promise((resolve, reject) => {
                deleteList(
                    ids, getters.namespace
                ).then(({data}) => {
                    if (data && data.code === 200) {
                        resolve()
                    } else {
                        reject(data.msg)
                    }
                })
            })
        },
        saveOrUpdate({getters}, { id,name,code,createBy,createTime,updateBy,updateTime,  }) {
            return new Promise((resolve, reject) => {
                saveOrUpdate({
                    id,
                    name,
                    code,
                    createBy,
                    createTime,
                    updateBy,
                    updateTime,
                }, getters.namespace).then(({data}) => {
                    if (data && data.code === 200) {
                        resolve()
                    } else {
                        reject(data.msg)
                    }
                })
            })
        }
    }
}
