<template>
  <el-dialog
      title="修改密码"
      :visible.sync="visible" width="25%"
      :append-to-body="true">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px" style="padding:15px;">
      <el-form-item label="账号">
        <span>{{ userName }}</span>
      </el-form-item>
      <el-form-item label="原密码" prop="password">
        <el-input type="password" v-model="dataForm.password"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="dataForm.newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input type="password" v-model="dataForm.confirmPassword"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {mapState} from 'vuex'
import {password} from "@/api/sys/user";
export default {
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
      } else if (value !== this.dataForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      dataForm: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      },
      dataRule: {
        password: [
          {required: true, message: '原密码不能为空', trigger: 'blur'}
        ],
        newPassword: [{
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
        confirmPassword: [{
          required: true,
          validator: validatePass2,
          trigger: 'blur'
        }
        ]
      }
    }
  },
  computed: {
    ...mapState('sys/user', {
      userName: state => state.name
    }),
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs
      },
      set(val) {
        this.$store.commit('common/updateMainTabs', val)
      }
    }
  },
  methods: {
    // 初始化
    init() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          password({
            'password': this.dataForm.password,
            'newPassword': this.dataForm.newPassword
          }).then(({data}) => {
            if (data && data.code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.visible = false
                  this.$nextTick(() => {
                    this.mainTabs = []
                    this.$cookie.delete('token')
                    this.$router.replace({name: 'login'})
                  })
                }
              })
            }else{
              this.$message.error(data.msg)
            }
          }).catch(msg => this.$message.error(msg))
        }
      })
    }
  }
}
</script>

