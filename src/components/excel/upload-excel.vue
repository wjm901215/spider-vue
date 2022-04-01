<template>
  <el-dialog id="modal_compontent" :visible.sync="show" :title="title ? title : '导入'">
    <el-button type="primary" @click="downloadTemplate" v-if="hasTemplate">下载模版</el-button>
    <el-upload action="none" :on-change="handleChange" ref="uploadSelector" style="display:inline;margin-left:15px;"
               :file-list="files" :auto-upload="false">
      <el-button type="success">点击上传</el-button>
    </el-upload>
    <el-table style="margin-top: 20px" :data="cols" border v-if="hasDetail">
      <el-table-column prop="label" align="left" min-width="100" label="列名">
      </el-table-column>
      <el-table-column prop="example" align="left" min-width="100" label="示例">
      </el-table-column>
      <el-table-column prop="desc" align="left" min-width="100" label="含义">
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button type="info" @click="cancel">取消</el-button>
      <el-button type="primary" @click="_import" v-if="files.length > 0">{{ $t('common.import') }}</el-button>
    </div>
  </el-dialog>
</template>
<script>
import {
  clone,
  exportExcel
} from "@/utils";
import {importExcel} from "@/api/common";
import {showFullScreenLoading, hideFullScreenLoading} from "@/utils/loading";

export default {
  props: {
    cols: Array,
    getData: Function,
    templateName: String,
    hasTemplate: {
      type: Boolean,
      default: true,
    },
    hasDetail: {
      type: Boolean,
      default: true,
    },
    title: String,
  },
  data() {
    return {
      files: [],
      show: false,
      file: null,
      fileName: '',
      namespace: '',
    }
  },
  methods: {
    open(namespace) {
      this.files = []
      this.show = true;
      this.namespace = namespace;
    },
    close() {
      this.show = false;
    },
    downloadTemplate() {
      exportExcel(this.cols.map(c => c.label), [], [], this.templateName)
    },
    /**
     * 导入操作
     * @private
     */
    _import() {
      showFullScreenLoading("modal_compontent", '努力导入中...')
      this.file = this.files[0].raw
      importExcel(this.file, this.namespace).then(({data}) => {
        if (data && data.code === 200) {
          //判断后台是否返回result
          if (data.result && data.result.listNotValid) {
            let listNotValid = data.result.listNotValid
            let successCount = data.result.successCount
            if(listNotValid.length > 0){
              let colsTmp = clone(this.cols)
              colsTmp.push({
                key: 'errorMsg',
                label: '失败原因',
              })
              exportExcel(colsTmp.map(c => c.label), colsTmp.map(c => c.key), listNotValid, '失败列表')
            }
            this.$message.success(`导入成功,成功${successCount}条,失败：${listNotValid.length}条`)
          } else {
            this.$message.success("导入成功")
          }
          this.cancel()
          if (this.getData) {
            this.getData()
          }
        } else {
          this.$message.error(data.msg)
        }
        hideFullScreenLoading()
      }).catch(errMsg => {
        hideFullScreenLoading()
        this.$message.error(errMsg)
      })
    },
    handleChange(file, fileList) {
      this.files = fileList.splice(-1)
      console.log(this.files)
    },
    cancel() {
      this.files = []
      this.show = false;
    }
  }
}

</script>
<style>
#modal_compontent .el-dialog__body {
  text-align: center !important;
}

</style>
