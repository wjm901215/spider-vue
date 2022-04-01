<template>
    <div class="site-wrapper" :class="{ 'site-sidebar--fold': sidebarFold }" v-loading.fullscreen.lock="loading"
         element-loading-text="拼命加载中">
        <template v-if="!loading">
            <el-container class="main-wrap">
                <el-header v-show="!fullscreen">
                    <main-navbar :updateSideBarMenus="updateSideBarMenus"/>
                </el-header>
                <el-container>
                    <el-aside v-show="showSideBar" :width="sidebarFold ? '64px' : '230px'">
                        <main-sidebar ref="sideBar"/>
                    </el-aside>
                    <el-main>
                        <div class="site-content__wrapper"
                             :style="{ 'height': '100%'}">
                            <main-content @updateSidebar="updateSideBarMenus"/>
                        </div>
                    </el-main>
                </el-container>
            </el-container>
        </template>
    </div>
</template>

<script>
    import MainNavbar from './main-navbar'
    import MainSidebar from './main-sidebar'
    import MainContent from './main-content'
    import {mapState, mapMutations, mapActions} from 'vuex'

    export default {
        data() {
            return {
                loading: true,
                showSideBar: false,
            }
        },
        components: {
            MainNavbar,
            MainSidebar,
            MainContent
        },
        computed: {
            documentClientHeight: {
                get() {
                    return this.$store.state.common.documentClientHeight
                },
                set(val) {
                    this.$store.commit('common/updateDocumentClientHeight', val)
                }
            },
            documentClientWidth: {
                get() {
                    return this.$store.state.common.documentClientWidth
                },
                set(val) {
                    this.$store.commit('common/updateDocumentClientWidth', val)
                }
            },
            sidebarFold: {
                get() {
                    return this.$store.state.common.sidebarFold
                },
                set(val) {
                    this.$store.commit('common/updateSidebarFold', val)
                }
            },
            ...mapState('common', ['fullscreen']),
            ...mapState('sys/user', {
                id: state => state.id,
                name: state => state.name,
            })
        },
        created() {
            this.getUserInfo()
            this.restSideBar()
            this.updateMenuList(JSON.parse(sessionStorage.getItem('menus') || '[]'))
            this.updateDynamicMenuRoutes(JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]'))
            this.routeHandle(this.$route)
        },
        watch: {
            $route: 'routeHandle'
        },
        mounted() {
            this.resetDocumentClientHeight()
        },
        updated() {
            this.updateSideBarMenus(JSON.parse(sessionStorage.getItem('menus')))
        },
        methods: {
            ...mapMutations({
                updateMenuList: 'sys/menu/updateMenuList',
                updateDynamicMenuRoutes: 'common/updateDynamicMenuRoutes'
            }),
            ...mapActions({
                'routeHandle': 'common/routeHandle'
            }),
            restSideBar() {
                let menu = JSON.parse(sessionStorage.getItem('curMenu'))
                if (menu) this.showSideBar = !menu.fullScreen
            },
            //修改sidebar
            updateSideBarMenus(menus) {
                this.showSideBar = menus != null && menus.length > 0;
            },
            // 重置窗口可视高度
            resetDocumentClientHeight() {
                this.documentClientHeight = document.documentElement['clientHeight']
                this.documentClientWidth = document.documentElement['clientWidth']
                window.onresize = () => {
                    this.documentClientHeight = document.documentElement['clientHeight']
                    this.documentClientWidth = document.documentElement['clientWidth']
                    if (this.documentClientWidth < 1500) {
                        this.sidebarFold = true
                    } else {
                        this.sidebarFold = false
                    }
                }
            },
            // 获取当前管理员信息
            getUserInfo() {
                this.$store.dispatch('sys/user/getUserInfo')
                    .then(() => {
                        this.$store.dispatch('sys/dictionary/queryDictionaryList')
                        this.loading = false
                        document.title = this.$t('common.title');
                    })
            }
        }
    }

</script>
