<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand">
        <a class="site-navbar__brand-lg" href="javascript:;">{{ $t("common.title") }}</a>
        <a class="site-navbar__brand-mini" href="javascript:;">监管云</a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <el-menu class="site-navbar__menu" mode="horizontal">
        <el-menu-item class="site-navbar__switch menu-fold" :class="sidebarFold ? 'menu-fold--ing' : ''"
                      index="0"
                      @click="sidebarFold = !sidebarFold">
          <icon-svg name="zhedie"></icon-svg>
        </el-menu-item>
        <el-menu-item :class="documentClientWidth < 1500 ? 'el-menu-item--low-pixel' : '' " :index="item.menuId+''"
                      v-for="item in menuList" @click="push(item)" :key="item.menuId">
          <template slot="title">
            <icon-svg :name="item.icon" style="font-size: 16px;"></icon-svg>
            <span style="font-size: 16px;" class="el-menu-item-span">{{ item.translation }}</span>
          </template>
        </el-menu-item>
      </el-menu>
      <el-menu class="site-navbar__menu site-navbar__menu--right" mode="horizontal">
        <el-menu-item index="setting" @click="fullscreenToggleActions()"
                      style="border-bottom: none !important;" class="menu-fullscreen">
          <template slot="title">
            <icon-svg name="fullscreen"></icon-svg>
          </template>
        </el-menu-item>
        <!--<el-menu-item index="setting" @click="staticPush('setting')"
                      style="border-bottom: none !important;">
            <template slot="title">
                <icon-svg name="shezhi"></icon-svg>
            </template>
        </el-menu-item>-->
        <el-menu-item class="site-navbar__avatar" index="3">
          <el-dropdown :show-timeout="0" placement="bottom">
                        <span class="el-dropdown-link">
                           <img v-if="headUrl" :src="headUrl" :alt="userName">
                           <img v-else src="~@/assets/img/avatar.png" :alt="userName">
                          <span v-show="documentClientWidth > 1500">{{ userName }}</span>
                        </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
import UpdatePassword from './main-navbar-update-password'
import {mapState, mapMutations, mapActions} from 'vuex'

export default {
  props: {
    updateSideBarMenus: Function,
  },
  data() {
    return {
      updatePassowrdVisible: false,
      menuList: [],
      dynamicMenuRoutes: [],
    }
  },
  created() {
    this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
    this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
  },
  components: {
    UpdatePassword
  },
  computed: {
    navbarLayoutType: {
      get() {
        return this.$store.state.common.navbarLayoutType
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
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs
      },
      set(val) {
        this.$store.commit('common/updateMainTabs', val)
      }
    },
    ...mapState('sys/user', {
      userName: state => state.name
    }),
    ...mapState('sys/menu', {
      defaultPage: state => state.defaultPage
    }),
    ...mapState('common', {
      fullscreen: state => state.fullscreen,
      mainTabsActiveName: state => state.mainTabsActiveName,
      documentClientWidth: state => state.documentClientWidth
    }),
    ...mapState('sys/user', {
      headUrl: state => state.headUrl
    }),
  },
  methods: {
    ...mapMutations({
      'updateMenuList': 'sys/menu/updateMenuList',
    }),
    ...mapActions({
      'fullscreenToggleActions': 'common/fullscreenToggle',
      'gotoRouteHandle': 'common/gotoRouteHandle'
    }),
    // 修改密码
    updatePasswordHandle() {
      this.updatePassowrdVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init()
      })
    },
    push(item) {
      if (item.list) {
        let menu = this.getMenu(item.list)
        if (menu) {
          this.gotoRouteHandle(menu)
        }
      } else {
        this.gotoRouteHandle(item)
      }
      this.updateMenuList(item ? item.list : [])
      sessionStorage.setItem('curMenu', JSON.stringify(item))
      this.updateSideBarMenus(item ? item.list : null)

    },
    getMenu(menuList) {
      let menuListTmp = []
      for (let i = 0; i < menuList.length; i++) {
        let m = menuList[i]
        if (m.list) {
          menuListTmp.push(...m.list)
        } else {
          return m
        }
      }
      return this.getMenu(menuListTmp)
    },
    // 退出
    logoutHandle() {
      this.$confirm(`确定进行[退出]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('sys/user/logout')
      })
    },
    staticPush(name) {
      if (this.mainTabsActiveName == name) {
        return
      }
      this.$router.push({'name': name})
    },
  }
}

</script>
