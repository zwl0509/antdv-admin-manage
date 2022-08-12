<template>
  <!-- 负责人 -->
  <a-modal 
    :visible="visible"
    :width="1200"
    title="新增负责人" 
    @ok="handleSubmit" 
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-spin :spinning="loading">
      <a-row :gutter="0">
        <a-col :span="6" style="padding-right: 12px">
          <s-tree
            ref="refTree"
            class="tree-scroll"
            :dataSource="orgTree"
            :key="treeKey"
            :openKeys.sync="openKeys"
            :search="false"
            :action="false"
            :loading="leftLoading"
            :noDataText="treeLoadText"
            show-title="title"
            @click="handleClick">
          </s-tree>
        </a-col>
        <a-col :span="18" style="padding: 10px; background-color: #f0f2f5;">
          <list-pages
            ref="listPage"
            class="small-table"
            @resetParams="resetSearchForm"
            request-type="POST"
            :columns="columns"
            :showRefresh="false"
            :request-url="requestUrl"
            :customRow="customRow"
            :query-params="queryParam"
            :scroll="{ y: 410 }"
            :rowSelection="{columnWidth: 40, type: 'radio', selectedRowKeys, onChange: onSelectChange}">
          </list-pages>
        </a-col>
      </a-row>
    </a-spin>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import STree from '@/components/MyTree'
  import ListPages from '@/components/ListPages'
  import { defaultErrorMessage} from '@/utils/common'
  import { v4 as uuid } from 'uuid'
  export default {
    name: 'ResponsibleRerson',
    components: {
      STree,
      ListPages,
    },
    data () {
      return {
        visible: false,
        loading: false,
        leftLoading: false,
        // 查询参数
        queryParam: {},
        requestUrl: this.$api.employeeManage.employeeInfo.getEasyList,
        // 表头
        columns:[
          {
            title: '序号',
            width: 60,
            scopedSlots: { customRender: 'serial' },
          },
          {
            title: '编号',
            width: 160,
            dataIndex:'employeeCode',
          },
          {
            title: '姓名',
            dataIndex:'employeeName',
            scopedSlots: {
              showSearch: {
                title: '姓名',
                type: 'input'
              }
            }
          },
          {
            title: '部门',
            dataIndex:'organizationName',
            scopedSlots: {
              // showSearch: {
              //   title: '部门',
              //   type: 'input'
              // }
            }
          },
        ],
        selectedRowKeys: [],
        selectedRows: [],
        orgTree: [],
        treeKey:'',
        openKeys: ['key-01'],
        treeLoadText: undefined,
        organizationIds: [],
        selectRadio: false,
      }
    },

    methods: {
      show (ids) {
        this.organizationIds = ids
        this.treeKey = uuid()
        this.visible = true
        this.getMenuList()
        this.$refs.listPage && this.$refs.listPage.refresh()
      },
      radio() {
        this.selectRadio = true
        this.treeKey = uuid()
        this.visible = true
        this.getMenuList()
        this.$refs.listPage && this.$refs.listPage.refresh()
      },
      resetSearchForm () {
        return { ...this.queryParam }
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      getMenuList () {
        this.leftLoading = true
        this.loading = true
        this.treeLoadText = undefined
        this.$get({
          url: this.$api.organization.getTreeList,
        }).then(res => {
          const parentMenu = []
          const data = res
          data.forEach((item) => {
            const obj = {
              id: item.id,
              parentId: 'top',
              name: item.name,
              icon: 'bars',
              code: item.code,
              key: item.type,
              expanded: true,
              children: item.children,
            }
            parentMenu.push(obj)
          })
          this.orgTree = parentMenu
        }).catch(err => { this.treeLoadText = err && err.message || '菜单树加载失败'})
          .finally(() => { this.leftLoading = false , this.loading = false })
      },
      handleClick(keys, e) {
        const id = keys[0]
        if (!id || id === 'top' || id === this.menuId) {
          return
        }
        const array = this.orgTree
        const data = this.findMenu(array, id)
        if (data) {
          this.queryParam.organizationCode = data.code
        } else {
          this.queryParam.organizationCode = null
        }
        this.$refs.listPage.refresh()
      },
      findMenu(array, key) {
        let data = null
        array.forEach((m) => {
          if (m.id === key) {
            data = m
          }
          if (!data && m.children && m.children.length) {
            const v = this.findMenu(m.children, key)
            data = v || data
          }
        })
        return data
      },
      customRow (r) {
        return {
          on: {
            click: () => {
              this.selectedRowKeys = [r.id]
              this.selectedRows = [r]
            }
          },
          class: { 'select-row': true }
        }
      },
      handleSubmit () {
        if(this.selectedRowKeys[0]) {
 
          this.selectRadio ? this.saveRadio() : this.save()
        }else {
          this.$notification.warning({
            message: labels.HINT,
            description: '请选择负责人！！！'
          })
        }
      },
      saveRadio(){
        const  params = {
          personInChargeId: this.selectedRows[0].id,
          personInChargeName: this.selectedRows[0].name
        }
        this.$emit('ok',params) 
        this.handleCancel()
      },
      save() {
        this.$post({
          url:this.$api.organization.addPersonInCharge,
          data: {
            organizationIds: this.organizationIds,
            personInChargeId: this.selectedRowKeys[0]
          }
        }).then(res=> {
          this.$emit('ok')
          this.handleCancel()
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.loading = false })
      },
      handleCancel () {
        this.visible = false
        this.selectedRowKeys = []
        this.selectedRows = []
        this.organizationIds = []
        this.queryParam = {}
        this.selectRadio = false
      }
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep .small-table {
    .ant-table-thead > tr > th {
      padding: 8px;
    }
    .ant-table-tbody > tr > td {
      padding: 8px;
    }
  }
  .tree-scroll {
    max-height: 600px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
</style>