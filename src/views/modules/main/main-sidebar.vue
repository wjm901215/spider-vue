<template>
    <aside class="site-sidebar" :class="'site-sidebar--' + sidebarLayoutSkin">
        <div class="site-sidebar__inner">
            <el-menu
                    :default-active="menuActiveName || 'home'"
                    :collapse="sidebarFold"
                    :collapseTransition="false"
                    class="site-sidebar__menu">
                <sub-menu
                        v-for="menu in menuList"
                        :key="menu.menuId"
                        :menu="menu"
                        :dynamicMenuRoutes="dynamicMenuRoutes">
                </sub-menu>
            </el-menu>
        </div>
    </aside>
</template>

<script>
    import SubMenu from './main-sidebar-sub-menu'
    import {mapState, mapMutations} from 'vuex'

    export default {
        data() {
            return {}
        },
        components: {
            SubMenu
        },
        computed: {
            ...mapState('sys/menu', [
                "menuList"
            ]),
            ...mapState('common', [
                "dynamicMenuRoutes"
            ]),
            sidebarLayoutSkin: {
                get() {
                    return this.$store.state.common.sidebarLayoutSkin
                }
            },
            sidebarFold: {
                get() {
                    return this.$store.state.common.sidebarFold
                }
            },
            menuActiveName: {
                get() {
                    return this.$store.state.common.menuActiveName
                },
                set(val) {
                    this.$store.commit('common/updateMenuActiveName', val)
                }
            },
            mainTabs: {
                get() {
                    return this.$store.state.common.mainTabs
                },
                set(val) {
                    this.$store.commit('common/updateMainTabs', val)
                }
            },
            mainTabsActiveName: {
                get() {
                    return this.$store.state.common.mainTabsActiveName
                },
                set(val) {
                    this.$store.commit('common/updateMainTabsActiveName', val)
                }
            }
        },

        methods: {
            //更新菜单目录
            updateMenus(menus) {
                this.menuList = menus
            },
        }
    }
</script>
