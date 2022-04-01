<template>
    <main class="site-content" :class="{ 'site-content--tabs': $route.meta.isTab }">
        <!-- 主入口标签页 s -->
        <el-tabs v-if="$route.meta.isTab" v-model="mainTabsActiveName"
                 @tab-remove="removeTabHandle"
                 :class="menuList && menuList.length  ? sidebarFold ?  'has-side-bar--fold' :'has-side-bar-unfold': 'no-side-bar'">
            <el-dropdown class="site-tabs__tools" :style="{'top':fullscreen ? '0!important' : '64px!important' }"
                         :show-timeout="0">
                <i class="el-icon-arrow-down el-icon--right"></i>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="tabsCloseCurrentHandle">关闭当前标签页</el-dropdown-item>
                    <el-dropdown-item @click.native="tabsCloseOtherHandle">关闭其它标签页</el-dropdown-item>
                    <el-dropdown-item @click.native="tabsCloseAllHandle">关闭全部标签页</el-dropdown-item>
                    <el-dropdown-item @click.native="tabsRefreshCurrentHandle">刷新当前标签页</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-tab-pane v-for="item in mainTabs" :key="item.name" :label="item.title" :name="item.name">
                <span slot="label">
                  <el-tag @click="selectedTabHandle(item)" closable @close="removeTabHandle(item.name)"
                          :type="item.name === mainTabsActiveName ? '' : 'info'">
                    <span style="margin-right:-6px">{{ item.title }}</span>
                  </el-tag>
                </span>
                <el-card :body-style="siteContentViewHeight" class="site-content-wrap-card">
                    <iframe v-if="item.type === 'iframe'" :src="item.iframeUrl" width="100%" height="100%"
                            frameborder="0"
                            scrolling="yes">
                    </iframe>
                    <transition v-else name="fade-transform" mode="out-in">
                        <keep-alive>
                            <router-view v-if="item.name === mainTabsActiveName"/>
                        </keep-alive>
                    </transition>
                </el-card>
            </el-tab-pane>
        </el-tabs>
        <!-- 主入口标签页 e -->
<!--        <el-card v-else-if="$route.meta.iframeUrl" :body-style="siteContentViewHeight" class="site-content-no-tab">-->
          <el-card v-else-if="$route.meta.iframeUrl" :body-style="siteContentViewHeight" class="site-content-no-tab site-content-no-tab-iframe">
            <iframe :src="$route.meta.iframeUrl" width="100%" height="100%"
                    frameborder="0"
                    scrolling="yes">
            </iframe>
        </el-card>
        <el-card v-else :body-style="siteContentViewHeight" class="site-content-no-tab">
            <transition name="fade-transform" mode="out-in">
                <keep-alive>
                    <router-view/>
                </keep-alive>
            </transition>
        </el-card>

    </main>
</template>

<script>
    import {isURL} from '@/utils/validate'
    import {mapState} from 'vuex'

    export default {
        data() {
            return {}
        },
        computed: {
            ...mapState('sys/menu', ["menuList", "defaultPage"]),
            ...mapState('common', ["sidebarFold", 'fullscreen']),
            documentClientHeight: {
                get() {
                    return this.$store.state.common.documentClientHeight
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
            },
            siteContentViewHeight() {
                let height = this.fullscreen ? this.documentClientHeight : this.documentClientHeight - 50;
                if (this.$route.meta.isTab) {
                    height -= 69
                    return isURL(this.$route.meta.iframeUrl) ? {
                        height: height + 'px'
                    } : {
                        minHeight: height + 'px'
                    }
                }
                return {
                    minHeight: height + 'px'
                }
            }
        },
        methods: {
            // tabs, 选中tab
            selectedTabHandle(tab) {
                this.$router.push({
                    name: tab.name
                })
            },
            // tabs, 删除tab
            removeTabHandle(tabName) {
                this.mainTabs = this.mainTabs.filter(item => item.name !== tabName)
                if (this.mainTabs.length >= 1) {
                    // 当前选中tab被删除
                    if (tabName === this.mainTabsActiveName) {
                        this.$router.push({
                            name: this.mainTabs[this.mainTabs.length - 1].name
                        }, () => {
                            this.mainTabsActiveName = this.$route.name
                        })
                    }
                } else {
                    this.menuActiveName = ''
                    sessionStorage.removeItem("menus")
                    this.$emit("updateSidebar", null)
                    this.$router.push({
                        name: this.defaultPage.routerName
                    })
                }
            },
            // tabs, 关闭当前
            tabsCloseCurrentHandle() {
                this.removeTabHandle(this.mainTabsActiveName)
            },
            // tabs, 关闭其它
            tabsCloseOtherHandle() {
                this.mainTabs = this.mainTabs.filter(item => item.name === this.mainTabsActiveName)
            },
            // tabs, 关闭全部
            tabsCloseAllHandle() {
                this.mainTabs = []
                this.menuActiveName = ''
                sessionStorage.removeItem("menus")
                this.$emit("updateSidebar", null)
                this.$router.push({
                    name: this.defaultPage.routerName
                })
            },
            // tabs, 刷新当前
            tabsRefreshCurrentHandle() {
                var tempTabName = this.mainTabsActiveName
                this.removeTabHandle(tempTabName)
                this.$nextTick(() => {
                    this.$router.push({
                        name: tempTabName
                    })
                })
            }
        }
    }

</script>

<style lang="less">
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background-color: #F5F5F5;
    }

    /*定义滚动条轨道 内阴影+圆角*/
    ::-webkit-scrollbar-track {
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
        background-color: #F5F5F5;
    }

    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
        background-color: #C1C1C1;
    }

    .el-card__body {
        overflow-y: auto;
        height: 500px;
    }

    body {
        overflow: hidden !important;
    }

    .site-content .el-tabs__active-bar {
        display: none;
    }

    .site-content .el-tabs__item {
        padding: 0 5px;
    }

    .no-side-bar {
        .el-tabs__header {
            left: 0 !important;
        }
    }


    /*fade-transform*/
    .fade-transform-leave-active,
    .fade-transform-enter-active {
        transition: all 0.5s;
    }

    .fade-transform-enter {
        opacity: 0;
        transform: translateX(-30px);
    }

    .fade-transform-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }
    .site-content-no-tab-iframe {
      &>.el-card__body {
        height: 500px;
      }
    }
</style>
