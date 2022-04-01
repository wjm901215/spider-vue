import {nav} from "@/api/sys/menu";

export default {
    namespaced: true,
    state: {
        menuList: [],//左侧sidebar菜单列表
        defaultPage: {}//默认页
    },
    mutations: {
        updateMenuList(state, list) {
            state.menuList = list
            sessionStorage.setItem('menus', JSON.stringify(list || null));
        },
        updateDefaultPage(state, defaultPage) {
            state.defaultPage = defaultPage
        }
    },
    actions: {
        nav() {
            return new Promise((resolve, reject) => {
                nav().then(({data}) => {
                    if (data && data.code === 200) {
                        let {menuList, permissions} = data
                        resolve({menuList, permissions})
                    } else {
                        reject(data.msg)
                    }
                })
            })
        }

    },
}
