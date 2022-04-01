<template>
  <div class="mod-menu">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button v-if="isAuth('sys:user:save')" type="primary" @click="addOrUpdateHandle()">
          <icon-svg name="add"></icon-svg>
          {{ $t("common.add") }}
        </el-button>
      </el-form-item>
    </el-form>
    <el-table ref="dataTable" :data="dataList" border style="width: 100%;" :tree-props="{children: 'children'}"
              row-key="menuId">
      <el-table-column prop="name" header-align="left" min-width="100"
                       :label="$t('menu.column.menuName')">
      </el-table-column>
      <el-table-column prop="parentName" header-align="left" align="left" width="150"
                       :label="$t('menu.column.superiorMenu')">
      </el-table-column>
      <el-table-column header-align="center" align="center" width="80" :label="$t('menu.column.icon')">
        <template slot-scope="scope">
          <icon-svg :name="scope.row.icon || ''"></icon-svg>
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" width="100"
                       :label="$t('menu.column.type')">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type === 0" size="small">{{ $t("menu.column.directory") }}</el-tag>
          <el-tag v-else-if="scope.row.type === 1" size="small" type="success">{{ $t("menu.column.menu") }}
          </el-tag>
          <el-tag v-else-if="scope.row.type === 2" size="small" type="info">{{ $t("menu.column.button") }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" header-align="center" align="center" width="80"
                       :label="$t('common.orderNum')">
      </el-table-column>
      <el-table-column prop="url" header-align="left" align="left" :show-overflow-tooltip="true"
                       :label="$t('menu.column.menuURL')">
      </el-table-column>
      <el-table-column prop="perms" header-align="left" align="left" mini-width="250" :show-overflow-tooltip="true"
                       :label="$t('menu.column.authorizationID')">
      </el-table-column>
      <el-table-column header-align="center" align="center" width="200"
                       :label="$t('common.operate')">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:user:update')" type="warning" size="small"
                     @click="addOrUpdateHandle(scope,scope.row.menuId)">{{ $t("common.modify") }}
          </el-button>
         <!-- <el-button v-if="isAuth('sys:user:update')" type="primary" size="small"
                     @click="editLangHandle(scope.row.menuId)">{{ $t("menu.column.languages") }}
          </el-button>-->
          <el-button v-if="isAuth('sys:user:delete')" type="danger" size="small"
                     @click="deleteHandle(scope.row.menuId)">{{ $t("common.delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="updateDataList"></add-or-update>
    <LangSet :ext-type="1" v-if="langSetVisible" ref="langSet"></LangSet>
  </div>
</template>

<script>
import LangSet from '_cm/lang-set'
import AddOrUpdate from './add-or-update'
import {treeDataTranslate, queryFromTreeData} from '@/utils'
import {menuList, deleteOne} from "@/api/sys/menu";

export default {
  data() {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      langSetVisible: false,
      currentDragDom: {}
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
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      menuList().then(({data}) => {
        this.dataList = treeDataTranslate(data, 'menuId')
        this.dataListLoading = false
      })
    },
    updateDataList({row, method, id}) {
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle(scope, id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 编辑多语言Handle
    editLangHandle(extId) {
      this.langSetVisible = true
      this.$nextTick(() => {
        this.$refs.langSet.init(extId)
      })
    },
    // 删除
    deleteHandle(id) {
      this.$confirm(`${this.$t('common.sureDelete')} [id=${id}]?`, this.$t('common.promptTitle'), {
        confirmButtonText: this.$t('common.sure'),
        cancelButtonText: this.$t('common.cancel'),
        type: 'warning'
      }).then(() => {
        deleteOne(id).then(({data}) => {
          if (data && data.code === 200) {
            this.$message({
              message: this.$t('common.successTip'),
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.updateDataList({
                  row: this.dataList.filter(r => r.menuId == id)[0],
                  id,
                  method: 'DELETE'
                })
              }
            })
          }else{
            this.$message.error(data.msg)
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
