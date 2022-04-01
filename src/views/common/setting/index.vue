<template>
    <el-form>
        <h2>{{ $t("common.sysConf") }}</h2>
        <el-form-item :label="$t('common.langSet')">
            <el-radio-group v-model="language" @change="(val)=>switchLanguage(val)">
                <el-radio v-for="row in queryDictionary('LANG')" :key="row.codeValue" :label="row.codeValue" border>{{
                    row.codeText }}
                </el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('common.tenantSet')">
            <el-radio-group v-model="tenantId" @change="(val)=>{switchTenant(val)}">
                <el-radio v-for="row in tenantDatas" :key="row.extId" :label="row.extId" border>{{ row.extName }}
                </el-radio>
            </el-radio-group>
        </el-form-item>
    </el-form>
</template>

<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        data() {
            return {
                tenantDatas: [],
                tenantId: '',
                language: this.$i18n.locale,
            }
        },
        computed: {
            ...mapState('sys/user', [
                "lang"
            ]),
            ...mapState('sys/menu', [
                "defaultPage"
            ]),
            navbarLayoutType: {
                get() {
                    return this.$store.state.common.navbarLayoutType
                },
                set(val) {
                    this.$store.commit('common/updateNavbarLayoutType', val)
                }
            },
            sidebarLayoutSkin: {
                get() {
                    return this.$store.state.common.sidebarLayoutSkin
                },
                set(val) {
                    this.$store.commit('common/updateSidebarLayoutSkin', val)
                }
            }
        },
        mounted() {
            this.selectTenantData()
        },
        methods: {
            ...mapActions({
                switchLanguageAction: 'sys/user/switchLanguage',
                selectTenantDataAction: 'base/tenant/selectTenantData',
                switchTenantId: 'sys/user/switchTenantId'
            }),
            switchLanguage(val) {
                this.switchLanguageAction(this.language).then(() => {
                    this.$i18n.locale = val
                    this.$router.push({name: this.defaultPage.routerName})
                    sessionStorage.removeItem("menus")
                    document.location.reload();
                }).catch(errMsg => this.$message.error(errMsg))
            },
            selectTenantData() {
                this.selectTenantDataAction().then(({list, tenantId}) => {
                    this.tenantDatas = list;
                    this.tenantId = tenantId;
                })
            },
            switchTenant(val) {
                this.switchTenantId(val).then(() => {
                    this.$message.success("租户切换成功")
                }).catch(errMsg => this.$message.error(errMsg))
            }
        }
    }
</script>

