<template>
  <a-modal
    title="回访查看"
    :visible="visible"
    :width="1200"
    :centered="true"
    :confirmLoading="confirmLoading"
    :mask-closable="false"
    @ok="handleSubmit"
    @cancel="handleCancel">
    <list-page
      ref="listPage"
      size="small"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :showSearch="false"
      :query-params="searchParams">
      <template slot="$operate">
        <a-button type="primary" icon="cloud-download" @click="exportData">导出数据</a-button>
      </template>
      <template slot="switch" slot-scope="text">
        <a-switch
          checked-children="是"
          un-checked-children="否"
          :checked="!!text" />
      </template>
      <template slot="switch" slot-scope="text">
        <span>{{ !!text? '是' : '否' }}</span>
      </template>
    </list-page>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import ListPage from '@/components/ListPage'
  import { dateFormatString } from '@/utils/common'
  export default {
    name: 'BudgetDetails',
    components: {
      ListPage,
    },
    data () {
      return {
        visible: false,
        confirmLoading: false,
        requestUrl: this.$api.mock.getListPage,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
        queryParam: {},
        id: '',
        columns: [
          {
            title: '序号',
            align: 'center',
            width: 60,
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '回访名称',
            align: 'center',
            dataIndex:'text19',
          },
          {
            title: '客户编码',
            align: 'center',
            dataIndex:'customerCode',
          },
          {
            title: '客户姓名',
            align: 'center',
            dataIndex:'customerName',
          },
          {
            title: '回访类型',
            align: 'center',
            dataIndex:'marketingType',
          },
          {
            title: '记录来源',
            align: 'center',
            dataIndex:'text13',
          },
          {
            title: '是否有照片',
            align: 'center',
            dataIndex:'boolean1',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '备注',
            align: 'center',
            dataIndex:'text',
          },
        ],
        dataList: [],
      }
    },
    methods: {
      searchParams() {
        return this.queryParam
      },
      show() {
        this.visible = true
      },
      handleSubmit() {
        this.handleCancel()
      },
      handleCancel() {
        this.visible = false
      },
      exportData() {

      },
      // 刷新
      refresh() {

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