<template>
    <el-cascader v-model="selected" :options="options" :show-all-levels="false" :placeholder="placeholder"
                 :props="{value:vKey,label:'name'}"
                 style="width:100%;" @change="value_change" :change-on-select="changeOnSelect" clearable></el-cascader>
</template>

<script>
    import {cascaderDataTranslate, recursiveUpFindId} from '@/utils'
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
            vKey: {
                type: String,
                default: 'id'
            },
            translateKey: {
                type: String,
                default: 'id'
            },
            changeOnSelect: {
                type: Boolean,
                default: true
            },
            equalLevel: {
                type: String,
                default: ''
            }
        },
        watch: {
            value(val) {
                if (val) {
                    this.selectOption()
                } else {
                    this.selected = []
                }
            }
        },
        data() {
            return {
                options: [],
                selected: [],
                data_rsp: []
            }
        },
        mounted() {
            this.queryCascadeListAction().then(data => {
                this.data_rsp = data
                this.options = cascaderDataTranslate(data)
                this.selectOption()
            })
        },
        methods: {
            ...mapActions({
                queryCascadeListAction: 'sys/area/queryCascadeList'
            }),
            value_change(val) {
                if (val[val.length - 1] == this.value) {
                    return
                }
                this.$emit('input', val[val.length - 1])
                this.$emit('change', this.data_rsp.filter(r => r[this.vKey] == val[val.length - 1])[0])
            },
            selectOption() {
                if (this.value) {
                    this.selected = recursiveUpFindId(
                        this.data_rsp,
                        this.value,
                        this.vKey,
                        false
                    )
                }
            }
        }
    }

</script>
