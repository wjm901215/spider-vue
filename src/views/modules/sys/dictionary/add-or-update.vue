<template>
    <modal v-model="isShow" width="500px">
        <el-form :model="formData" ref="form" label-width="100px" :rules="rules">
            <div>
                <div class="i-box">
                    <div class="i-box-title">
                        <icon-svg name="line"></icon-svg>
                        {{ $t('dict.modal.title') }}
                        <h5>{{ $t("common.tip") }}<span>*</span>{{ $t("common.tippp") }}</h5>
                    </div>
                    <div class="i-box-conn">
                        <el-row>
                            <el-col :span="24">
                                <el-form-item prop="codeName" :label="$t('dict.column.dictName')">
                                    <el-input v-model="formData.codeName"
                                              :placeholder="$t('dict.column.dictName')"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item prop="codeType" :label="$t('dict.column.dictType')">
                                    <el-input v-model="formData.codeType"
                                              :placeholder="$t('dict.column.dictType')"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item prop="codeValue" :label="$t('dict.column.value')">
                                    <el-input v-model="formData.codeValue"
                                              :placeholder="$t('dict.column.value')"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="isCommon" :label="$t('dict.column.currency')">
                                    <el-select v-model="formData.isCommon" :placeholder="$t('dict.column.currency')"
                                               style="width:100%">
                                        <el-option :value="0" :label="$t('common.not')"></el-option>
                                        <el-option :value="1" :label="$t('common.yes')"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="orderNum" :label="$t('common.orderNum')">
                                    <el-input-number v-model="formData.orderNum" style="width:100%" :min="1"
                                                     :label="$t('common.orderNum')"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item prop="codeText" :label="$t('dict.column.meaning')">
                                    <el-input v-model="formData.codeText" type="textarea" :row="2"
                                              :placeholder="$t('dict.column.meaning')"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </div>
        </el-form>
        <div slot="footer">
            <el-button type="info" @click="isShow = false;restForm()">{{ $t('common.cancel') }}</el-button>
            <el-button type="success" @click="submit">{{ $t('common.complete') }}</el-button>
        </div>
    </modal>
</template>

<script>
    import Modal from "@/components/modal/modal"
    import {saveOrUpdate} from "@/api/sys/dictionary"

    export default {
        props: {
            value: {
                required: true,
                type: Boolean
            }
        },
        watch: {
            value(val) {
                this.isShow = val;
            },
            isShow(val) {
                this.$emit("input", val);
                if (!val) {
                    this.restForm();
                }
            }
        },
        data() {
            return {
                isShow: false,
                formDataBak: {},
                formData: {
                    id: "",
                    codeType: "",
                    codeValue: "",
                    codeText: "",
                    codeName: "",
                    isCommon: 1,
                    orderNum: 1
                },
                rules: {
                    codeType: [{
                        required: true,
                        message: this.$t('common.inputTip'),
                        trigger: "blur"
                    }],
                    codeValue: [{
                        required: true,
                        message: this.$t('common.inputTip'),
                        trigger: "blur"
                    }],
                    codeText: [{
                        required: true,
                        message: this.$t('common.inputTip'),
                        trigger: "blur"
                    }],
                    codeName: [{
                        required: true,
                        message: this.$t('common.inputTip'),
                        trigger: "blur"
                    }],
                    isCommon: [{
                        required: true,
                        message: this.$t('dict.modal.inputCommonTip'),
                        trigger: "blur"
                    }],
                    orderNum: [{
                        required: true,
                        message: this.$t('common.inputTip'),
                        trigger: "blur"
                    }]
                }
            };
        },
        components: {
            Modal
        },
        methods: {
            restForm() {
                this.$refs.form.clearValidate();
                this.$refs.form.resetFields();
            },
            submit() {
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        this.save();
                    }
                });
            },
            initAdd(row) {
                this.formData.id = "";
                this.formData.codeType = row.codeType;
                this.formData.codeText = row.codeText;
                this.formData.codeName = row.codeName;
                this.formData.orderNum = row.rowCount + 1;
            },
            initUpdate(row) {
                this.formData.id = row.id;
                this.formData.codeType = row.codeType;
                this.formData.codeValue = row.codeValue;
                this.formData.codeText = row.codeText;
                this.formData.codeName = row.codeName;
                this.formData.isCommon = row.isCommon;
                this.formData.orderNum = row.orderNum;
            },
            save() {
                saveOrUpdate({
                    id: this.formData.id || undefined,
                    codeType: this.formData.codeType,
                    codeValue: this.formData.codeValue,
                    codeText: this.formData.codeText,
                    codeName: this.formData.codeName,
                    isCommon: this.formData.isCommon,
                    orderNum: this.formData.orderNum
                }).then(({data}) => {
                    if (data && data.code === 200) {
                        this.$message({
                            message: this.$t('common.successTip'),
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.isShow = false
                                this.$emit('change')
                                this.restForm();
                            }
                        })
                    }
                }).catch(errMsg => this.$message.error(errMsg))

            }
        }
    };

</script>

<style lang="lcss">
</style>
