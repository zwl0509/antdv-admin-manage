<template>
  <a-modal 
    title="预算明细查看"
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
      :query-params="searchParams"
      :scroll="{ x: 2200 }">
      <template slot="$operate">
        <a-button type="primary" icon="cloud-download" @click="exportData">导出数据</a-button>
      </template>
      <template slot="switch" slot-scope="text">
        <a-switch 
          checked-children="是" 
          un-checked-children="否"
          :checked="!!text" />
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
        requestUrl: this.$api.mock.getPageList,
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
            title: '清单类型',
            align: 'center',
            dataIndex:'type22',
          },
          {
            title: '项目分类',
            align: 'center',
            dataIndex:'type23',
          },
          {
            title: '特项编码',
            align: 'center',
            dataIndex:'code7',
          },
          {
            title: '项目编号',
            align: 'center',
            dataIndex:'code3',
            // customRender: t => <a-icon type = { t ? 'close' : 'check' } />
          },
          {
            title: '项目名称',
            align: 'center',
            dataIndex:'text11',
          },
          {
            title: '规格',
            align: 'center',
            dataIndex:'text12',
          },
          {
            title: '单位',
            align: 'center',
            dataIndex:'type24',
          },
          {
            title: '综合价',
            align: 'center',
            dataIndex:'number21',
          },
          {
            title: '承包价',
            align: 'center',
            dataIndex:'number16',
          },
          {
            title: '预算量',
            align: 'center',
            dataIndex:'number17',
          },
          {
            title: '结算量',
            align: 'center',
            dataIndex:'number18',
          },
          {
            title: '增减量',
            align: 'center',
            dataIndex:'number19',
          },
          {
            title: '预算金额',
            align: 'center',
            dataIndex:'number25',
          },
          {
            title: '预算承包金额',
            align: 'center',
            dataIndex:'number23',
          },
          {
            title: '结算金额',
            align: 'center',
            dataIndex:'number26',
          },
          {
            title: '结算承包金额',
            align: 'center',
            dataIndex:'number24',
          },
          {
            title: '备注',
            align: 'center',
            dataIndex:'text15',
          },
          {
            title: '价格1',
            align: 'center',
            dataIndex:'number4',
          },
          {
            title: '价格2',
            align: 'center',
            dataIndex:'number5',
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