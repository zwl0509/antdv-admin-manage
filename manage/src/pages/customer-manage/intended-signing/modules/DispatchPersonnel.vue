<template>
  <!-- 选择派工人员 -->
  <a-modal 
    :visible="visible"
    :width="1200"
    :title="modal_title" 
    @ok="handleSubmit" 
    @cancel="handleCancel"
    :centered="true"
    :mask-closable="false"
    :confirmLoading="loading">
    <a-spin :spinning="loading">
      <list-page
        ref="listPage"
        size="small"
        class="table-style"
        @resetParams="resetSearchForm"
        :showOperateButton="false"
        request-type="POST"
        :columns="columns"
        :request-url="requestUrl"
        :query-params="searchParams"
        :customRow="customRow"
        :bodyStyle="{padding: '0'}"
        :rowSelection="{columnWidth: 40, type: 'radio', selectedRowKeys, onChange: onSelectChange}">
        <template slot="$search">
          <a-col :md="6" :sm="24">
            <a-form-item label="编号">
              <a-input
                v-model="queryParam.employeeCode"
                autocomplete="off"
                placeholder="请输入编号"
                :max-length="30"
              />
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="姓名">
              <a-input
                v-model="queryParam.employeeName"
                autocomplete="off"
                placeholder="请输入姓名"
                :max-length="30"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="部门">
              <a-input
                v-model="queryParam.organizationName"
                autocomplete="off"
                placeholder="请输入部门"
                :max-length="30"/>
            </a-form-item>
          </a-col>
        </template>
      </list-page>
    </a-spin>
  </a-modal>
</template>

<script>
  import ListPage from '@/components/ListPage'
  export default {
    name: 'DispatchPersonnel',
    components: {
      ListPage
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
            scopedSlots: { customRender: 'employeeName' },
          },
          {
            title: '部门',
            dataIndex:'organizationName',
            scopedSlots: { customRender: 'organizationName' },
          },
        ],
        selectedRowKeys:[],
        selectedRows: [],
        modal_title: '',
        positionIds: []
      }
    },

    methods: {
      show (title,positionIds) {
        this.modal_title = title
        this.positionIds = positionIds
        this.queryParam.positionIds = positionIds
        this.visible = true
        this.$refs.listPage && this.refresh()
      },
      searchParams () {
        return { ...this.queryParam }
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
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
        this.queryParam = {
          positionIds: this.positionIds
        }
      },
      refresh () {
        this.$refs.listPage.refresh(true)
      },
      handleSubmit () {
        const values = {
          employeeId: this.selectedRows[0].id,
          employeeName: this.selectedRows[0].name,
        }
        this.$emit('ok',values)
        this.handleCancel()
      },
      handleCancel () {
        this.visible = false
        this.selectedRowKeys = []
        this.selectedRows = []
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