<template>
    <div class="warp-container mod-config">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" label-width="80px"
                 ref="searchForm">
            <el-row>
                <el-col :span="21">
                    <el-form-item prop="name" :label="$t('area.column.areaName')">
                        <el-input v-model="dataForm.name" clearable
                                  :placeholder="$t('area.column.areaName')"></el-input>
                    </el-form-item>
                    <el-form-item prop="code" :label="$t('area.column.areaCode')">
                        <el-input v-model="dataForm.code" clearable
                                  :placeholder="$t('area.column.areaCode')"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="getDataList()" type="primary">
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
                <el-col :span="3" class="expandsearch">
                </el-col>
            </el-row>
            <el-collapse-transition>
                <el-card :body-style="{height:'auto'}"  class="operate-wrap">
                    <el-row>
                        <el-col :span="18">
                            <div class="data_selected">
                                <icon-svg name="tip"></icon-svg>
                                <span class="selectOpBox">{{ $t("common.haveChosen") }}</span>
                                <span class="selectOpBox_number">{{ dataListSelections[0] ? dataListSelections[0].name:'' }}</span>
                            </div>
                        </el-col>
                        <el-col :span="6" style="text-align:right;">
                            <el-form-item>
                                <el-button v-if="isAuth('sys:area:save')" type="primary" @click="addHandle">
                                    <icon-svg name="add"></icon-svg>
                                    {{ $t("common.add") }}
                                </el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="info" @click="getDataList" plain>
                                    <icon-svg name="refresh"></icon-svg>
                                    {{ $t("common.refresh") }}
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>
            </el-collapse-transition>
        </el-form>
        <el-table ref="dataTable" :data="dataList" border v-loading="dataListLoading"
                  @selection-change="selectionChangeHandle"
                  @row-click="selectionHandle" style="width: 100%;" :row-style="selectStyle">
            <table-tree-column prop="name" header-align="left" treeKey="id" width="200"
                               :label="$t('area.column.areaName')"></table-tree-column>
            <el-table-column prop="code" header-align="center" align="center" min-width="100"
                             :label="$t('area.column.areaCode')">
            </el-table-column>
            <el-table-column prop="parentName" header-align="left" align="left" min-width="100"
                             :label="$t('area.modal.superiorArea')">
            </el-table-column>
            <el-table-column prop="remark" header-align="left" align="left" :label="$t('common.remark')">
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="200"
                             :label="$t('common.operate')">
                <template slot-scope="scope">
                    <el-button v-if="isAuth('sys:area:update')" type="warning" size="small"
                               @click="updateHandle(scope.row)">{{
                        $t("common.modify") }}
                    </el-button>
                    <el-button v-if="isAuth('sys:area:delete')" type="danger" size="small"
                               @click="deleteHandle(scope.row.id)">{{
                        $t("common.delete") }}
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-model="addOrUpdateVisible" ref="addOrUpdateModal" @change="getDataList"></add-or-update>

    </div>
</template>

<script>
    import TableTreeColumn from "@/components/table-tree-column";
    import AddOrUpdate from './add-or-update'
    import {treeDataTranslate} from "@/utils";
    import {list, deleteList} from "@/api/sys/area";

    export default {
        data() {
            return {
                dataForm: {
                    name: '',
                    code: '',
                },
                dataList: [],
                dataListLoading: false,
                dataListSelections: [],
                addOrUpdateVisible: false,
                rightModalShow: false,
                expandSearch: false,
            }
        },
        components: {
            AddOrUpdate,
            TableTreeColumn
        },
        created() {
            this.getDataList()
        },
        activated(){
            this.$refs.dataTable.doLayout();
        },
        methods: {
            selectionHandle(row) {
                if (this.dataListSelections.filter(r => r.id == row.id).length == 0) {
                    this.dataListSelections = [];
                    this.dataListSelections.push(row);
                } else {
                    this.dataListSelections = [];
                }
            },
            submitMethod() {
            },
            // 获取数据列表
            getDataList() {
                this.dataListLoading = true
                list({
                    'name': this.dataForm.name,
                    'code': this.dataForm.code,
                }, 'sys/area').then(({data}) => {
                    if (data && data.code === 200) {
                        let {list} = data.page
                        this.dataList = treeDataTranslate(list);
                        this.dataListLoading = false
                    }
                })
            },
            // 多选
            selectionChangeHandle(val) {
                this.dataListSelections = val
            },
            // 新增
            addHandle() {
                let parentId = this.dataListSelections[0] ? this.dataListSelections[0].id : '-1'
                let parentName = this.dataListSelections[0] ? this.dataListSelections[0].name : ''
                let level = this.dataListSelections[0] ? this.dataListSelections[0].level : 0
                let parentCode = this.dataListSelections[0] ? this.dataListSelections[0].code : ''
                this.$refs.addOrUpdateModal.initAdd(parentId, parentName, level, parentCode);
                this.addOrUpdateVisible = true;
            },
            // 新增 / 修改
            updateHandle(row) {
                if (row) {
                    this.$refs.addOrUpdateModal.initUpdate(row)
                }
                this.addOrUpdateVisible = true
            },
            //更高选中行的样式
            selectStyle(obj) {
                if (this.dataListSelections.filter(r => r.id == obj.row.id).length > 0) {
                    return {
                        "background-color": "#f2f2f2"
                    };
                }
            },
            // 删除
            deleteHandle(id) {
                let ids = [];
                ids.push(id);
                this.$confirm(this.$t('common.delTip'), this.$t('common.promptTitle'), {
                    confirmButtonText: this.$t('common.sure'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning'
                }).then(() => {
                    deleteList(ids).then(({data}) => {
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
