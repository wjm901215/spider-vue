<template>
    <div class="warp-container">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" label-width="80px"
                 ref="searchForm">
            <el-row>
                <el-col :span="18">
                    <el-form-item prop="codeName" :label="$t('dict.column.dictName')">
                        <el-input v-model="dataForm.codeName" :placeholder="$t('dict.column.dictName')"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item prop="codeType" :label="$t('dict.column.dictType')">
                        <el-input v-model="dataForm.codeType" :placeholder="$t('dict.column.dictType')"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="pageIndex = 1;getDataList()" type="primary">
                            <icon-svg name="search"></icon-svg>
                            {{ $t("common.search") }}
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="$refs['searchForm'].resetFields();" type="info">
                            <icon-svg name="reset"></icon-svg>
                            {{ $t("common.reset") }}
                        </el-button>
                    </el-form-item>
                </el-col>
                <el-col :span="6" style="text-align:right;">
                    <el-button v-if="isAuth('sys:dept:save')" type="primary" @click="addOrUpdateHandle()">
                        <icon-svg name="add"></icon-svg>
                        {{ $t("common.add") }}
                    </el-button>
                    <el-button type="info" @click="getDataList" plain>
                        <icon-svg name="refresh"></icon-svg>
                        {{ $t("common.refresh") }}
                    </el-button>
                </el-col>
            </el-row>
        </el-form>
        <el-table ref="dataTable" :data="dataList" border v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <el-table :data="scope.row.list" border>
                        <el-table-column prop="codeValue" header-align="center" align="center" min-width="100"
                                         :label="$t('dict.column.value')">
                        </el-table-column>
                        <el-table-column prop="codeText" header-align="center" align="center" min-width="100"
                                         :label="$t('dict.column.meaning')">
                        </el-table-column>
                        <el-table-column prop="state" header-align="center" align="center" min-width="100"
                                         :label="$t('common.state')">
                            <template slot-scope="scope">
                                <label v-if="scope.row.state == 1" class="label account_yes">{{ $t("common.enable")
                                    }}</label>
                                <label v-if="scope.row.state == 0" class="label account_off">{{ $t("common.disable")
                                    }}</label>
                            </template>
                        </el-table-column>
                        <el-table-column header-align="center" align="center" width="400" :label="$t('common.operate')">
                            <template slot-scope="scope">
                                <el-button v-if="isAuth('sys:dictionary:update')" type="warning" size="small"
                                           @click="addOrUpdateHandle(scope.row)">
                                    {{ $t("common.modify") }}
                                </el-button>
                                <el-button v-if="isAuth('sys:dictionary:update')" type="info" size="small"
                                           @click="changeStatus(scope.row)">
                                    {{ scope.row.state == '1' ? $t('common.disable') : $t('common.enable') }}
                                </el-button>
                                <el-button v-if="isAuth('sys:dictionary:delete')" type="danger" size="small"
                                           @click="deleteHandle(scope.row.id,true)">{{
                                    $t("common.delete") }}
                                </el-button>
                               <!-- <el-button v-if="isAuth('sys:dictionary:update')" type="success" size="small"
                                           @click="editLangHandle(scope.row.id)">{{
                                    $t("common.language") }}
                                </el-button>-->
                            </template>
                        </el-table-column>
                    </el-table>
                </template>
            </el-table-column>
            <el-table-column prop="codeName" :show-overflow-tooltip="true" header-align="left" align="left"
                             min-width="100"
                             :label="$t('dict.column.dictName')">
            </el-table-column>
            <el-table-column prop="codeType" header-align="left" align="left" min-width="200"
                             :label="$t('dict.column.dictType')">
            </el-table-column>
            <el-table-column prop="tenantName" :show-overflow-tooltip="true" header-align="left" align="left"
                             min-width="100" :label="$t('dict.column.tenant')">
            </el-table-column>
            <el-table-column prop="rowCount" header-align="center" align="center" min-width="100"
                             :label="$t('dict.column.items')">
            </el-table-column>
            <el-table-column prop="isCommon" header-align="center" align="center" min-width="80"
                             :label="$t('dict.column.currency')" :formatter="(row)=>queryDictionaryText('IS_COMMON',row.isCommon)">
                <template slot-scope="scope">
                    <label v-if="scope.row.isCommon == 1" class="label account_yes">{{ $t("common.yes") }}</label>
                    <label v-if="scope.row.isCommon == 0" class="label account_off">{{ $t("common.not") }}</label>
                </template>
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="200"
                             :label="$t('common.operate')">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('sys:dictionary:save')" type="primary" size="small"
                               @click="addOrUpdateHandle(scope.row)">
                        {{ $t("common.add") }}
                    </el-button>
                    <el-button v-if="isAuth('sys:dictionary:delete')" type="danger" size="small"
                               @click="deleteHandle(scope.row.list,false)">{{
                        $t("common.delete") }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                       :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
                       layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>

        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-model="addOrUpdateVisible" ref="addOrUpdateModal" @change="getDataList()"></add-or-update>
        <!--设置多语言-->
        <LangSet :ext-type="2" v-if="langSetVisible" ref="langSet"></LangSet>
    </div>
</template>

<script>
    import AddOrUpdate from './add-or-update'
    import {list, deleteDictionary,updateState} from "@/api/sys/dictionary";
    import LangSet from '_cm/lang-set'

    export default {
        data() {
            return {
                dataForm: {
                    codeName: '',
                    codeType: '',
                },
                dataList: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false,
                dataListSelections: [],
                addOrUpdateVisible: false,
                rightModalShow: false,
                langSetVisible: false,
            }
        },
        components: {
            AddOrUpdate,
            LangSet
        },
        created() {
            this.getDataList()
        },
        activated(){
            this.$refs.dataTable.doLayout();
        },
        methods: {
            submitMethod() {
            },
            // 获取数据列表
            getDataList() {
                this.dataListLoading = true
                list({
                    'page': this.pageIndex,
                    'limit': this.pageSize,
                    'codeName': this.dataForm.codeName,
                    'codeType': this.dataForm.codeType
                }, 'sys/dictionary').then(({data}) => {
                    if (data && data.code === 200) {
                        let {list, totalCount} = data.page
                        this.dataList = list
                        this.totalPage = totalCount
                        this.dataListLoading = false
                    }
                })
            },
            // 每页数
            sizeChangeHandle(val) {
                this.pageSize = val
                this.pageIndex = 1
                this.getDataList()
            },
            // 当前页
            currentChangeHandle(val) {
                this.pageIndex = val
                this.getDataList()
            },
            // 编辑多语言Handle
            editLangHandle(extId) {
                this.langSetVisible = true
                this.$nextTick(() => {
                    this.$refs.langSet.init(extId)
                })
            },
            // 新增 / 修改
            addOrUpdateHandle(row) {
                if (row) {
                    if (row.id) {
                        this.$refs.addOrUpdateModal.initUpdate(row)
                    } else {
                        this.$refs.addOrUpdateModal.initAdd(row)
                    }
                }
                this.addOrUpdateVisible = true
            },
            changeStatus(row) {
                updateState({
                    'id': row.id,
                    'state': row.state == '1' ? '0' : '1'
                }).then(({data}) => {
                    if (data && data.code === 200) {
                        row.state = row.state == '1' ? '0' : '1';
                    }
                }).catch(errMsg => this.$message.error(errMsg))

            },
            // 删除
            deleteHandle(id, isSingle) {
                let ids = []
                ids = isSingle ? [id] : id.map(item => {
                    return item.id
                })
                this.$confirm(this.$t('common.delTip'), this.$t('common.delTipInfo'), {
                    confirmButtonText: this.$t('common.sure'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning'
                }).then(() => {
                    deleteDictionary(ids).then(({data}) => {
                        if (data && data.code === 200) {
                            this.$message({
                                message: this.$t('common.successTip'),
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.getDataList()
                                }
                            })
                        }
                    }).catch(errMsg => this.$message.error(errMsg))
                }).catch(() => {
                })
            }
        }
    }
</script>
<style>
</style>
