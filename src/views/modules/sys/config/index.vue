<template>
  <div class="warp-container mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" label-width="80px">
      <el-row>
        <el-col :span="21">
          <el-form-item :label="$t('config.column.configName')">
            <el-input v-model="dataForm.paramKey" :placeholder="$t('config.column.configName')"
                      clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="pageIndex = 1;getDataList()" type="primary">
              <icon-svg name="search"></icon-svg>
              {{ $t("common.search") }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="resetSearchBox()" type="info">
              <icon-svg name="reset"></icon-svg>
              {{ $t("common.reset") }}
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-collapse-transition>
        <el-card :body-style="{height:'auto'}"  class="operate-wrap">
          <el-row>
            <el-col :span="18">
              <div class="data_selected">
                <icon-svg name="tip"></icon-svg>
                <span class="selectOpBox">{{ $t("common.haveChosen") }}</span>
                <span class="selectOpBox_number">{{ dataListSelections.length }}</span>
                <span class="selectOpBox">{{ $t("common.row") }}</span>
              </div>
              <span style="margin-left: 30px">
                <el-button :type="dataListSelections.length == 0 ?'primary' : 'danger'" plain
                           :disabled="dataListSelections.length == 0"
                           @click="deleteHandle()">
                  <icon-svg name="del"></icon-svg> {{ $t("common.batchDeletion") }}
                </el-button>
              </span>
            </el-col>
            <el-col :span="6" style="text-align:right;">
              <el-form-item>
                <el-button type="primary" @click="addOrUpdateHandle()">
                  <icon-svg name="add"></icon-svg>
                  {{ $t("common.add") }}
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="success" icon="el-icon-upload2" @click="importHandle()">
                  {{ $t("common.import") }}
                </el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="info" @click="getDataList()" plain>
                  <icon-svg name="refresh"></icon-svg>
                  {{ $t("common.refresh") }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-collapse-transition>
    </el-form>
    <el-table ref="dataTable"  :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle"
              style="width: 100%;">
      <el-table-column fixed="left" type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column fixed="left" prop="paramKey" header-align="left" align="left" width="100"
                       :label="$t('config.column.configName')" :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column prop="type" header-align="left" align="left" width="100"
                       :label="$t('config.column.configType')"
                       :formatter="(row) => queryDictionaryText('CONFIG_TYPE',row.type)">
      </el-table-column>
      <el-table-column prop="tenantName" header-align="left" align="left" width="100"
                       :label="$t('config.column.tenant')" :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column prop="paramValue" header-align="left" align="left" min-width="300"
                       :label="$t('config.column.configValue')" :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column prop="remark" header-align="left" align="left" min-width="100" :label="$t('common.remark')"
                       :show-overflow-tooltip='true'>
      </el-table-column>
      <el-table-column prop="isCommon" header-align="center" align="center" min-width="80"
                       :label="$t('config.column.currency')">
        <template slot-scope="scope">
          <label v-if="scope.row.isCommon == true" class="label work_on"> {{ $t("common.yes") }}</label>
          <label v-if="scope.row.isCommon == false" class="label work_off"> {{ $t("common.not") }}</label>
        </template>
      </el-table-column>
      <el-table-column prop="status" header-align="center" align="center" min-width="80"
                       :label="$t('common.state')">
        <template slot-scope="scope">
          <label v-if="scope.row.status == 1" class="label account_yes"> {{ $t("common.enable") }}</label>
          <label v-if="scope.row.status == 0" class="label account_off"> {{ $t("common.disable") }}</label>
        </template>
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="240"
                       :label="$t('common.operate')">
        <template slot-scope="scope">
          <el-button type="warning" size="small" @click="addOrUpdateHandle(scope.row.id)"> {{
              $t("common.modify")
            }}
          </el-button>
          <el-button v-show="scope.row.status == 0" v-if="isAuth('sys:roadsection:update')" type="info"
                     size="small"
                     @click="changeStatus(scope.row)">
            {{ $t("common.enable") }}
          </el-button>
          <el-button v-show="scope.row.status == 1" v-if="isAuth('sys:roadsection:update')" type="success"
                     size="small"
                     @click="changeStatus(scope.row)">
            {{ $t("common.disable") }}
          </el-button>
          <el-button type="danger" size="small" @click="deleteHandle(scope.row.id)"> {{ $t("common.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage"
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-model="showMoal" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

    <upload-excel ref="importExcel" :cols="excelCols" :getData="getDataList" templateName="参数管理模版" title="参数管理导入"></upload-excel>
  </div>
</template>

<script>
import AddOrUpdate from './add-or-update'
import {list, deleteList, saveOrUpdate} from "@/api/common"

import uploadExcel from '@/components/excel/upload-excel'

export default {
  data() {
    return {
      dataForm: {
        paramKey: ''
      },
      namespace:'sys/config',
      showMoal: false,
      dataList: [],
      excelCols:[{
        //需和后台保持一致
        key:"paramKey",
        label:'参数名称',
        example:'TEST',
        desc:'参数名称'
      },{
        key:"type",
        label:'类型',
        example:'1',
        desc:'类型（1APP、2后台）'
      },{
        key:"paramValue",
        label:'参数值',
        example:'{"test":"123"}',
        desc:'参数值'
      },{
        key:"remark",
        label:'备注信息',
        example:'测试',
        desc:'备注信息'
      }],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate,
    uploadExcel
  },
  created() {
    this.getDataList()
  },
  activated(){
    this.$refs.dataTable.doLayout();
  },
  methods: {
    //重置搜索框
    resetSearchBox() {
      this.dataForm.paramKey = ''
      this.getDataList()
    },
    changeStatus(row) {
      this.dataListLoading = true
      saveOrUpdate({
        'id': row.id,
        'status': row.status == '1' ? '0' : '1'
      }, this.namespace).then(({data}) => {
        if (data && data.code === 200) {
          row.status = row.status == '1' ? '0' : '1';
        }
        this.dataListLoading = false
      }).catch(errMsg => {
        this.$message.error(errMsg);
        this.dataListLoading = false
      })
    },
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      list({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'paramKey': this.dataForm.paramKey
      },this.namespace).then(({data}) => {
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
      this.showMoal = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    importHandle(){
      this.$nextTick(() => {
        this.$refs.importExcel.open(this.namespace)
      })
    },
    // 删除
    deleteHandle(id) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`${this.$t('common.sureDelete')} ${ids.join(',')} ${this.$t('common.asked')}`, this.$t('common.promptTitle'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        deleteList(ids,this.namespace).then(({data}) => {
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
