import Vue from 'vue'
import Router from 'vue-router'
import {isURL} from '@/utils/validate'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {getToken} from "@/utils/auth";

NProgress.configure({easing: 'ease', speed: 1000, showSpinner: false})

Vue.use(Router)

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
const _import = require('./import-' + process.env['NODE_ENV'])

// 全局路由(无需嵌套上左右整体布局)
const globalRoutes = [
    {
        path: '/404',
        component: _import('common/404'),
        name: '404',
        meta: {
            title: '404未找到'
        }
    },
    {
        path: '/login',
        component: _import('common/login'),
        name: 'login',
        meta: {
            title: '登录'
        }
    }
]


// 主入口路由(需嵌套上左右整体布局)
const mainRoutes = {
    path: '/',
    component: _import('modules/main/main'),
    name: 'main',
    meta: {
        title: '主入口整体布局'
    },
    children: [
        {
            path: '/home',
            component: _import('modules/home/'),
            name: 'home',
            meta: {
                title: '首页'
            }
        },
        {
            path: '/setting',
            component: _import('common/setting/'),
            name: 'setting',
            meta: {
                title: '主题'
            }
        }
    ],
    beforeEnter(to, from, next) {
        let token = getToken()
        if (!token || !/\S/.test(token)) {
            next({
                name: 'login'
            })
        }
        next()
    }
}

/**
 * 构建动态路由
 * @param routeFirst 是否跳转
 * @returns {Promise<void>}
 */
export const buildRouter = async (routeFirst = false) => {
    return new Promise((resolve, reject) => {
        store.dispatch('sys/menu/nav')
            .then(({menuList, permissions}) => {
                sessionStorage.setItem('menuList', JSON.stringify(menuList || '[]'))
                sessionStorage.setItem('permissions', JSON.stringify(permissions || '[]'))
                fnAddDynamicMenuRoutes(menuList)
                let defaultPageRouter = defineDefaultPage(menuList)
                if (routeFirst) {
                    router.push({
                        name: defaultPageRouter.routerName
                    })
                }
                resolve(menuList)
            })
            .catch(errMsg => {
                reject(errMsg)
            })
    })
}

/**
 * 定义默认页面
 * @param menuList
 */
const defineDefaultPage = menuList => {
    let tmpList = []
    for (let i = 0; i < menuList.length; i++) {
        if (menuList[i].list && menuList[i].list.length > 0) {
            tmpList.push(...menuList[i].list)
        } else if (menuList[i].url) {
            menuList[i].routerName = menuList[i].url.replace('/', '-')
            if (isURL(menuList[i].url)) {
                menuList[i].routerName = `i-${menuList[i].menuId}`
            }
            router.addRoutes([
                mainRoutes,
                {
                    path: '*',
                    redirect: {
                        name: '404'
                    }
                }
            ])
            router.options.isAddDynamicMenuRoutes = true
            store.commit('sys/menu/updateDefaultPage', menuList[i])
            return menuList[i]
        }
    }
    return defineDefaultPage(tmpList)
}


const router = new Router({
    mode: 'history',
    scrollBehavior: () => ({
        y: 0
    }),
    isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
    routes: globalRoutes.concat(mainRoutes)
})


/**
 * 全局钩子
 */
router.beforeEach((to, from, next) => {
    NProgress.start();
    if (router.options.isAddDynamicMenuRoutes || fnCurrentRouteType(to) === 'global') {
        next()
    } else {
        buildRouter().then(() => {
            if (to.path == '/') {
                router.push({name: store.state.sys.menu.defaultPage.routerName})
            } else {
                next({
                    ...to,
                    replace: true
                })
            }
        }).catch(err => {
            console.log(err)
            next()
        })
    }
})
router.afterEach(() => {
    NProgress.done();
})

/**
 * 判断当前路由类型, global: 全局路由, main: 主入口路由
 * @param {*} route 当前路由
 */
function fnCurrentRouteType(route) {
    var temp = []
    for (var i = 0; i < globalRoutes.length; i++) {
        if (route.path === globalRoutes[i].path) {
            return 'global'
        } else if (globalRoutes[i].children && globalRoutes[i].children.length >= 1) {
            temp = temp.concat(globalRoutes[i].children)
        }
    }
    return temp.length >= 1 ? fnCurrentRouteType(route, temp) : 'main'
}

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function fnAddDynamicMenuRoutes(menuList = [], routes = []) {
    let temp = []
    for (let i = 0; i < menuList.length; i++) {
        if (menuList[i].list && menuList[i].list.length >= 1) {
            temp = temp.concat(menuList[i].list)
        } else if (menuList[i].url && /\S/.test(menuList[i].url)) {
            menuList[i].url = menuList[i].url.replace(/^\//, '')
            let route = {
                path: menuList[i].url.replace('/', '-'),
                component: null,
                name: menuList[i].url.replace('/', '-'),
                meta: {
                    menuId: menuList[i].menuId,
                    title: menuList[i].translation, //menuList[i].name,
                    isDynamic: true,
                    isTab: menuList[i].parentId == '0' && (!menuList[i].list || menuList[i].list.length === 0) ? false : true,
                    iframeUrl: '',
                }
            }
            // url以http[s]://开头, 通过iframe展示
            if (isURL(menuList[i].url)) {
                route['path'] = `i-${menuList[i].menuId}`
                route['name'] = `i-${menuList[i].menuId}`
                route['meta']['iframeUrl'] = menuList[i].url
            } else {
                try {
                    route['component'] = _import(`modules/${menuList[i].url}`) || null
                } catch (e) {
                }
            }
            routes.push(route)
        }
    }
    if (temp.length >= 1) {
        fnAddDynamicMenuRoutes(temp, routes)
    } else {
        mainRoutes.name = 'main-dynamic'
        mainRoutes.children = routes
        sessionStorage.setItem('dynamicMenuRoutes', JSON.stringify(mainRoutes.children || '[]'))
    }
}

export default router
