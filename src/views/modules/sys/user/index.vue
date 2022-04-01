<template>
  <div class="warp-container">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" label-width="80px">
      <el-row>
        <el-col :span="21">
          <el-form-item prop="name" :label="$t('user.column.personnelName')">
            <el-input v-model="dataForm.name" :placeholder="$t('user.column.personnelName')"
                      clearable></el-input>
          </el-form-item>
          <el-form-item prop="account" :label="$t('user.column.personnelAccount')">
            <el-input v-model="dataForm.account" :placeholder="$t('user.column.personnelAccount')"
                      clearable></el-input>
          </el-form-item>
          <el-form-item prop="workingStatus" :label="$t('common.state')">
            <el-select v-model="dataForm.workingStatus" :placeholder="$t('common.state')"
                       clearable>
              <el-option v-for="row in queryDictionary('STATUS')" :key="row.codeValue"
                         :value="row.codeValue"
                         :label="row.codeText"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()" type="primary">
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
        <el-col :span="3" class="expandsearch">
          <el-button @click="expandSearch = !expandSearch">
            <icon-svg :name="expandSearch ? 'up' : 'down'" style="vertical-align: middle;"></icon-svg>
            <span style="vertical-align: middle;">{{ $t("common.advancedSearch") }}</span>
          </el-button>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-collapse-transition>
            <div v-show="expandSearch">
              <el-row>

              </el-row>
            </div>
          </el-collapse-transition>
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
              <span class="data_selected_operation">
                <el-button v-if="isAuth('sys:user:update')"
                           :type="dataListSelections.length != 1 ?'primary' : 'warning'"
                           plain :disabled="!showResignation() || dataListSelections.length != 1" @click="restPwd()">
                  <icon-svg name="pwd"></icon-svg> {{ $t("common.resetPassword") }}
                </el-button>
                <el-button v-if="isAuth('sys:user:update')"
                           :type="dataListSelections.length == 0 ?'primary' : 'success'"
                           plain :disabled="!showResignation()" @click="enableUser()">
                  <icon-svg name="yes"></icon-svg> {{ $t("common.enable") }}
                </el-button>
                <el-button v-if="isAuth('sys:user:update')"
                           :type="dataListSelections.length == 0 ?'primary' : 'info'"
                           plain :disabled="!showResignation()" @click="disableUser()">
                  <icon-svg name="no"></icon-svg> {{ $t("common.disable") }}
                </el-button>
                <el-button v-if="isAuth('sys:user:delete')"
                           :type="dataListSelections.length == 0 ?'primary' : 'danger'"
                           plain :disabled="dataListSelections.length == 0" @click="deleteHandle()">
                  <icon-svg name="del"></icon-svg> {{ $t("common.batchDeletion") }}
                </el-button>
                <!--<el-button v-if="isAuth('sys:user:update')"
                           :type="!showResignation() == 0 ?'primary' : 'danger'" plain
                           :disabled="!showResignation()" @click="resignation()">
                  <icon-svg name="del"></icon-svg> {{ $t("common.quit") }}
                </el-button>-->
              </span>
            </el-col>
            <el-col :span="6" style="text-align:right;" class="operate-wrap-button">
              <el-form-item>
                <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle">
                  <icon-svg name="add"></icon-svg>
                  {{ $t("common.add") }}
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button v-if="isAuth('sys:user:info')"
                           type="success" plain @click="exportUser()">
                  <i class="el-icon-download"></i>{{ $t("common.export") }}
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button v-if="isAuth('sys:user:save')" type="info" @click="getDataList()" plain>
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
              @row-dblclick="selectionHandle" style="width: 100%;">
      <el-table-column fixed="left" type="selection" header-align="center" align="center"
                       width="40"></el-table-column>
      <el-table-column fixed="left" prop="name" header-align="cenleftter" align="left" width="100"
                       :label="$t('user.column.personnelName')"></el-table-column>
      <el-table-column prop="sex" header-align="center" align="center" width="65"
                       :formatter="(r) => queryDictionaryText('SEX',r.sex)"
                       :label="$t('user.column.sex')"></el-table-column>
      <el-table-column prop="mobile" header-align="center" align="center" width="120"
                       :label="$t('user.column.tel')"></el-table-column>
      <el-table-column prop="account" header-align="left" align="left" width="120"
                       :label="$t('user.column.personnelAccount')"></el-table-column>
      <el-table-column prop="deptName" header-align="left" align="left"
                       :label="$t('user.column.deptName')"></el-table-column>
      <el-table-column prop="roleName" header-align="left" align="left" mini-width="120"
                       :label="$t('user.column.roleName')"></el-table-column>
      <el-table-column prop="workingStatus" header-align="center" align="center"
                       :label="$t('user.column.incumbency')"
                       width="110">
        <template slot-scope="scope">
          <label v-if="scope.row.workingStatus == 1" class="label work_on">{{ $t("common.yes") }}</label>
          <label v-if="scope.row.workingStatus == 0" class="label work_off">{{ $t("common.quit") }}</label>
        </template>
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" :label="$t('user.column.usability')"
                       width="100">
        <template slot-scope="scope">
          <label v-if="scope.row.status == 1" class="label account_yes">{{ $t("common.enable") }}</label>
          <label v-if="scope.row.status == 0" class="label account_off">{{ $t("common.disable") }}</label>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" header-align="center" align="center" width="180"
                       :label="$t('role.column.creationTime')">
      <el-table-column fixed="right" header-align="center" align="center" width="200"
                       :label="$t('common.operate')">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:user:update')" type="warning" size="small"
                     @click="addOrUpdateHandle(scope.row)">
            {{
              $t("common.modify")
            }}
          </el-button>
          <el-button v-if="isAuth('sys:user:delete')" type="danger" size="small"
                     @click="deleteHandle(scope.row.id)">{{
              $t("common.delete")
            }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-model="addOrUpdateVisible" ref="addOrUpdateModal"
                   @refreshDataList="getDataList()"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './add-or-update'
import {
  resignation,
  disableUser,
  enableUser,
  list,
  deleteUser,
  restPwd,
  saveUser,
} from "@/api/sys/user";
import baseMixin from '_cm/mixin/base'
import {download} from "@/api/common";

export default {
  data() {
    return {
      dataForm: {
        name: '',
        sex: '',
        mobile: '',
        account: '',
        workingStatus: '',
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      rightModalShow: false,
      expandSearch: false,
    }
  },
  components: {
    AddOrUpdate,
  },
  mixins: [baseMixin],
  methods: {
    selectionHandle(row) {
      if (this.dataListSelections.filter(r => r == row).length == 1) {
        this.dataListSelections.remove(row)
      } else {
        this.dataListSelections.push(row)
      }
      this.$refs.dataTable.toggleRowSelection(row)
    },
    //重置搜索框
    resetSearchBox() {
      this.dataForm.name = '',
          this.dataForm.account = '',
          this.dataForm.workingStatus = '',
          this.getDataList()
    },
    resignation() {
      this.$confirm(this.$t('common.quitTip'), this.$t('common.promptTitle'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        let ids = this.dataListSelections.map(row => row.id)
        resignation(ids)
            .then(() => {
              this.getDataList();
            })
            .catch(errMsg => {
              this.$message.error(errMsg)
            })
      })
    },
    showResignation() {
      if (this.dataListSelections.length > 0) {
        if (this.dataListSelections.filter(row => row.workingStatus == 0).length > 0) {
          //选中行有人离职不可以操作
          return false;
        } else {
          return true;
        }
      }
      return false;
    },
    restPwd() {
      this.$confirm(this.$t('common.restPassTip'), this.$t('common.promptTitle'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        restPwd({
          id: this.dataListSelections[0].id,
        }).then(() => {
          this.$message({
            message: this.$t('common.successTip'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(errMsg => this.$message.error(errMsg))
      }).catch(() => {
      })
    },
    disableUser() {
      let ids = this.dataListSelections.map(row => row.id)
      disableUser(ids)
          .then(() => {
            this.$message({
              message: this.$t('common.successTip'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          })
          .catch(errMsg => this.$message.error(errMsg))
    },
    enableUser() {
      let ids = this.dataListSelections.map(row => row.id)
      enableUser(ids)
          .then(() => {
            this.$message({
              message: this.$t('common.successTip'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          })
          .catch(errMsg => this.$message.error(errMsg))
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      list({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'name': this.dataForm.name,
        'sex': this.dataForm.sex,
        'mobile': this.dataForm.mobile,
        'account': this.dataForm.account,
        'workingStatus': this.dataForm.workingStatus
      }).then(({data}) => {
        if (data && data.code === 200) {
          let {list, totalCount} = data.page
          this.dataList = list
          this.totalPage = totalCount
          this.dataListLoading = false
        }
      })
    },
    // 新增 / 修改
    addOrUpdateHandle(row) {
      if (row.id) {
        this.$refs.addOrUpdateModal.loadUserDetail(row.id)
      }
      this.addOrUpdateVisible = true
    },
    //changeStatus
    changeStatus(row) {
      if (row.workingStatus == 0 || !this.isAuth('sys:user:update')) {
        return
      }
      saveUser({
        'id': row.id,
        'status': row.status == 0 ? 1 : 0,
      }).then(() => {
        row.status = row.status == 0 ? 1 : 0
      }).catch(errMsg => this.$message.error(errMsg))
    },
    // 删除
    deleteHandle(id) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(this.$t('common.delTip'), this.$t('common.promptTitle'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        deleteUser(ids).then(() => {
          this.$message({
            message: this.$t('common.successTip'),
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(errMsg => this.$message.error(errMsg))
      }).catch(() => {
      })
    },
    exportUser() {
      this.$confirm(this.$t('common.exportTip'), this.$t('common.promptTitle'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'info'
      }).then(() => {
        download({
          'name': this.dataForm.name,
          'sex': this.dataForm.sex,
          'mobile': this.dataForm.mobile,
          'account': this.dataForm.account,
          'workingStatus': this.dataForm.workingStatus
        }, "/sys/user").then(res => {
          let blob = new Blob([res.data], {type: 'application/vnd-ms.xls'})
          let url = window.URL.createObjectURL(blob)
          // 创建a标签
          const link = document.createElement('a')
          link.href = url
          // 重命名文件
          link.download = '用户数据.xlsx'
          link.click()
          URL.revokeObjectURL(url)
        }).catch(() => {
          this.$message.error("导出失败");
        });
      }).catch(() => {
      })
    }
  }
}

</script>
<style>
</style>
