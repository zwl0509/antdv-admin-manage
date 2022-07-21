<template>
  <a-modal 
    title="施工计划"
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
      :scroll="{ x: 4000 }">
      <template slot="$operate">
        <a-button type="primary" icon="cloud-download" @click="exportData">导出数据</a-button>
        <div style="margin: 20px 0;">
          <a-col :md="8" :sm="24">
            <a-form-item label="客户编码" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{ dataInfo.isOpen1 }}
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="客户名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{ dataInfo.isOpen2 }}
            </a-form-item>
          </a-col>   
          <a-col :md="8" :sm="24">
            <a-form-item label="装修地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              {{ dataInfo.isOpen3 }}
            </a-form-item>
          </a-col>
        </div>
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
    name: 'ConstructionPlan',
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
        dataInfo: {
          isOpen1: 'A-C0-20220509',
          isOpen2: '何林海三单元',
          isOpen3: '苏州市姑苏区寒山寺第一分寺',
        },
        id: '',
        columns: [
          {
            title: '序号',
            align: 'center',
            width: 60,
            scopedSlots: { customRender: 'serial' }
          },
          {
            title: '项目分类',
            align: 'center',
            dataIndex:'type22',
          },
          {
            title: '材料分类',
            align: 'center',
            dataIndex:'type23',
          },
          {
            title: '是否计价',
            align: 'center',
            dataIndex:'boolean1',
            customRender: t => <a-icon type = { t ? 'close' : 'check' } />
          },
          {
            title: '是否优惠项',
            align: 'center',
            dataIndex:'boolean2',
            customRender: t => <a-icon type = { t ? 'close' : 'check' } />
          },
          {
            title: '材料编码',
            align: 'center',
            dataIndex:'code1',
          },
          {
            title: '物料名称',
            align: 'center',
            dataIndex:'text11',
          },
          {
            title: '特项编码',
            align: 'center',
            dataIndex:'code7',
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
            title: '预算价',
            align: 'center',
            dataIndex:'number21',
          },
          {
            title: '预算量',
            align: 'center',
            dataIndex:'number16',
          },
          {
            title: '结算量',
            align: 'center',
            dataIndex:'number17',
          },
          {
            title: '申请量',
            align: 'center',
            dataIndex:'number18',
          },
          {
            title: '开单量',
            align: 'center',
            dataIndex:'number19',
          },
          {
            title: '预算承包价',
            align: 'center',
            dataIndex:'number22',
          },
          {
            title: '预算承包金额',
            align: 'center',
            dataIndex:'number23',
          },
          {
            title: '结算承包金额',
            align: 'center',
            dataIndex:'number24',
          },
          {
            title: '预算金额',
            align: 'center',
            dataIndex:'number25',
          },
          {
            title: '结算金额',
            align: 'center',
            dataIndex:'number26',
          },
          {
            title: '计划到场时间',
            align: 'center',
            dataIndex:'dataTime1',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '采购周期',
            align: 'center',
            dataIndex:'number20',
          },
          {
            title: '计划采购日期',
            align: 'center',
            dataIndex:'dataTime2',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '备注',
            align: 'center',
            dataIndex:'text15',
          },
          {
            title: '优惠包',
            align: 'center',
            dataIndex:'text14',
          },
          {
            title: '默认供应商',
            align: 'center',
            dataIndex:'text13',
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