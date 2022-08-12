<template>
  <a-modal
    :visible="visible"
    :width="700"
    title="选择关联处理人"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-spin :spinning="loading">
      <list-pages
        ref="listPage"
        class="small-table"
        @resetParams="resetSearchForm"
        request-type="POST"
        :columns="columns"
        :show-search="false"
        :show-operate-button="false"
        :request-url="requestUrl"
        :query-params="queryParam"
        :customRow="customRow"
        :bodyStyle="{padding: '0'}"
        :scroll="{y: 360}"
        :rowSelection="{columnWidth: 40, type: 'radio', selectedRowKeys, onChange: onSelectChange}">
        <template slot="customerName" slot-scope="text">
          <ellipsis tooltip :length="20">{{ text }}</ellipsis>
        </template>
      </list-pages>
    </a-spin>
  </a-modal>
</template>

<script>
  import ListPages from '@/components/ListPages'
  import { Ellipsis } from '@/components'
  export default {
    name: 'HandlersSelect',
    components: { ListPages , Ellipsis},
    data () {
      return {
        visible: false,
        loading: false,
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
            width: 120,
            dataIndex:'employeeCode',
          },
          {
            title: '姓名',
            dataIndex: 'employeeName',
            scopedSlots: {
              customRender: 'ellipsis',
              showSearch: {
                title: '姓名',
                type: 'input'
              }
            }
          },
          {
            title: '部门',
            width: 200,
            dataIndex:'organizationName',
            scopedSlots: {
              showSearch: {
                title: '部门',
                type: 'input'
              }
            }
          },
        ],
        selectedRowKeys:[],
        selectedRows: [],
        code:'',
        customerIds: ''
      }
    },
    methods: {
      add (id) {
        this.visible = true
        this.customerId = id
        this.$refs.listPage && this.refresh()
      },
      searchParams () {
        return { ...this.queryParam }
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },

      edit (selectedIds,id) {
        this.$refs.listPage && this.refresh()
        this.visible = true
        this.customerId = id
        this.selectedRowKeys = selectedIds

      },
      customRow (r) {
        return {
          on: {
            click: () => {
              this.selectedRowKeys = [r.id]
              this.selectedRows = [r]
            }
          },
          class: { 'select-row': false }
        }
      },
      resetSearchForm () {
        this.queryParam = {}
      },
      refresh () {
        this.$refs.listPage.refresh(true)
      },
      handleSubmit () {
        const data = {
          handlers: this.selectedRowKeys,
          handlersList: this.selectedRows
        }
        this.$emit('getHandlers',data)
        this.handleCancel()
      },
      handleCancel () {
        this.visible = false
        this.selectedRowKeys = []
        this.selectedRows = []
        this.$refs.listPage.refresh(true)
      }
    }
  }
</script>
<style lang="scss" scoped>
  ::v-deep .small-table {
    .ant-table-thead > tr > th {
      padding: 10px;
    }
    .ant-table-tbody > tr > td {
      padding: 10px;
    }
  }
</style>