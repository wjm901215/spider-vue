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
                <el-form-item prop="name" label="租户名称">
                  <el-input v-model="formData.name" placeholder="租户名称"
                            clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="code" label="租户编码">
                  <el-input v-model="formData.code" placeholder="租户编码"
                            clearable></el-input>
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

import addOrUpdate from '_cm/mixin/add-or-update'
import {saveOrUpdate} from "@/api/common"

export default {
  data() {
    return {
      formData: {
        name: '',
        code: ''
      },
      dataRule: {
        name: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }]
      },
    }
  },
  mixins: [addOrUpdate],
  methods: {
    init(row) {
      this.formData.id = row.id
      this.formData.name = row.name
      this.formData.code = row.code
    },
    // 表单提交
    formDataSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          saveOrUpdate({
            id: this.formData.id || undefined,
            name: this.formData.name,
            code: this.formData.code
          }, 'base/tenant').then(({data}) => {
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
