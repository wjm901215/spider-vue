<template>
  <Modal id="modal_compontent" v-model="modal_state_in" :title="title" :mask-closable="false">
    <Button @click="downloadTemplate" v-if="isDownload == false">下载模版</Button>
    <Button @click="chooseFile">选择文件</Button>
    {{fileName}}
    <input type="file" ref="fileInput" v-on:change="on_file_change" v-show="false"/>
    <div slot="footer">
      <Button type="text" @click="cancel">取消</Button>
      <Button type="primary" @click="submit_form" v-if="submit_button_state">提交</Button>
    </div>
  </Modal>
</template>
<script>
  import {excel2Data} from "@/utils";
  import {exportExcel} from "@/utils";

  export default {
    props: {
      value: Boolean,
      heads: Array,
      dataList_callback: Function,
      on_submit: Function,
      modal_title: String,
      isDownload: Boolean,
    },
    data() {
      return {
        title: "导入",
        submit_button_state: false,
        fileName: "",
        modal_state_in: this.value,
        file: null
      }
    },
    created() {


    },
    watch: {
      value(newVal, oldVal) {
        this.modal_state_in = newVal;
      },
      modal_state_in(newVal, oldVal) {
        this.$emit("input", newVal);
        if(!newVal){
          this.file = null;
          this.submit_button_state = false;
          this.fileName = null;
        }
      },
    },
    methods: {
      downloadTemplate() {
        exportExcel(this.heads, [], [], this.title + "模版")
      },
      chooseFile() {
        this.$refs.fileInput.click();
      },
      on_file_change(e) {
        if (e.target.files.length == 1) {
          this.submit_button_state = true;
          this.fileName = e.target.files[0].name;
          this.file = e.target.files[0];
        }
      },
      submit_form() {
        excel2Data(this.file, this.dataList_callback);
      },
      cancel() {
        this.modal_state_in = false;
      }
    }
  }
</script>
<style>
  #modal_compontent .ivu-modal-body {
    text-align: center !important;
  }
</style>

