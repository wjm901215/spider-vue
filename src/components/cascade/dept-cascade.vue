<template>
  <el-cascader v-model="selected" :options="options" :show-all-levels="false" :placeholder="placeholder" :props="{value:'id',label:'name',expandTrigger: 'hover', checkStrictly: true}"
    style="width:100%;" @change="value_change"  clearable></el-cascader>
</template>

<script>
  import {
    cascaderDataTranslate,
    recursiveUpFindId,
    clone
  } from "@/utils";
  import {mapActions} from 'vuex'
  export default {
    props: {
      placeholder: {
        required: false,
        type: String
      },
      value: {
        required: false,
        type: String
      },
      filter: {
        required: false,
        type: Boolean,
        default: false,
      },
      tanandIds: {
        required: false,
        type: Array,
      }
    },
    watch: {
      value(val) {
        if (val) {
          this.selectOption()
        } else {
          this.selected = []
        }
      },
      tanandIds(val) {
        if (val && this.filter && val.length > 0) {
          let newDeptList = clone(this.deptListBak)
          let newList = newDeptList.filter(r => val.filter(t => r.tenantId == t).length > 0)
          this.options = cascaderDataTranslate(newList)
          this.selectOption()
        }

      },
    },
    data() {
      return {
        options: [],
        selected: [],
        data_rsp: [],
        deptListBak: [],
      };
    },
    created() {
      this.queryCascadeListAction().then(data => {
        this.data_rsp = data
        this.deptListBak = clone(data);
        this.options = cascaderDataTranslate(data)
        this.selectOption()
      })
    },
    methods: {
      ...mapActions({
        queryCascadeListAction: 'sys/dept/queryCascadeList'
      }),
      value_change(val) {
        if (val[val.length - 1] == this.value) {
          return;
        }
        this.$emit("input", val[val.length - 1]);
      },
      selectOption() {
        if (this.value) {
          this.selected = recursiveUpFindId(
            this.data_rsp,
            this.value,
            "id",
            false
          );
        }
      }
    }
  };

</script>

<style>
</style>
