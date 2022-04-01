import {upload} from "@/api/common"
import {Message} from 'element-ui'
import {isURL} from '@/utils/validate'
import router from '@/router'

export default {
    namespaced: true,
    state: {
        // 页面文档可视高度(随窗口改变大小)
        documentClientHeight: 0,
        documentClientWidth: 0,
        // 导航条, 布局风格, defalut(默认) / inverse(反向)
        navbarLayoutType: 'inverse',
        // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
        sidebarLayoutSkin: 'light',
        // 侧边栏, 折叠状态
        sidebarFold: false,
        menuActiveName: '',
        // 主入口标签页
        mainTabs: [],
        mainTabsActiveName: '',
        fullscreen: false,
        dynamicMenuRoutes: []
    },
    mutations: {
        updateDocumentClientHeight(state, height) {
            state.documentClientHeight = height
        },
        updateDocumentClientWidth(state, width) {
            state.documentClientWidth = width
        },
        updateNavbarLayoutType(state, type) {
            state.navbarLayoutType = type
        },
        updateSidebarLayoutSkin(state, skin) {
            state.sidebarLayoutSkin = skin
        },
        updateSidebarFold(state, fold) {
            state.sidebarFold = fold
        },
        updateMenuActiveName(state, name) {
            state.menuActiveName = name
        },
        updateMainTabs(state, tabs) {
            state.mainTabs = tabs
        },
        updateMainTabsActiveName(state, name) {
            state.mainTabsActiveName = name
        },
        updateFullscreen(state, fullscreen) {
            state.fullscreen = fullscreen
        },
        updateDynamicMenuRoutes(state, dynamicMenuRoutes) {
            state.dynamicMenuRoutes = dynamicMenuRoutes
        }
    },
    actions: {
        upload: async ({}, {file, onSuccess}) => {
            await upload(file).then(({data}) => {
                if (data && data.code == 200) {
                    onSuccess(data.url)
                } else {
                    Message.error(data.msg)
                }
            })
        },
        fullscreenToggle({commit, state}) {
            if (!state.fullscreen) {
                //全屏
                let docElm = document.documentElement;
                //W3C
                if (docElm.requestFullscreen) {
                    docElm.requestFullscreen();
                }
                //FireFox
                else if (docElm.mozRequestFullScreen) {
                    docElm.mozRequestFullScreen();
                }
                //Chrome等
                else if (docElm.webkitRequestFullScreen) {
                    docElm.webkitRequestFullScreen();
                }
                //IE11
                else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                }
            }
            commit('updateFullscreen', !state.fullscreen)

        },
        routeHandle({state, commit}, route) {
            let tab = state.mainTabs.filter(item => item.name === route.name)[0]
            if (!tab) {
                if (route.meta.isDynamic) {
                    route = state.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
                    if (!route) {
                        return console.error('未能找到可用标签页!')
                    }
                }
                tab = {
                    menuId: route.meta.menuId || route.name,
                    name: route.name,
                    title: route.meta.title,
                    type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
                    iframeUrl: route.meta.iframeUrl || ''
                }
								if (route.meta.isTab) {
										commit('updateMainTabs', state.mainTabs.concat(tab))
								}
            }
            commit('updateMenuActiveName', tab.menuId + '')
            commit('updateMainTabsActiveName', tab.name)
        },
        gotoRouteHandle({state}, menu) {
            let route = state.dynamicMenuRoutes.filter(item => item.meta.menuId === menu.menuId);
            if (route.length >= 1) {
                if (state.mainTabsActiveName == route[0].name) {
                    return
                }
                // if (route[0].meta.iframeUrl&& route[0].meta.title!="驾驶舱") {
                //     window.open(route[0].meta.iframeUrl)
                //     return false
                // }
                router.push({name: route[0].name})
            }
        }

    }
}
