<template>
  <div class="warp-container">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()" label-width="80px"
             ref="searchForm">
      <el-row>
        <el-col :span="21">
          <el-form-item prop="name" :label="$t('dept.column.deptName')">
            <el-input v-model="dataForm.name" :placeholder="$t('dept.column.deptName')"
                      clearable></el-input>
          </el-form-item>
          <el-form-item prop="code" :label="$t('dept.column.code')">
            <el-input v-model="dataForm.code" :placeholder="$t('dept.column.code')" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="pageIndex = 1;getDataList()" type="primary">
              <icon-svg name="search"></icon-svg>
              {{ $t("common.search") }}
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button @click="restForm()" type="info">
              <icon-svg name="reset"></icon-svg>
              {{ $t("common.reset") }}
            </el-button>
          </el-form-item>
        </el-col>
        <el-col :span="3" class="expandsearch">
        </el-col>
      </el-row>
      <el-collapse-transition>
        <el-card :body-style="{height:'auto'}" class="operate-wrap">
          <el-row>
            <el-col :span="18">
              <div class="data_selected">
                <icon-svg name="tip"></icon-svg>
                <span class="selectOpBox">{{ $t("common.haveChosen") }}</span>
                <span class="selectOpBox_number">{{ dataListSelections[0] ? dataListSelections[0].name : '' }}</span>
              </div>
            </el-col>
            <el-col :span="6" style="text-align:right;">
              <el-form-item>
                <el-button v-if="isAuth('sys:dept:save')" type="primary" @click="addHandle()">
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
              @selection-change="selectionChangeHandle" @row-click="selectionHandle" style="width: 100%;"
              :row-style="selectStyle">
      <table-tree-column prop="name" :show-overflow-tooltip="true" header-align="left" treeKey="id"
                         min-width="200" :label="$t('dept.column.deptName')"></table-tree-column>
      <el-table-column prop="shortName" header-align="left" align="left" min-width="120"
                       :label="$t('dept.column.shortName')"></el-table-column>
      <el-table-column prop="code" :show-overflow-tooltip="true" header-align="center" align="center"
                       min-width="120" :label="$t('dept.column.code')"></el-table-column>
      <el-table-column prop="orderNum" header-align="center" align="center" min-width="70"
                       :label="$t('common.orderNum')"></el-table-column>
      <el-table-column prop="longitudeGaode" header-align="center" align="center" min-width="150"
                       :label="$t('common.longitudeGaode')"></el-table-column>
      <el-table-column prop="latitudeGaode" header-align="center" align="center" min-width="150"
                       :label="$t('common.latitudeGaode')"></el-table-column>
      <el-table-column prop="remark" header-align="left" align="left"
                       :label="$t('common.remark')"></el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" min-width="200"
                       :label="$t('common.operate')">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:dept:update')" type="warning" size="small"
                     @click="addOrUpdateHandle(scope.row)">{{ $t("common.modify") }}
          </el-button>
          <el-button v-if="isAuth('sys:dept:delete')" type="danger" size="small"
                     @click="deleteHandle(scope.row.id)">{{ $t("common.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-model="addOrUpdateVisible" ref="addOrUpdateModal" @refresh="getDataList"></add-or-update>
  </div>
</template>

<script>
import TableTreeColumn from "@/components/table-tree-column"
import AddOrUpdate from "./add-or-update"
import {treeDataTranslate} from "@/utils"
import {list, deleteList} from "@/api/common";

export default {
  data() {
    return {
      dataForm: {
        demo: ""
      },
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      rightModalShow: true,
      expandSearch: false
    };
  },
  components: {
    AddOrUpdate,
    TableTreeColumn
  },
  created() {
    this.getDataList();
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
      this.dataListLoading = true;
      list({
        name: this.dataForm.name,
        code: this.dataForm.code,
      },'/sys/dept').then(({data}) => {
        let list = data.page.list
        this.dataList = treeDataTranslate(list);
        this.dataListLoading = false;
      }).catch(errMsg => {
        this.dataList = [];
        this.dataListLoading = false;
      })
    },
    //更高选中行的样式
    selectStyle(obj) {
      if (this.dataListSelections.filter(r => r.id == obj.row.id).length > 0) {
        return {
          "background-color": "#f2f2f2"
        };
      }
    },
    restForm() {
      this.$refs.searchForm.resetFields();
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // 新增
    addHandle() {
      let parentId = this.dataListSelections[0] ? this.dataListSelections[0].id : '-1'
      let parentName = this.dataListSelections[0] ? this.dataListSelections[0].name : ''
      let level = this.dataListSelections[0] ? this.dataListSelections[0].level : 0
      this.$refs.addOrUpdateModal.initAdd(parentId, parentName, level);
      this.addOrUpdateVisible = true;
    },
    // 修改
    addOrUpdateHandle(row) {
      if (row) {
        this.$refs.addOrUpdateModal.initUpdate(row);
      }
      this.addOrUpdateVisible = true;
    },
    // 删除
    deleteHandle(id) {
      let ids = [];
      ids.push(id);
      this.$confirm(this.$t('common.delTip'), this.$t('common.promptTitle'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancel'),
        type: "warning"
      }).then(() => {
            deleteList(ids,'/sys/dept')
                .then(({data}) => {
                  if (data && data.code === 200) {
                    this.$message({
                      message: this.$t('common.successTip'),
                      type: "success",
                      duration: 1500,
                      onClose: () => {
                        this.getDataList();
                      }
                    })
                  }
                }).catch(errMsg => this.$message.error(errMsg))
          }
      )
    }
  }
}
</script>
<style>
</style>
