<template>
  <el-dialog :title="$t('common.modify')" :close-on-click-modal="false" :visible.sync="visible">
    <div>
      <el-table :data="trans" v-loading="loading">
        <el-table-column :label="$t('common.language')" prop="langName">
        </el-table-column>
        <el-table-column :label="$t('common.translate')" prop="translation">
          <template slot-scope="scope">
            <el-input size="small" v-model="scope.row.translation" :placeholder="$t('common.translate')"></el-input>
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.operate')" align="center" header-align='center'>
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="save(scope.row)" :disabled="!scope.row.translation">{{
              $t('common.save') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
          <el-button @click="visible = false">{{ $t('common.close') }}</el-button>
        </span>
  </el-dialog>
</template>

<script>
import  {adornData} from "@/utils/httpRequest"
  export default {
    props: {
      extType: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        visible: false,
        extId: '',
        trans: [],
        loading: false
      }
    },
    methods: {
      save(row) {
        this.loading = true;
        this.$http({
          url: `/sys/trans/${!row.id ? 'save' : 'update'}`,
          method: 'post',
          data: adornData({
            'id': row.id || undefined,
            'lang': row.lang,
            'translation': row.translation,
            'extId': this.extId,
            'extType': this.extType,
          })
        }).then(({data}) => {
          if (data && data.code == 200) {
            row.id = data.data
            this.$message({
              message: this.$t("common.successTip"),
              type: 'success',
              duration: 1500,
            })
          } else {
            this.$message.error(data.msg)
          }
          this.loading = false;
        })
      },
      loadTranslations() {
        this.$http({
          url: '/sys/trans/queryTranslateById',
          method: "post",
          data: adornData(this.extId, false)
        }).then(({
                   data
                 }) => {
          this.trans = data.data
        })
      },
      init(extId) {
        this.extId = extId;
        this.loadTranslations();
        this.visible = true;
      }
    }
  }
</script>
