<template>
  <div>
    <a-table
      :rowKey="r => (r.id || r.key)"
      :pagination="false"
      :columns="columns"
      :data-source="dataList"
      :expandedRowKeys.sync="expandedRowKeys"
      :locale="locale"
      :scroll="{x: 2500,y:280}">
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <template slot="isActive" slot-scope="text">
        <span>{{ !!text ? '是' : '否' }}</span>
      </template>
      <span slot="ellipsis" slot-scope="text">
        <ellipsis :length="16" tooltip>{{ text }}</ellipsis>
      </span>
      <template slot="action" slot-scope="text,record" >
        <a @click="handleClick(record)">详情</a>
      </template>
    </a-table>
    <history-detail ref="HistoryDetail" :codeType="codeType" @getCodeList="getCodeList" />
  </div>
</template>

<script>
  const columns_A=[
    defaultTableColumns.serial,
    {
      title: '客户姓名',
      dataIndex: 'customerName',
      align:'center',
      scopedSlots: {
        customRender: 'customerName'
      }
    },
    {
      title: '地址',
      align:'center',
      dataIndex: 'finalAddress',
      scopedSlots: { customRender: 'ellipsis'}
    },
    {
      title: '门店',
      align:'center',
      dataIndex: 'storeName'
    },
    {
      title: '项目经理',
      align:'center',
      dataIndex: 'name'
    },
    {
      title: '设计师',
      align:'center',
      dataIndex: 'designer',
    },
    {
      title: '设计部经理',
      align:'center',
      dataIndex: 'designManager',
    },
    {
      title: '软装设计师',
      align:'center',
      dataIndex: 'name3',
    },
    {
      title: '宅配设计师',
      align:'center',
      dataIndex: 'name4',
    },
    {
      title: '实际开工日期',
      align:'center',
      dataIndex: 'dataTime1',
    },
    {
      title: '实际竣工日期',
      align:'center',
      dataIndex: 'dataTime2',
    },
    {
      title: '保修截止日期',
      align:'center',
      dataIndex: 'dataTime3',
    },
    {
      title: '投诉时间',
      align:'center',
      dataIndex: 'recordTime',
    },
    {
      title: '投诉问题',
      align:'center',
      dataIndex: 'recordSourceName',
    },
    {
      title: '是否完结',
      align:'center',
      dataIndex: 'isActive',
      scopedSlots: { customRender: 'isActive' }
    },
    // {
    //   title: '设计师',
    //   dataIndex: 'boolean1',
    //   scopedSlots: {customRender: 'switch'}
    // },
    {
      title: '操作',
      align:'center',
      dataIndex: 'action',
      width: 120,
      fixed: 'right',
      scopedSlots: { customRender: 'action' }
    }
  ]
  const columns_B =[
    defaultTableColumns.serial,
    {
      title: '客户姓名',
      dataIndex: 'customerName',
      align:'center',
      scopedSlots: {
        customRender: 'customerName'
      }
    },
    {
      title: '地址',
      align:'center',
      dataIndex: 'finalAddress',
      scopedSlots: { customRender: 'ellipsis'}
    },
    {
      title: '门店',
      align:'center',
      dataIndex: 'storeName'
    },
    {
      title: '项目经理',
      align:'center',
      dataIndex: 'name'
    },
    {
      title: '设计师',
      align:'center',
      dataIndex: 'designer',
    },
    {
      title: '设计部经理',
      align:'center',
      dataIndex: 'designManager',
    },
    {
      title: '软装设计师',
      align:'center',
      dataIndex: 'name3',
    },
    {
      title: '宅配设计师',
      align:'center',
      dataIndex: 'name4',
    },
    {
      title: '实际开工日期',
      align:'center',
      dataIndex: 'dataTime1',
    },
    {
      title: '实际竣工日期',
      align:'center',
      dataIndex: 'dataTime2',
    },
    {
      title: '保修截止日期',
      align:'center',
      dataIndex: 'dataTime3',
    },
    {
      title: '报修时间',
      align:'center',
      dataIndex: 'recordTime',
    },
    {
      title: '报修问题',
      align:'center',
      dataIndex: 'recordSourceName',
    },
    {
      title: '是否完结',
      align:'center',
      dataIndex: 'isActive',
      scopedSlots: { customRender: 'isActive' }
    },
    // {
    //   title: '设计师',
    //   dataIndex: 'boolean1',
    //   scopedSlots: {customRender: 'switch'}
    // },
    {
      title: '操作',
      align:'center',
      dataIndex: 'action',
      width: 120,
      fixed: 'right',
      scopedSlots: { customRender: 'action' }
    }
  ]
  const columns_C= [
    defaultTableColumns.serial,
    {
      title: '客户姓名',
      dataIndex: 'customerName',
      align:'center',
      scopedSlots: {
        customRender: 'customerName'
      }
    },
    {
      title: '地址',
      align:'center',
      dataIndex: 'finalAddress',
      scopedSlots: { customRender: 'ellipsis'}
    },
    {
      title: '门店',
      align:'center',
      dataIndex: 'storeName'
    },
    {
      title: '项目经理',
      align:'center',
      dataIndex: 'name'
    },
    {
      title: '设计师',
      align:'center',
      dataIndex: 'designer',
    },
    {
      title: '设计部经理',
      align:'center',
      dataIndex: 'designManager',
    },
    {
      title: '软装设计师',
      align:'center',
      dataIndex: 'name3',
    },
    {
      title: '宅配设计师',
      align:'center',
      dataIndex: 'name4',
    },
    {
      title: '实际开工日期',
      align:'center',
      dataIndex: 'dataTime1',
    },
    {
      title: '实际竣工日期',
      align:'center',
      dataIndex: 'dataTime2',
    },
    {
      title: '保修截止日期',
      align:'center',
      dataIndex: 'dataTime3',
    },
    {
      title: '回访时间',
      align:'center',
      dataIndex: 'recordTime',
    },
    {
      title: '回访问题',
      align:'center',
      dataIndex: 'recordSourceName',
    },
    {
      title: '是否完结',
      align:'center',
      dataIndex: 'isActive',
      scopedSlots: { customRender: 'isActive' }
    },
    // {
    //   title: '设计师',
    //   dataIndex: 'boolean1',
    //   scopedSlots: {customRender: 'switch'}
    // },
    {
      title: '操作',
      align:'center',
      dataIndex: 'action',
      width: 120,
      fixed: 'right',
      scopedSlots: { customRender: 'action' }
    }
  ]
  import { defaultErrorMessage } from '@/utils/common'
  import { Ellipsis } from '@/components'
  import { defaultTableColumns } from '@/components/ListPage/_utils'
  import json from '@/pages/customer-service-manage/complaint-record/modules/mocks'
  import labels from '@/utils/labels'
  import HistoryDetail from './HistoryDetail'
  export default {
    name:'HistoryTable',
    components: { HistoryDetail, Ellipsis},
    props: {
      type: {
        type: String,
        default: '',
      },
    },
    data () {
      return {
        json,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        },
        labelCol2: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol2: {
          xs: { span: 24 },
          align: 'center',
          sm: { span: 21 }
        },
        columns:columns_A,
        // 表头
        visible: false,
        modalType: 'add',
        confirmLoading: false,
        id: '',
        codeList: [],
        codeType: {
          serviceType: [],
          complaintType: [],
          complaintSource: [],
        },
        value:'',
        expandedRowKeys: [],
        dataList:[],
        locale: {
          emptyText: this.$createElement('span', {},'暂无数据')
        }
      }
    },
    methods: {
      show(id,value){
        this.customerId = id
        this.value = value
        this.getData(id,value)
        if (value === 0){
          this.columns = columns_A
        }else if (value === 1){
          this.columns = columns_B
        }else{
          this.columns = columns_C
        }
      },

      handleClick(record){
        const value = this.value
        this.$refs.HistoryDetail.edit(record,value)
      },
      getCodeList() {
        const params = {
          typeList: ['1071','1072','1044']
        }
        this.$getCodesList(params, res => {
          this.codeType.serviceType = res['1071'] || [] // 客服类型
          this.codeType.complaintType = res['1072'] || [] // 投诉类别
          this.codeType.complaintSource = res['1044'] || [] // 投诉来源
        })
      },
      getData(customerId,value){
        this.confirmLoading = true
        if (value === 0){
          this.$get({
            url: this.$api.customerServiceInfo.getListPage,
            params: {customerId,type: '1071-10'}
          }).then((res) =>{
            this.dataList = res.rows || []
          }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
            .finally(() => { this.confirmLoading = false })
        }else if (value === 1){
          this.$get({
            url: this.$api.customerServiceInfo.getListPage,
            params: {customerId,type: '1071-20'}
          }).then((res) =>{
            this.dataList = res.rows || []
          }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
            .finally(() => { this.confirmLoading = false })
        }else{
          this.$get({
            url: this.$api.customerServiceInfo.getHistoryList,
            params: {customerId}
          }).then((res) =>{
            this.dataList = res || []
          }).catch(err => defaultErrorMessage(err, labels.GET_DATA_FAIL))
            .finally(() => { this.confirmLoading = false })
        }
      },
      clearInput() {
        this.id = ''
        this.customerId = ''
        this.confirmLoading = false
        this.visible = false
      }
    },

  }
</script>
<style scoped lang="scss">
  ::v-deep .ant-select-dropdown-menu-item-disabled {
    width: 100%;
    height: 100%;
    cursor: pointer;
    padding: 0;
    background: red !important;
    color: #585A62;
  }
  .remark{
    margin-bottom: 20px;
  }
  ::v-deep .ant-table-row-cell-break-word{
    height: 69px;
  }
</style>
