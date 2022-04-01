<template>
  <div class="warp-container mod-role">
    <el-form :inline="true" :model="dataForm" ref="search_from" @keyup.enter.native="getDataList()"
             label-width="80px">
      <el-row>
        <el-col :span="21">
          <el-form-item label="租户名称">
            <el-input v-model="dataForm.name" placeholder="租户名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="租户编码">
            <el-input v-model="dataForm.code" placeholder="租户编码"
                      clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()" type="primary">
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
      <el-card :body-style="{height:'auto'}" class="operate-wrap">
        <el-row>
          <el-col :span="18">
            <div class="data_selected">
              <icon-svg name="tip"></icon-svg>
              <span class="selectOpBox">{{ $t("common.haveChosen") }}</span>
              <span class="selectOpBox_number"></span>
              <span class="selectOpBox">{{ $t("common.row") }}</span>
            </div>
            <span style="margin-left: 30px">
                            <el-button v-if="isAuth('sys:role:delete')"
                                       :type="dataListSelections.length == 0 ?'primary' : 'danger'"
                                       plain :disabled="dataListSelections.length == 0" @click="deleteHandle('','base/tenant')">
                              <icon-svg name="del"></icon-svg> {{ $t("common.delete") }}
                            </el-button>
                        </span>
          </el-col>
          <el-col :span="6" style="text-align:right;">
            <el-form-item>
              <el-button v-if="isAuth('sys:role:save')" type="primary" @click="addOrUpdateHandle()">
                <icon-svg name="add"></icon-svg>
                {{ $t("common.add") }}
              </el-button>
            </el-form-item>
            <el-form-item>
              <el-button v-if="isAuth('sys:role:save')" type="info" @click="getDataList()" plain>
                <icon-svg name="refresh"></icon-svg>
                {{ $t("common.refresh") }}
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
    <el-table ref="dataTable"  :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle"
              style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column prop="name" header-align="left" align="left" label="租户名称">
      </el-table-column>
      <el-table-column prop="code" header-align="left" align="left" label="租户编码">
      </el-table-column>
      <el-table-column prop="createTime" header-align="left" align="left" label="创建时间">
      </el-table-column>
      <el-table-column prop="updateTime" header-align="left" align="left" label="更新时间">
      </el-table-column>
      <el-table-column fixed="right" header-align="center" align="center" width="250"
                       :label="$t('common.operate')">
        <template slot-scope="scope">
          <el-button v-if="isAuth('sys:role:update')" type="warning" size="small"
                     @click="addOrUpdateHandle(scope.row)">
            {{ $t("common.modify") }}
          </el-button>
          <el-button v-if="isAuth('sys:role:delete')" type="danger" size="small"
                     @click="deleteHandle(scope.row.id,'base/tenant')">
            {{ $t("common.delete") }}
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
  </div>
</template>

<script>
import AddOrUpdate from './add-or-update'
import baseMixin from '_cm/mixin/base'

export default {
  data() {
    return {
      dataForm: {
        name: '',
        code: '',
      },
    }
  },
  mixins: [baseMixin],
  components: {
    AddOrUpdate
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.queryDataList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'name': this.dataForm.name,
        'code': this.dataForm.code
      }, 'base/tenant')
    },
  }
}
</script>
