import {list,deleteList} from "@/api/common"
export default {
    data() {
        return {
            showMoal: false,
            expandSearch: false,
            dataList: [],
            pageIndex: 1,
            pageSize: 10,
            totalPage: 0,
            dataListLoading: false,
            dataListSelections: [],
            addOrUpdateVisible: false,
            needQuery: true
        }
    },
    created() {
        if (this.needQuery) {
            this.getDataList()
        }
    },
    activated(){
        if(this.$refs.dataTable){
            this.$refs.dataTable.doLayout();
        }
    },
    methods: {
        //重置搜索框
        resetSearchBox() {
            this.$refs.search_from.resetFields()
            this.getDataList()
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
        addOrUpdateHandle(row) {
            this.showMoal = true
            if (row) {
                this.$nextTick(() => {
                    this.$refs.addOrUpdate.init(row)
                })
            }
        },
        /**
         * 获取数据列表
         * @param params 请求参数
         * @param namespace 模块名称，只有调用base的时候才需要传
         */
        queryDataList(params,namespace) {
            this.dataListLoading = true
            list(params,namespace).then(({data}) => {
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
                this.$message.error(errMsg)
            })
        },
        /**
         * 删除
         * @param id ID集合
         * @param namespace 模块名称，只有调用base的时候才需要传
         */
        deleteHandle(id,namespace) {
            let ids = id ? [id] : this.dataListSelections.map(item => {
                return item.id
            })
            this.$confirm(this.$t('common.delTip'), this.$t('common.promptTitle'), {
                confirmButtonText: this.$t('common.sure'),
                cancelButtonText: this.$t('common.cancel'),
                type: 'warning'
            }).then(() => {
                deleteList(ids,namespace).then(({data}) => {
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
        },
        //查看
        infoHandle(row) {
            this.showMoal = true
            this.$nextTick(() => {
                this.$refs.info.initInfo(row)
            })
        },
    }
}
