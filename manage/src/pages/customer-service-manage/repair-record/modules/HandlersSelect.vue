<template>
  <a-modal
    :visible="visible"
    :width="800"
    title="选择关联处理人"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-spin :spinning="loading">
      <list-pages
        ref="listPage"
        class="table-style"
        @resetParams="resetSearchForm"
        request-type="POST"
        :columns="columns"
        :show-search="false"
        :show-operate-button="false"
        :request-url="requestUrl"
        :query-params="queryParam"
        :customRow="customRow"
        :bodyStyle="{padding: '0'}"
        :scroll="{ y: 410 }"
        :rowSelection="{columnWidth: 40, type: 'radio', selectedRowKeys, onChange: onSelectChange}">
      </list-pages>
    </a-spin>
  </a-modal>
</template>

<script>
  import labels from '@/utils/labels'
  import ListPages from '@/components/ListPages'
  import { defaultErrorMessage } from '@/utils/common'
  export default {
    name: 'HandlersSelect',
    components: {
      ListPages
    },
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
            dataIndex:'employeeName',
            width: 200,
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
        console.log(this.selectedRowKeys)
        this.selectedRows = selectedRows
      },

      edit (selectedIds,id) {
        this.$refs.listPage && this.refresh()
        this.visible = true
        this.customerId = id
        this.selectedRowKeys = selectedIds

        console.log(this.selectedRowKeys,selectedIds)

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
  ::v-deep .table-style {
    .ant-card-body {
      padding: 0;
    }
    .ant-table-small > .ant-table-content > .ant-table-body {
      margin: 0;
    }
  }
  ::v-deep .ant-table-small .ant-table-thead th{
    background-color: #eaeaea !important;
  }
  ::v-deep .ant-table-small{
    border: none
  }
  ::v-deep .ant-table-tbody > tr.select-row td{
    background-color: $primaryColor;
    color: white;
  }
  ::v-deep .ant-table-tbody > tr.select-row:hover td,
  ::v-deep .select-row.ant-table-row-hover td{
    background-color: $primaryColor;
    color: white;
  }
  .top-select-show{
    margin-left: -8px;
  }
  ::v-deep .table-select{
    .ant-card:nth-child(2){
      margin-top: 0 !important;
      .ant-card-body{
        padding-top: 0;
      }
    }
  }
</style>