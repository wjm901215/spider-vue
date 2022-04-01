<template>
    <div class="warp-container mod-log">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" label-width="130px">
            <el-row>
                <el-col :span="21">
                    <el-form-item :label="$t('log.column.userNameOrOperate')">
                        <el-input v-model="dataForm.key" :placeholder="$t('log.column.userNameOrOperate')"
                                  clearable></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="pageIndex = 1;getDataList()" type="primary">
                            <icon-svg name="search"></icon-svg>
                            {{ $t("common.search") }}
                        </el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="resetSearchbox()" type="info">
                            <icon-svg name="reset"></icon-svg>
                            {{ $t("common.reset") }}
                        </el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-table :data="dataList" border v-loading="dataListLoading" style="width: 100%">
            <el-table-column fixed="left" prop="username" width="120" header-align="left" align="left"
                             :label="$t('log.column.userName')">
            </el-table-column>
            <el-table-column fixed="left" prop="operation" width="100" header-align="celeftnter" align="left"
                             :label="$t('common.operate')">
            </el-table-column>
            <el-table-column prop="method" header-align="left" align="left" width="450" :show-overflow-tooltip="true"
                             :label="$t('log.column.requestMethod')">
            </el-table-column>
            <el-table-column prop="param" header-align="left" align="left"  :show-overflow-tooltip="true"
                             :label="$t('log.column.requestParameters')">
            </el-table-column>
            <el-table-column prop="time" header-align="center" align="center" width="100"
                             :label="$t('log.column.lengthOfExecution')" :formatter="(row) => row.time + 'ms'">
            </el-table-column>
            <el-table-column prop="ip" header-align="left" align="left" width="150"
                             :label="$t('log.column.requestAddress')">
            </el-table-column>
            <el-table-column prop="createDate" header-align="center" align="center" width="180"
                             :show-overflow-tooltip="true" :label="$t('log.column.requestTime')">
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
                layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>
</template>

<script>
    import {list} from "@/api/common"
    export default {
        data() {
            return {
                dataForm: {
                    key: ''
                },
                dataList: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false,
                selectionDataList: []
            }
        },
        created() {
            this.getDataList()
        },
        methods: {
            //重置搜索框
            resetSearchBox() {
                this.dataForm.key = '',
                    this.getDataList()
            },
            // 获取数据列表
            getDataList() {
                this.dataListLoading = true
                list({
                  'page': this.pageIndex,
                  'limit': this.pageSize,
                  'key': this.dataForm.key
                }, 'sys/log').then(({data}) => {
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
            }
        }
    }
</script>
<style>
</style>
