<template>
  <modal v-model="isShow" width="600px">
    <el-form :model="formData" ref="form" label-width="100px" :rules="rules">
      <div v-if="page == 0">
        <div class="i-box">
          <div class="i-box-title">
            <icon-svg name="line"></icon-svg>
            {{ $t("user.modal.title1") }}
            <h5>{{ $t("common.tip") }}<span>*</span>{{ $t("common.tippp") }}</h5>
          </div>
          <div class="i-box-conn">
            <el-row>
              <el-col :span="24">
                <el-form-item prop="streetViewUrl" label="头像">
                  <el-upload
                      class="avatar-uploader"
                      action="/api/common/upload?module=1"
                      :headers="headers"
                      :on-success="handleSuccess"
                      :on-remove="handleRemove"
                      :before-upload="beforeAvatarUpload"
                      :show-file-list="false">
                    <img v-if="formData.headUrl" :src="formData.headUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24" v-show="false">
                <el-form-item prop="id" label="主键ID">
                  <el-input v-model="formData.id" placeholder="主键ID"
                            clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="name" :label="$t('user.column.personnelName')">
                  <el-input v-model="formData.name" style="width:200px;"
                            :placeholder="$t('user.column.personnelName')"
                            clearable></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="sex" :label="$t('user.column.sex')">
                  <el-radio v-model="formData.sex" v-for="row in queryDictionary('SEX')"
                            :key="row.codeValue"
                            :label="row.codeValue">{{
                      row.codeText
                    }}
                  </el-radio>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="identityNo" :label="$t('user.column.identityNo')">
                  <el-input v-model="formData.identityNo" clearable style="width:200px;"
                            :change="setSexAndBirth()"
                            :placeholder="$t('user.column.identityNo')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="birthDate" :label="$t('user.column.birthdate')">
                  <el-date-picker v-model="formData.birthDate" type="date" clearable
                                  format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd"
                                  style="width:180px;"
                                  :placeholder="$t('user.column.birthdate')"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="entryDate" :label="$t('user.column.entryDate')">
                  <el-date-picker v-model="formData.entryDate" type="date" clearable
                                  format="yyyy-MM-dd"
                                  value-format="yyyy-MM-dd"
                                  style="width:200px;"
                                  :placeholder="$t('user.column.entryDate')"></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="mobile" :label="$t('user.column.tel')">
                  <el-input v-model="formData.mobile" clearable style="width:180px;"
                            :placeholder="$t('user.column.tel')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="lang" label="系统语言">
                  <el-radio-group v-model="formData.lang" class="job-type-radio">
                    <el-radio label="11" v-for="row in queryDictionary('LANG')" :key="row.codeValue"
                              :label="row.codeValue">
                      {{ row.codeText }}
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="address" :label="$t('user.column.address')">
                  <el-input type="textarea" v-model="formData.address" :row="2" clearable
                            style="width:100%;"
                            :placeholder="$t('user.column.address')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="i-box" v-if="formData.id == ''">
          <div class="i-box-title">
            <icon-svg name="line"></icon-svg>
            {{ $t("user.modal.title3") }}
          </div>
          <div class="i-box-conn">
            <el-row>
              <el-col :span="24">
                <el-form-item prop="account" :label="$t('user.column.account')">
                  <el-input :disabled="formData.id!=''" v-model="formData.account" clearable
                            style="width:200px;"
                            :placeholder="$t('user.column.account')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="password" :label="$t('user.modal.password')">
                  <el-input v-model="formData.password" type="password" autocomplete="off" clearable
                            style="width:200px;"
                            :placeholder="$t('user.modal.password')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="password2" :label="$t('user.modal.confirm')">
                  <el-input v-model="formData.password2" type="password" autocomplete="off" clearable
                            style="width:200px;"
                            :placeholder="$t('user.modal.confirmPassword')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div v-if="page == 1">
        <div class="i-box">
          <div class="i-box-title">
            <icon-svg name="line"></icon-svg>
            {{ $t("user.modal.title2") }}
            <h5>{{ $t("common.tip") }}<span>*</span>{{ $t("common.tippp") }}</h5>
          </div>
          <div class="i-box-conn">

            <el-row>
              <el-col :span="24">
                <el-form-item prop="tenantIds" :label="$t('user.column.tenantAllocation')" v-if="this.jobType == 11">
                  <el-select v-model="formData.tenantIds" filterable placeholder="请选择租户" multiple
                             style="width: 100%" @change="getRoleByTenantId">
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
                <el-form-item size="mini" prop="roleIdList" :label="$t('user.column.role')">
                  <el-checkbox-group v-model="formData.roleIdList">
                    <el-checkbox v-for="role in selectOption" :key="role.roleId"
                                 :label="role.roleId">{{ role.roleName }}
                    </el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item prop="deptId" :label="$t('user.column.deptName')">
                  <DeptCasecade v-model="formData.deptId" :filter="true"
                                style="width:100%;"
                                :placeholder="$t('user.column.deptName')"></DeptCasecade>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </el-form>
    <div slot="footer">
      <el-button type="info" @click="isShow = false;page = 0">{{ $t('common.cancel') }}</el-button>
      <el-button type="warning" @click="previous" v-show="page != 0 || page == 2">{{
          $t('common.back')
        }}
      </el-button>
      <el-button type="primary" @click="next" v-show="page == 0">{{
          $t('common.next')
        }}
      </el-button>
      <el-button type="success" @click="submit()" v-show="page == 1">{{
          $t('common.ok')
        }}
      </el-button>
    </div>
  </modal>
</template>
<script>
import DeptCasecade from '@/components/cascade/dept-cascade'
import {clone} from '@/utils'
import {validatePhone, validateIdentifyCode, isIdentifyCode} from '@/utils/validate'
import {mapActions, mapState} from 'vuex'
import addOrUpdate from '_cm/mixin/add-or-update'
import {saveUser, queryUserDetail} from "@/api/sys/user";
import {getToken} from "@/utils/auth";

export default {
  created() {
    this.loadSelectList()
    this.formDataBak = clone(this.formData)
  },
  computed: {
    lang: {
      get() {
        return this.$store.state.sys.user.lang
      }
    },
    jobType: {
      get() {
        return this.$store.state.sys.user.jobType
      }
    },
    ...mapState('sys/role', [
      "selectOption"
    ]),
    ...mapState('base/tenant', [
      "tenantOptions"
    ])
  },
  watch: {
    isShow(val) {
      if (!val) {
        this.formData = clone(this.formDataBak)
        this.updateSelectAction()
      }
    }
  },
  mixins: [addOrUpdate],
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.formData.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      roadSections: [],
      page: 0,
      headers: {
        token: getToken()  //从cookie里获取token，并赋值  Authorization ，而不是token
      },
      formDataBak: {},
      roleList: [],
      formData: {
        id: '',
        name: '',
        sex: '1',
        mobile: '',
        address: '',
        identityNo: '',
        jobType: '',
        birthDate: '',
        lang: 'zh-CN',
        entryDate: new Date().format("yyyy-MM-dd"),
        deptId: '',
        account: '',
        password: '',
        tenantIds: [],
        password2: '',
        headUrl: '',
        roleIdList: [],
        personnelId: ''
      },
      rules: {
        name: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
        sex: [{
          required: true,
          message: '请选择性别',
          trigger: 'blur'
        }],
        mobile: [{
          required: false,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        },
          {
            validator: validatePhone,
            trigger: 'blur'
          }
        ],
        identityNo: [{
          required: false,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        },
          {
            validator: validateIdentifyCode,
            trigger: 'blur'
          }
        ],
        deptId: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
        entryDate: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        }],
        tenantIds: [{
          required: true,
          message: "租户不能为空",
          trigger: 'blur'
        }],
        lang: [{
          required: true,
          message: '语言不能为空',
          trigger: 'blur'
        }],
        roleIdList: [{
          required: true,
          message: '角色不能为空',
          trigger: 'blur'
        }],
        account: [{
          required: true,
          message: this.$t('common.inputTip'),
          trigger: 'blur'
        },
          {
            min: 6,
            max: 20,
            message: '账号不足六位数',
            trigger: 'blur'
          }
        ],
        password: [{
          required: true,
          validator: validatePass,
          trigger: 'blur'
        },
          {
            pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/,
            message: '密码长度为8-20位，必须包含数字、大小写、特殊符号',
            trigger: 'blur'
          }
        ],
        password2: [{
          required: true,
          validator: validatePass2,
          trigger: 'blur'
        }
        ]
      }
    }
  },
  components: {
    DeptCasecade
  },
  methods: {
    ...mapActions({
      updateSelectAction: 'sys/role/updateSelect',
      updateTenantSelect: 'base/tenant/updateSelect'
    }),
    next() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.page++
        }
      })
      this.updateSelectAction([])
    },
    previous() {
      this.page--
    },
    loadSelectList() {
      this.updateTenantSelect()
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.saveUser()
        } else {
          return false
        }
      })
    },
    loadUserDetail(id) {
      queryUserDetail({
        id: id
      }).then(res => {
        let data = res.data.data
        this.formData = data
        this.formData.deptId = data.deptId + ''
        this.formData.jobType = data.jobType + ''
        this.formData.password = '$$$$$$$$$$'
        this.formData.password2 = '$$$$$$$$$$'
        this.formData.tenantId = data.tenantId
        this.getRoleByTenantId(data.tenantIds)
      })
    },
    saveUser() {
      saveUser({
        id: this.formData.id || undefined,
        name: this.formData.name,
        sex: this.formData.sex,
        mobile: this.formData.mobile,
        address: this.formData.address,
        identityNo: this.formData.identityNo,
        lang: this.formData.lang,
        birthDate: this.formData.birthDate ? this.formData.birthDate : '',
        entryDate: this.formData.entryDate ? this.formData.entryDate : '',
        deptId: this.formData.deptId,
        account: this.formData.account,
        password: this.formData.password != '$$$$$$$$$$' ? this.formData.password : null,
        roleIdList: this.formData.roleIdList,
        personnelId: this.formData.personnelId,
        tenantIds: this.formData.tenantIds,
        headUrl: this.formData.headUrl
      }).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success',
          duration: 1500,
          onClose: () => {
            this.isShow = false
            this.$emit('refreshDataList')
            this.page = 0
          }
        })

      }).catch(errMsg => this.$message.error(errMsg))
    },
    getRoleByTenantId(tenantIds) {
      this.updateSelectAction(tenantIds)
    },
    setSexAndBirth() {
      if (!isIdentifyCode(this.formData.identityNo)) {
        return;
      }
      //获取输入身份证号码
      let UUserCard = this.formData.identityNo;
      //获取出生日期
      this.formData.birthDate = UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
      //获取性别
      if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
        this.formData.sex = 1 + ''
      } else {
        this.formData.sex = 2 + ''
      }
    },
    handleRemove(file, fileList) {
      this.formData.headUrl = fileList
    },
    handleSuccess(response, file) {
      if (response) {
        this.formData.headUrl = response.url
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'image/gif' || file.type == 'image/bmp');
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error('图片格式不正确!');
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过1MB!');
      }
      return isJPG && isLt2M;
    },
  }
}
</script>
<style>

.job-type-radio .el-radio {
  margin-left: 12px;
}

.job-type-radio .el-radio:nth-child(1) {
  margin-left: 0px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
