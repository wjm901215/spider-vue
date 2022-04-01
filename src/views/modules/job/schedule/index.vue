<template>
    <div class="warp-container">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" label-width="90px"
                 ref="searchForm">
            <el-row>
                <el-col :span="24">
                    <el-form-item :label="$t('schedule.column.beanName')" prop="">
                        <el-input v-model="dataForm.beanName" :placeholder="$t('schedule.column.beanName')"
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
            </el-row>
            <el-collapse-transition>
                <el-card :body-style="{height:'auto'}" class="operate-wrap">
                    <el-row>
                        <el-col :span="18">
                            <div class="data_selected">
                                <icon-svg name="tip"></icon-svg>
                                <span class="selectOpBox">{{ $t("common.haveChosen") }}</span>
                                <span class="selectOpBox_number">{{ dataListSelections.length }}</span>
                                <span class="selectOpBox">{{ $t("common.row") }}</span>
                            </div>
                            <span style="margin-left: 30px">
                <el-button v-if="isAuth('sys:schedule:delete')"
                           :type="dataListSelections.length == 0 ?'primary' : 'danger'"
                           plain :disabled="dataListSelections.length == 0" @click="deleteHandle()">
                  <icon-svg name="del"></icon-svg> {{ $t("common.batchDeletion") }}
                </el-button>
                <el-button v-if="isAuth('sys:schedule:pause')"
                           :type="dataListSelections.length == 0 ?'primary' : 'info'"
                           plain :disabled="dataListSelections.length == 0" @click="pauseHandle()">
                  <icon-svg name="del"></icon-svg> {{ $t("common.batchPause") }}
                </el-button>
                <el-button v-if="isAuth('sys:schedule:resume')"
                           :type="dataListSelections.length == 0 ?'primary' : 'primary'"
                           plain :disabled="dataListSelections.length == 0" @click="resumeHandle()">
                  <icon-svg name="del"></icon-svg> {{ $t("common.batchResume") }}
                </el-button>
                <el-button v-if="isAuth('sys:schedule:run')"
                           :type="dataListSelections.length == 0 ?'primary' : 'success'"
                           plain :disabled="dataListSelections.length == 0" @click="runHandle()">
                  <icon-svg name="del"></icon-svg> {{ $t("common.batchRun") }}
                </el-button>
              </span>
                        </el-col>
                        <el-col :span="6" style="text-align:right;">
                            <el-form-item>
                                <el-button v-if="isAuth('sys:schedule:save')" type="primary"
                                           @click="addOrUpdateHandle()">
                                    <icon-svg name="add"></icon-svg>
                                    {{ $t("common.add") }}
                                </el-button>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="success" @click="logHandle()">
                                    <icon-svg name="refresh"></icon-svg>
                                    {{ $t("common.logList") }}
                                </el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-card>
            </el-collapse-transition>
        </el-form>
        <el-table ref="dataTable"  :data="dataList"  border v-loading="dataListLoading"
                  @selection-change="selectionChangeHandle" @row-click="selectionHandle" style="width: 100%;">
            <el-table-column type="selection" header-align="center" align="center" width="50">
            </el-table-column>
            <!-- <el-table-column prop="jobId" header-align="center" align="center" width="80" label="ID">
             </el-table-column>-->
            <el-table-column prop="beanName" header-align="left" align="left" :label="$t('schedule.column.beanName')"
                             :show-overflow-tooltip='true'>
            </el-table-column>
            <el-table-column prop="methodName" header-align="left" align="left"
                             :label="$t('schedule.column.methodName')" :show-overflow-tooltip='true'>
            </el-table-column>
            <el-table-column prop="cronExpression" header-align="left" align="left"
                             :label="$t('schedule.column.cronExpressions')" :show-overflow-tooltip='true'>
            </el-table-column>
            <el-table-column prop="status" header-align="center" align="center" width="90"
                             :label="$t('schedule.column.scheduleStatus')">
                <template slot-scope="scope">
                    <label v-if="scope.row.status == 0" class="label account_yes">{{ $t("common.normal") }}</label>
                    <label v-if="scope.row.status == 1" class="label account_off">{{ $t("common.pause") }}</label>
                </template>
            </el-table-column>
            <el-table-column prop="params" header-align="center" align="center" :label="$t('schedule.column.parameter')"
                             :show-overflow-tooltip='true'>
            </el-table-column>
            <el-table-column prop="remark" header-align="left" align="left" :label="$t('common.remark')"
                             :show-overflow-tooltip='true'>
            </el-table-column>
            <el-table-column fixed="right" header-align="center" align="center" width="400px"
                             :label="$t('common.operate')">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="修改" placement="top-start">
                        <el-button v-if="isAuth('sys:schedule:update')" type="primary" icon="el-icon-edit" circle
                                   @click="addOrUpdateHandle(scope.row.jobId)">
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top-start">
                        <el-button v-if="isAuth('sys:schedule:delete')" type="danger" icon="el-icon-delete" circle
                                   @click="deleteHandle(scope.row.jobId)">
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="暂停" placement="top-start">
                        <el-button v-if="isAuth('sys:schedule:pause')" type="warning" icon="el-icon-turn-off" circle
                                   @click="pauseHandle(scope.row.jobId)">
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="恢复" placement="top-start">
                        <el-button v-if="isAuth('sys:schedule:resume')" type="success" icon="el-icon-open" circle
                                   @click="resumeHandle(scope.row.jobId)">
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="立即执行" placement="top-start">
                        <el-button v-if="isAuth('sys:schedule:run')" type="success" icon="el-icon-video-play" circle
                                   @click="runHandle(scope.row.jobId)">
                        </el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="日志" placement="top-start">
                        <el-button v-if="isAuth('sys:schedule:list')" type="info" icon="el-icon-document" circle
                                   @click="showLog(scope.row.jobId)">
                        </el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="sizeChangeHandle"
                @current-change="currentChangeHandle"
                :current-page="pageIndex"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                :total="totalPage"
                layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
        <!-- 弹窗, 日志列表 -->
        <log v-if="logVisible" ref="log"></log>
    </div>
</template>

<script>
    import AddOrUpdate from './add-or-update'
    import Log from './log'
    import {pause, resume, run} from '@/api/job/schedule'
    import {deleteList, list} from "@/api/common";

    export default {
        data() {
            return {
                dataForm: {
                    beanName: ''
                },
                dataList: [],
                pageIndex: 1,
                pageSize: 10,
                totalPage: 0,
                dataListLoading: false,
                dataListSelections: [],
                addOrUpdateVisible: false,
                logVisible: false
            }
        },
        components: {
            AddOrUpdate,
            Log
        },
        created() {
            this.getDataList()
        },
        activated(){
            this.$refs.dataTable.doLayout();
        },
        methods: {
            selectionHandle(row) {
                if (this.dataListSelections.filter(r => r == row).length == 1) {
                    this.dataListSelections.remove(row)
                } else {
                    this.dataListSelections.push(row)
                }
                this.$refs.dataTable.toggleRowSelection(row)
            },
            // 获取数据列表
            getDataList() {
                this.dataListLoading = true
                list({
                    'page': this.pageIndex,
                    'limit': this.pageSize,
                    'beanName': this.dataForm.beanName
                },'sys/schedule').then(({data}) => {
                  if (data && data.code === 200) {
                    let {list, totalCount} = data.page
                    this.dataList = list
                    this.totalPage = totalCount
                  }
                  this.dataListLoading = false
                }).catch(errMsg => {
                    this.dataList = []
                    this.totalPage = 0
                    this.dataListLoading = false
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
            // 多选
            selectionChangeHandle(val) {
                this.dataListSelections = val
            },
            // 新增 / 修改
            addOrUpdateHandle(id) {
                this.addOrUpdateVisible = true
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.init(id)
                })
            },
            // 删除
            deleteHandle(id) {
                var ids = id ? [id] : this.dataListSelections.map(item => {
                    return item.jobId
                })
                this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteList(ids,'sys/schedule').then(({data}) => {
                      if (data && data.code === 200) {
                        this.getDataList()
                        this.$message({
                          message: '操作成功',
                          type: 'success',
                          duration: 1500
                        })
                      }
                    }).catch(errMsg => this.$message.error(errMsg))
                }).catch(() => {
                })
            },
            // 暂停
            pauseHandle(id) {
                var ids = id ? [id] : this.dataListSelections.map(item => {
                    return item.jobId
                })
                this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '暂停' : '批量暂停'}]操作?`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    pause(ids).then(({data}) => {
                      if (data && data.code === 200) {
                        this.getDataList()
                        this.$message({
                          message: '操作成功',
                          type: 'success',
                          duration: 1500
                        })
                      }
                    }).catch(errMsg => this.$message.error(errMsg))
                }).catch(() => {
                })
            },
            // 恢复
            resumeHandle(id) {
                var ids = id ? [id] : this.dataListSelections.map(item => {
                    return item.jobId
                })
                this.$confirm(`${this.$t('common.containttip1')} [${id ? this.$t('common.resume') : this.$t('common.batchResume')}] [id=${ids.join(',')}]${this.$t('common.asked')}`, this.$t('common.promptTitle'), {
                    confirmButtonText: this.$t('common.sure'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning'
                }).then(() => {
                  resume(ids).then(({data}) => {
                    if (data && data.code === 200) {
                      this.getDataList()
                      this.$message({
                        message: this.$t('common.successTip'),
                        type: 'success',
                        duration: 1500
                      })
                    }
                    }).catch(errMsg => this.$message.error(errMsg))
                }).catch(() => {
                })
            },
            // 立即执行
            runHandle(id) {
                var ids = id ? [id] : this.dataListSelections.map(item => {
                    return item.jobId
                })
                this.$confirm(`${this.$t('common.containttip1')} [${id ? this.$t('common.run') : this.$t('common.batchRun')}] [id=${ids.join(',')}]${this.$t('common.asked')}`, this.$t('common.promptTitle'), {
                    confirmButtonText: this.$t('common.sure'),
                    cancelButtonText: this.$t('common.cancel'),
                    type: 'warning'
                }).then(() => {
                    run(ids).then(({data}) => {
                      if (data && data.code === 200) {
                        this.getDataList()
                        this.$message({
                          message: this.$t('common.successTip'),
                          type: 'success',
                          duration: 1500
                        })
                      }
                    }).catch(errMsg => this.$message.error(errMsg))
                }).catch(() => {
                })
            },
            // 日志列表
            logHandle() {
                this.logVisible = true
                this.$nextTick(() => {
                    this.$refs.log.init()
                })
            },
            showLog(jobId) {
                this.logVisible = true
                this.$nextTick(() => {
                    this.$refs.log.init(jobId)
                })
            },
        }
    }
</script>
