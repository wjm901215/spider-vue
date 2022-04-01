<template>
  <modal v-model="isShow" width="500px">
    <el-form :model="formData" ref="form" label-width="140px" :rules="dataRule">
      <div>
        <div class="i-box">
          <div class="i-box-title">
            <icon-svg name="line"></icon-svg>
            {{ $t('role.modal.title') }}
            <h5>{{ $t("common.tip") }}<span>*</span>{{ $t("common.tippp") }}</h5>
          </div>
          <div class="i-box-conn">
            <el-row>
              <el-col :span="24" v-show="false">
                <el-form-item prop="id" label="主键ID">
                  <el-input v-model="formData.id" placeholder="主键ID"
                            clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="roleName" :label="$t('role.column.roleName')">
                  <el-input v-model="formData.roleName" :placeholder="$t('role.column.roleName')"
                            clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="tenantId" :label="$t('user.column.tenantAllocation')">
                  <el-select v-model="formData.tenantId" filterable placeholder="请选择租户"
                             style="width: 100%">
                    <el-option
                        v-for="item in tenantOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="remark" :label="$t('common.remark')">
                  <el-input type="textarea" v-model="formData.remark"
                            :placeholder="$t('common.remark')" :row="2" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item :label="$t('role.modal.menuAuthorization')">
                  <el-tree :data="menuList" :props="menuListTreeProps" node-key="menuId"
                           ref="menuListTree" :default-expand-all="true" show-checkbox>
                  </el-tree>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer">
      <el-button type="info" @click="isShow = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="success" @click="formDataSubmit()">{{ $t('common.complete') }}</el-button>
    </div>
  </modal>
</template>

<script>
import {treeDataTranslate} from '@/utils'
import {info, saveOrUpdate} from "@/api/sys/role";
import {menuList} from "@/api/sys/menu"
import {mapActions,mapState} from 'vuex'
import addOrUpdate from '_cm/mixin/add-or-update'

export default {
  created() {
    this.updateTenantSelect()
  },
  mixins: [addOrUpdate],
  computed: {
    ...mapState('base/tenant', [
      "tenantOptions"
    ])
  },
  data() {
    return {
      menuList: [],
      tenants: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      formData: {
        id: 0,
        roleName: '',
        tenantId: '',
        remark: ''
      },
      dataRule: {
        roleName: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
        tenantId: [{
          required: true,
          message: "租户不能为空",
          trigger: 'blur'
        }],
      },
      tempKey: -666666 // 临时key, 用于解决tree半选中状态项不能传给后台接口问题. # 待优化
    }
  },
  methods: {
    ...mapActions({
      updateTenantSelect: 'base/tenant/updateSelect'
    }),
    init(id, isClone = false) {
      menuList(
      ).then(({data}) => {
        this.menuList = treeDataTranslate(data, 'menuId')
      }).then(() => {
        this.formData.id = id || 0
        if (this.formData.id) {
          info(this.formData.id).then(({data})=> {
            if (data && data.code === 200) {
              let role = data.role
              this.formData.roleName = role.roleName
              this.formData.remark = role.remark
              this.formData.tenantId = role.tenantId
              this.$refs.menuListTree.setCheckedKeys(role.menuIdList)
              //克隆操作删除id
              this.formData.id = isClone ? '' : this.formData.id
            }
          })
        }
      })
    },
    // 表单提交
    formDataSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          saveOrUpdate({
            id: this.formData.id || undefined,
            roleName: this.formData.roleName,
            remark: this.formData.remark,
            tenantId: this.formData.tenantId,
            halfMenuIdList: this.$refs.menuListTree.getHalfCheckedKeys(),
            menuIdList: this.$refs.menuListTree.getCheckedKeys()
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: this.$t('common.successTip'),
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.isShow = false
                  this.$emit('refreshDataList')
                }
              })
            }
          }).catch(errMsg => this.$message.error(errMsg))
        }
      })
    }
  }
}
</script>
<style>
</style>
