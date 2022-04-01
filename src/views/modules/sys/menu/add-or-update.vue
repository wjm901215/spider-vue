<template>
  <el-dialog
      :title="!dataForm.id ? '新增' : '修改'"
      :close-on-click-modal="false"
      :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()"
             label-width="80px">
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="dataForm.type">
          <el-radio v-for="(type, index) in dataForm.typeList" :label="index" :key="index">{{ type }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.type] + '名称'" prop="name">
        <el-input v-model="dataForm.name" :placeholder="dataForm.typeList[dataForm.type] + '名称'"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单" prop="parentName">
        <el-popover
            ref="menuListPopover"
            placement="bottom-start"
            trigger="click">
          <div class="menu-list">
            <el-tree
                :data="menuList"
                :props="menuListTreeProps"
                node-key="menuId"
                ref="menuListTree"
                @current-change="menuListTreeCurrentChangeHandle"
                :default-expand-all="true"
                :highlight-current="true"
                :expand-on-click-node="false">
            </el-tree>
          </div>
        </el-popover>
        <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true"
                  placeholder="点击选择上级菜单"
                  class="menu-list__input"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 1" label="菜单路由" prop="url">
        <el-input v-model="dataForm.url" placeholder="菜单路由"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 0" label="授权标识" prop="perms">
        <el-input v-model="dataForm.perms" placeholder="多个用逗号分隔, 如: user:list,user:create"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" label="排序号" prop="orderNum">
        <el-input-number v-model="dataForm.orderNum" controls-position="right" :min="0"
                         label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2" label="菜单图标" prop="icon">
        <el-row>
          <el-col :span="22">
            <el-popover
                ref="iconListPopover"
                placement="bottom-start"
                trigger="click"
                popper-class="mod-menu__icon-popover">
              <div class="mod-menu__icon-list">
                <el-button
                    v-for="(item, index) in iconList"
                    :key="index"
                    @click="iconActiveHandle(item)"
                    :class="{ 'is-active': item === dataForm.icon }">
                  <icon-svg :name="item"></icon-svg>
                </el-button>
              </div>
            </el-popover>
            <el-input v-model="dataForm.icon" v-popover:iconListPopover :readonly="true"
                      placeholder="菜单图标名称"
                      class="icon-list__input"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :loading="submitting">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {treeDataTranslate} from '@/utils'
import Icon from '@/assets/icons'
import {select, saveOrUpdate, info} from "@/api/sys/menu";

export default {
  data() {
    var validateUrl = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      submitting: false,
      dataForm: {
        id: 0,
        type: 1,
        typeList: ['目录', '菜单', '按钮'],
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        perms: '',
        orderNum: 0,
        icon: '',
        iconList: []
      },
      iconList: [],
      dataRule: {
        name: [
          {required: true, message: '菜单名称不能为空', trigger: 'blur'}
        ],
        parentName: [
          {required: true, message: '上级菜单不能为空', trigger: 'change'}
        ],
        url: [
          {validator: validateUrl, trigger: 'blur'}
        ]
      },
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created() {
    this.iconList = Icon.getNameList()
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      select().then(({data}) => {
        if (data && data.code === 200) {
          let menuList = data.menuList
          this.menuList = treeDataTranslate(menuList, 'menuId')
        }
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }).then(() => {
        if (!this.dataForm.id) {
          // 新增
          this.menuListTreeSetCurrentNode()
        } else {
          // 修改
          info(this.dataForm.id).then(({data}) => {
            let {menuId, type, name, parentId, url, perms, orderNum, icon} = data.menu
            this.dataForm.id = menuId
            this.dataForm.type = type
            this.dataForm.name = name
            this.dataForm.parentId = parentId
            this.dataForm.url = url
            this.dataForm.perms = perms
            this.dataForm.orderNum = orderNum
            this.dataForm.icon = icon
            this.menuListTreeSetCurrentNode()
          })
        }
      })
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle(data, node) {
      this.dataForm.parentId = data.menuId
      this.dataForm.parentName = data.name
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode() {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['name']
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName
    },
    // 表单提交
    dataFormSubmit() {
      this.submitting = true
      let method = this.dataForm.id ? 'UPDATE' : 'ADD'
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveOrUpdate({
            'menuId': this.dataForm.id || undefined,
            'type': this.dataForm.type,
            'name': this.dataForm.name,
            'parentId': this.dataForm.parentId,
            'url': this.dataForm.url,
            'perms': this.dataForm.perms,
            'orderNum': this.dataForm.orderNum,
            'icon': this.dataForm.icon
          }).then(({data}) => {
            if (data && data.code === 200) {
              let row = data.row
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.submitting = false
                  this.visible = false
                  this.$emit('refreshDataList', {row, method})
                }
              })
            }else{
              this.$message.error(data.msg)
              this.submitting = false
            }

          }).catch(errMsg => {
            this.$message.error(errMsg)
            this.submitting = false
          })
        }else{
          this.submitting = false
        }
      })
    }
  }
}
</script>
<style lang="less">
.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }

  &__icon-popover {
    max-width: 370px;
  }

  &__icon-list {
    /*max-height: 250px;*/
    padding: 0;
    margin: -8px 0 0 -8px;

    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;

      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }

  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
}

.menu-list {
  height: 500px;
  overflow-x: hidden;
  overflow-y: auto;
}
</style>
