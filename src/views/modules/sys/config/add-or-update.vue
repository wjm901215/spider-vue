<template>
  <modal v-model="isShow" width="500px">
    <el-form :model="dataForm" ref="form" label-width="100px" :rules="dataRule">
      <div>
        <div class="i-box">
          <div class="i-box-title">
            <icon-svg name="line"></icon-svg>
            {{ $t('config.modal.title') }}
            <h5>{{ $t("common.tip") }}<span>*</span>{{ $t("common.tippp") }}</h5>
          </div>
          <div class="i-box-conn">
            <el-row>
              <el-col :span="24">
                <el-form-item :label="$t('config.column.currency')" prop="isCommon">
                  <el-select v-model="dataForm.isCommon" :placeholder="$t('config.column.currency')">
                    <el-option v-for="row in queryDictionary('IS_COMMON')" :key="row.codeValue"
                               :value="row.codeValue"
                               :label="row.codeText"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item :label="$t('config.column.configType')" prop="isCommon">
                  <el-select v-model="dataForm.type" :placeholder="$t('config.column.configType')">
                    <el-option v-for="row in queryDictionary('CONFIG_TYPE')" :key="row.codeValue"
                               :value="row.codeValue"
                               :formatter="(row) => queryDictionaryText('CONFIG_TYPE',row.type)"
                               :label="row.codeText"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item :label="$t('config.column.configName')" prop="paramKey">
                  <el-input v-model="dataForm.paramKey" :placeholder="$t('config.column.configName')"
                            clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item :label="$t('config.column.configValue')" prop="paramValue">
                  <el-input v-model="dataForm.paramValue"
                            :placeholder="$t('config.column.configValue')" clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item :label="$t('common.remark')" prop="remark">
                  <el-input type="textarea" v-model="dataForm.remark"
                            :placeholder="$t('common.remark')" :row="2" clearable></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer">
      <el-button type="info" @click="isShow = false">{{ $t('common.cancel') }}</el-button>
      <el-button type="success" @click="dataFormSubmit()">{{ $t('common.complete') }}</el-button>
    </div>
  </modal>
</template>

<script>
import Modal from "@/components/modal/modal"
import {clone} from "@/utils"
import {saveOrUpdate, info} from "@/api/common";

export default {
  props: {
    value: {
      required: true,
      type: Boolean
    }
  },
  created() {
    this.isShow = this.value
  },
  watch: {
    value(val) {
      this.isShow = val;
    },
    isShow(val) {
      if (!val) {
        this.$refs.form.clearValidate();
        this.formData = clone(this.formDataBak);
      }
      this.$emit("input", val);
    }
  },
  components: {
    Modal
  },
  data() {
    return {
      isShow: false,
      dataForm: {
        id: 0,
        paramKey: '',
        paramValue: '',
        remark: '',
        isCommon: '1',
        type: '2',
      },
      dataRule: {
        isCommon: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
        type: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
        paramKey: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
        paramValue: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      this.isShow = true
      this.$nextTick(() => {
        this.$refs['form'].resetFields()
        if (this.dataForm.id) {
          info(this.dataForm.id,'sys/config')
              .then(({data}) => {
                if (data && data.code === 200) {
                  let {paramKey, paramValue, remark, type, isCommon} = data.config
                  this.dataForm.paramKey = paramKey
                  this.dataForm.paramValue = paramValue
                  this.dataForm.remark = remark
                  this.dataForm.type = type + ''
                  this.dataForm.isCommon = isCommon + ''
                }
              })
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          saveOrUpdate({
            id: this.dataForm.id || undefined,
            paramKey: this.dataForm.paramKey,
            paramValue: this.dataForm.paramValue,
            remark: this.dataForm.remark,
            isCommon: this.dataForm.isCommon,
            type: this.dataForm.type
          },'sys/config').then(({data}) => {
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
