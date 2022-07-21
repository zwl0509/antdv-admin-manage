<template>
  <a-modal 
    title="物流单据"
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
      class="evasion-apply"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :showSearch="false"
      :query-params="searchParams"
      :scroll="{ x: 5400 }">
      <template slot="$operate">
        <a-button type="primary" icon="cloud-download" @click="exportData">导出数据</a-button>
        <div style="margin-top: 20px;">
          <a-tabs default-active-key="0" v-model="tabIndex" @change="handleOk">
            <a-tab-pane v-for="(item, index) in tab_list" :key="index" :tab="item.name"></a-tab-pane>
          </a-tabs>
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
    name: 'LogisticsBill',
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
            title: '单据编号',
            align: 'center',
            dataIndex:'code1',
          },
          {
            title: '行项目号',
            align: 'center',
            dataIndex:'number1',
          },
          {
            title: '状态',
            align: 'center',
            dataIndex:'boolean1',
            customRender: t => <a-icon type = { t ? 'close' : 'check' } />
          },
          {
            title: '分类',
            align: 'center',
            dataIndex:'code2',
          },
          {
            title: '供应商编码',
            align: 'center',
            dataIndex:'text11',
          },
          {
            title: '供应商名称',
            align: 'center',
            dataIndex:'code7',
          },
          {
            title: '销售客户编码',
            align: 'center',
            dataIndex:'text122',
          },
          {
            title: '销售客户姓名',
            align: 'center',
            dataIndex:'type24',
          },
          {
            title: '客户编码',
            align: 'center',
            dataIndex:'number21',
          },
          {
            title: '客户名称',
            align: 'center',
            dataIndex:'number16',
          },
          {
            title: '客户地址',
            align: 'center',
            dataIndex:'number17',
          },
          {
            title: '工长电话',
            align: 'center',
            dataIndex:'number18',
          },
          {
            title: '工长名称',
            align: 'center',
            dataIndex:'number19',
          },
          {
            title: '备注1',
            align: 'center',
            dataIndex:'number22',
          },
          {
            title: '材料编码',
            align: 'center',
            dataIndex:'number23',
          },
          {
            title: '物料名称',
            align: 'center',
            dataIndex:'number24',
          },
          {
            title: '规格',
            align: 'center',
            dataIndex:'number25',
          },
          {
            title: '采购单位',
            align: 'center',
            dataIndex:'number26',
          },
          {
            title: '采购单价',
            align: 'center',
            dataIndex:'dataTime1',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '采购数量',
            align: 'center',
            dataIndex:'number20',
          },
          {
            title: '采购金额',
            align: 'center',
            dataIndex:'dataTime2',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '库存单位',
            align: 'center',
            dataIndex:'text15',
          },
          {
            title: '库存单价',
            align: 'center',
            dataIndex:'text14',
          },
          {
            title: '库存数量',
            align: 'center',
            dataIndex:'text12',
          },
          {
            title: '库存金额',
            align: 'center',
            dataIndex:'number',
          },
          {
            title: '销售单位',
            align: 'center',
            dataIndex:'text10',
          },
          {
            title: '销售单价',
            align: 'center',
            dataIndex:'text13',
          },
          {
            title: '销售数量',
            align: 'center',
            dataIndex:'text9',
          },
          {
            title: '销售金额',
            align: 'center',
            dataIndex:'text8',
          },
          {
            title: '承包单价',
            align: 'center',
            dataIndex:'text7',
          },
          {
            title: '承包金额',
            align: 'center',
            dataIndex:'text6',
          },
          {
            title: '出库仓库',
            align: 'center',
            dataIndex:'text5',
          },
          {
            title: '入库仓库',
            align: 'center',
            dataIndex:'text4',
          },
          {
            title: '批次号',
            align: 'center',
            dataIndex:'text3',
          },
          {
            title: '工长确认状态',
            align: 'center',
            dataIndex:'text2',
          },
          {
            title: '下单状态',
            align: 'center',
            dataIndex:'text1',
          },
          {
            title: '是否冲销',
            align: 'center',
            dataIndex:'text27',
          },
          {
            title: '被冲销凭证',
            align: 'center',
            dataIndex:'text26',
          },
          {
            title: '生成凭证',
            align: 'center',
            dataIndex:'text25',
          },
          {
            title: '确认图片数量',
            align: 'center',
            dataIndex:'text24',
          },
          {
            title: '对账结算价',
            align: 'center',
            dataIndex:'text23',
          },
          {
            title: '对账结算金额',
            align: 'center',
            dataIndex:'text22',
          },
        ],
        dataList: [],
        tab_list: [
          {
            name: '调拨退货',
            value: 0,
          },
          {
            name: '调拨采购',
            value: 1,
          },
        ],
      tabIndex: 0,
      }
    },
    methods: {
      searchParams() {
        return this.queryParam
      },
      show() {
        this.visible = true
      },
      handleOk(e) {
        this.$refs.listPage.refresh()
      },
      handleSubmit() {
        this.handleCancel()
      },
      handleCancel() {
        this.visible = false
      },
      exportData() {

      },
    }
    
  }
</script>

<style lang="scss" scoped>
  ::v-deep .content .table-operator {
    margin-bottom: 0;
  }
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