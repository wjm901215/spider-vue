<template>
    <div class="loginCitybrain">
        <div class="loginBox">
            <h1>南浔区生活垃圾精准分类大数据监管云</h1>
            <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" status-icon>
                <el-form-item prop="username">
                    <div data-validate="Enter username">
                        <span>
                            <i class="el-icon-user-solid"></i>
                        </span>
                        <input v-model="dataForm.userName" autocomplete="off" type="text" name="username" placeholder="用户名">
                    </div>
                </el-form-item>
                <el-form-item prop="password">
                    <div data-validate="Enter password">
                        <span>
                            <i class="el-icon-lock"></i>
                        </span>
                        <input v-model="dataForm.password" autocomplete="off" type="password" name="pass" placeholder="密码">
                    </div>
                </el-form-item>

                <div class="login-form-btn">
                    <el-button @click="dataFormSubmit">
                        登录
                    </el-button>
                </div>

            </el-form>
        </div>
        <div class="footer">
            &copy;技术支持：杭州海多普科技有限公司
        </div>
    </div>
</template>

<script>
    import './index.less'
    import {buildRouter} from "@/router";

    export default {
        data() {
            return {
                dataForm: {
                    userName: '',
                    password: '',

                },
                dataRule: {
                    userName: [{
                        required: true,
                        message: "用户名不能为空",
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: "验证码不能为空",
                        trigger: 'blur'
                    }],
                }
            }
        },
        methods: {
            // 提交表单
            dataFormSubmit() {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        this.$store.dispatch("sys/user/login", {
                            'account': this.dataForm.userName,
                            'password': this.dataForm.password,
                        }).then(() => {
                            buildRouter(true).then(() => {
                            }).catch(errMsg => {
                                this.$message.error(errMsg)
                            })
                            sessionStorage.removeItem("menus")
                        }).catch(errMsg => {
                            this.$message.error(errMsg)
                        })
                    }
                })
            }
        }
    }

</script>
