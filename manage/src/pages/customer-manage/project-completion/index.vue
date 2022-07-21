<template>
  <div>
    <list-page
      ref="listPage"
      class="small-table"
      columnsName="project_completion"
      @resetParams="resetSearchForm"
      :columns="columns"
      :initColumns="columnX"
      :request-url="requestUrl"
      request-type="GET"
      :query-params="searchParams"
      :alert="options.alert"
      :showActionBtn="true"
      :rowSelection="options.rowSelection"
      :scroll="{ x: 1000 }">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="客户名称">
            <a-input v-model="queryParam.customerName" autocomplete="off" placeholder="请输入客户名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="门店名称">
            <a-input v-model="queryParam.name" autocomplete="off" placeholder="请输入门店名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="营销类型">
            <a-select placeholder="请选择营销类型" v-model="queryParam.isOpen1">
              <a-select-option v-for="(item, index) in json.type2" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </template>
      <template slot="$operate">
        <a-button type="primary" class="download" icon="download">导出数据</a-button>
      </template>
      <span slot="ellipsis" slot-scope="text">
        <ellipsis :length="16" tooltip>{{ text }}</ellipsis>
      </span>
      <template slot="switch" slot-scope="text">
        <span>{{ !!text? '是' : '否' }}</span>
      </template>
      <span slot="action" slot-scope="text, record">
        <template>
          <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link" @click="e => e.preventDefault()">
              查看<a-icon type="down"/>
            </a>
            <a-menu slot="overlay">
              <a-menu-item v-for="item in checkType" :key="item.key">
                <a @click="handleClick(item.key,record)">{{ item.name }}</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <a-divider type="vertical"/>
          <a @click="$refs.CustomerTracking.show(record.id)">客户跟踪</a>
          <a-divider type="vertical"/>
          <a @click="$refs.EvasionApply.show(record.id)">逃单申请</a>
        </template>
      </span>
    </list-page>
    <!-- 客户跟踪 -->
    <customer-tracking ref="CustomerTracking"></customer-tracking>
    <!-- 逃单申请 -->
    <evasion-apply ref="EvasionApply" @ok="handleOk"></evasion-apply>
    <!-- 材料清单 -->
    <materials-inventory ref="MaterialsInventory"></materials-inventory>
    <!-- 巡检查看 -->
    <patrol-details ref="PatrolDetails"></patrol-details>
    <!-- 效果图查看 -->
    <design-sketch ref="DesignSketch"></design-sketch>
    <!-- 物流单据 -->
    <logistics-bill ref="LogisticsBill"></logistics-bill>
    <!-- 财务单据 -->
    <finance-bill ref="FinanceBill"></finance-bill>
    <!-- 预算明细 -->
    <budget-details ref="BudgetDetails"></budget-details>
    <!-- 收款查看 -->
    <collection-details ref="CollectionDetails"></collection-details>
    <!-- 工人信息 -->
    <worker-info ref="WorkerInfo"></worker-info>
    <!-- 回访查看 -->
    <return-visit-details ref="ReturnVisitDetails"></return-visit-details>
    <!-- 施工计划 -->
    <construction-plan ref="ConstructionPlan"></construction-plan>
  </div>
</template>

<script>
  const columnX = [
    {
      title: '序号',
      width: 80,
      scopedSlots: { customRender: 'serial' }
    },
    {
      title: '是否锁定',
      dataIndex: 'boolean1',
      scopedSlots: {customRender: 'switch'}
    },
    {
      title: '重复次数',
      dataIndex: 'formOrder',
      scopedSlots: {customRender: 'formOrder'}
    },
    {
      title: '工地状态',
      dataIndex: 'type1',
    },
    {
      title: '客户状态',
      dataIndex: 'type2'
    },
    {
      title: '未跟踪天数',
      dataIndex: 'number1',
      scopedSlots: {customRender: 'number1'}
    },
    {
      title: '施工未推进天数',
      dataIndex: 'number2'
    },
    {
      title: '客户编码',
      dataIndex: 'code1'
    },
    {
      title: '客户姓名',
      dataIndex: 'name1'
    },
    // {
    //   title: '手机号',
    //   dataIndex: 'mobilePhone'
    // },
    // {
    //   title: '装修地址',
    //   dataIndex: 'address1'
    // },
    // {
    //   title: '客户来源',
    //   dataIndex: 'type3'
    // },
    // {
    //   title: '成功率',
    //   dataIndex: 'number3'
    // },
    // {
    //   title: '设计合同号',
    //   dataIndex: 'code2'
    // },
    // {
    //   title: '施工合同号',
    //   dataIndex: 'code3'
    // },
    // {
    //   title: '是否期房客户',
    //   dataIndex: 'boolean2',
    //   scopedSlots: {customRender: 'switch'}
    // },
    // {
    //   title: '营销类型',
    //   dataIndex: 'type4'
    // },
    // {
    //   title: '房型',
    //   dataIndex: 'type5'
    // },
    // {
    //   title: '户型',
    //   dataIndex: 'type6'
    // },
    // {
    //   title: '预计装修造价',
    //   dataIndex: 'number4'
    // },
    // {
    //   title: '预计装修日期',
    //   dataIndex: 'dataTime1',
    //   customRender: txt => txt && moment(txt).format(dateFormatString) || ''
    // },
    // {
    //   title: '派分总部门',
    //   dataIndex: 'type7'
    // },
    // {
    //   title: '分总',
    //   dataIndex: 'type8'
    // },
    // {
    //   title: '网销客服',
    //   dataIndex: 'type10'
    // },
    // {
    //   title: '项目经理',
    //   dataIndex: 'name2'
    // },
    // {
    //   title: '项目经理等级',
    //   dataIndex: 'status2'
    // },
    // {
    //   title: '设计师',
    //   dataIndex: 'name3'
    // },
    // {
    //   title: '预算员',
    //   dataIndex: 'name4'
    // },
    // {
    //   title: '软装馆经理',
    //   dataIndex: 'name5'
    // },
    // {
    //   title: '品管',
    //   dataIndex: 'name6'
    // },
    // {
    //   title: '生活馆经理',
    //   dataIndex: 'name7'
    // },
    // {
    //   title: '业务员',
    //   dataIndex: 'name8'
    // },
    // {
    //   title: '财务',
    //   dataIndex: 'name9'
    // },
    // {
    //   title: '实际开工日期',
    //   dataIndex: 'dataTime2',
    //   customRender: txt => txt && moment(txt).format(dateFormatString) || ''
    // },
    // {
    //   title: '实际完工日期',
    //   dataIndex: 'dataTime3',
    //   customRender: txt => txt && moment(txt).format(dateFormatString) || ''
    // },
    // {
    //   title: '设计合同定金',
    //   dataIndex: 'number5'
    // },
    // {
    //   title: '是否首谈成功',
    //   dataIndex: 'boolean3',
    //   scopedSlots: {customRender: 'switch'}
    // },
    // {
    //   title: '折前设计费',
    //   dataIndex: 'number6',
    // },
    // {
    //   title: '折后设计费',
    //   dataIndex: 'number7'
    // },
    // {
    //   title: '折后设计费单价',
    //   dataIndex: 'number8'
    // },
    // {
    //   title: '已收设计费',
    //   dataIndex: 'number9'
    // },
    // {
    //   title: '是否免费设计',
    //   dataIndex: 'boolean4',
    //   scopedSlots: {customRender: 'switch'}
    // },
    // {
    //   title: '施工合同金额',
    //   dataIndex: 'number10'
    // },
    // {
    //   title: '合同工期',
    //   dataIndex: 'dataTime4',
    //   customRender: txt => txt && moment(txt).format(dateFormatString) || ''
    // },
    // {
    //   title: '已收工程款',
    //   dataIndex: 'number11'
    // },
    // {
    //   title: '预算金额',
    //   dataIndex: 'number12'
    // },
    // {
    //   title: '预算优惠金额',
    //   dataIndex: 'number13'
    // },
    // {
    //   title: '结算金额',
    //   dataIndex: 'number14'
    // },
    // {
    //   title: '结算优惠金额',
    //   dataIndex: 'number15'
    // },
    // {
    //   title: '收款比例',
    //   dataIndex: 'number111'
    // },
    // {
    //   title: '施工状况',
    //   dataIndex: 'text4'
    // },
    // {
    //   title: '财务状况',
    //   dataIndex: 'text6'
    // },
    // {
    //   title: '门店名称',
    //   dataIndex: 'name10'
    // },
    // {
    //   title: '生活馆管家',
    //   dataIndex: 'name11'
    // },
    // {
    //   title: '软装管家',
    //   dataIndex: 'name12'
    // },
    // {
    //   title: '主材管家',
    //   dataIndex: 'name13'
    // },
    // {
    //   title: '建材馆管家',
    //   dataIndex: 'name14'
    // },
    // {
    //   title: '索菲亚管家',
    //   dataIndex: 'name15'
    // },
    // {
    //   title: '预计出施工图日期',
    //   dataIndex: 'dataTime5',
    //   customRender: txt => txt && moment(txt).format(dateFormatString) || ''
    // },
    // {
    //   title: '预计出效果图日期',
    //   dataIndex: 'dataTime6',
    //   customRender: txt => txt && moment(txt).format(dateFormatString) || ''
    // },
    // {
    //   title: '预计平面图日期',
    //   dataIndex: 'dataTime7',
    //   customRender: txt => txt && moment(txt).format(dateFormatString) || ''
    // },
    // {
    //   title: '业务员部门',
    //   dataIndex: 'type12'
    // },
    // {
    //   title: '年龄区间',
    //   dataIndex: 'type13'
    // },
    // {
    //   title: '回访时间',
    //   dataIndex: 'dataTime8',
    //   customRender: txt => txt && moment(txt).format(dateFormatString) || ''
    // },
    // {
    //   title: '房价',
    //   dataIndex: 'number16'
    // },

    // {
    //   title: '回单标志',
    //   dataIndex: 'text7',
    // },
    // {
    //   title: '所属行业',
    //   dataIndex: 'type15',
    // },
    // {
    //   title: '是否回访',
    //   dataIndex: 'boolean5',
    //   scopedSlots: {customRender: 'switch'}
    // },
    // {
    //   title: '是否远程',
    //   dataIndex: 'boolean6',
    //   scopedSlots: {customRender: 'switch'}
    // },
    // {
    //   title: '是否重点',
    //   dataIndex: 'boolean7',
    //   scopedSlots: {customRender: 'switch'}
    // },
    // {
    //   title: '月收入',
    //   dataIndex: 'type14',
    // },
    // {
    //   title: '平面图状况',
    //   dataIndex: 'text8',
    // },
    // {
    //   title: '回单部门',
    //   dataIndex: 'type16',
    // },
    // {
    //   title: '了解公司',
    //   dataIndex: 'type18',
    // },
    // {
    //   title: '电子邮件',
    //   dataIndex: 'email',
    //   width: 200,
    //   scopedSlots: { customRender: 'ellipsis'}
    // },
    // {
    //   title: '回单人',
    //   dataIndex: 'name16',
    // },
    // {
    //   title: '配饰设计师',
    //   dataIndex: 'name17',
    // },
    // {
    //   title: '宅配设计师',
    //   dataIndex: 'name18',
    // },
    // {
    //   title: '是否选材',
    //   dataIndex: 'boolean8',
    //   scopedSlots: {customRender: 'switch'}
    // },
    // {
    //   title: '客群服务模式',
    //   dataIndex: 'text9',
    // },
    // {
    //   title: '是否二次上门',
    //   dataIndex: 'boolean9',
    //   scopedSlots: {customRender: 'switch'}
    // },
    // {
    //   title: '二次上门日期',
    //   dataIndex: 'dataTime9',
    //   customRender: txt => txt && moment(txt).format(dateFormatString) || ''
    // },
    // {
    //   title: '优惠活动',
    //   dataIndex: 'type19',
    // },
    // {
    //   title: '竣工验收日期',
    //   dataIndex: 'dataTime10',
    //   customRender: txt => txt && moment(txt).format(dateFormatString) || ''
    // },
    // {
    //   title: '施工进度',
    //   dataIndex: 'type20',
    // },
    // {
    //   title: '客服',
    //   dataIndex: 'text10',
    // },
    // {
    //   title: '是否逃单',
    //   dataIndex: 'boolean10',
    //   scopedSlots: {customRender: 'switch'}
    // },
    // {
    //   title: 'e签宝编号',
    //   dataIndex: 'code4',
    // },
    // {
    //   title: 'e签约状态',
    //   dataIndex: 'type21',
    // },
    // {
    //   title: 'e签约时间',
    //   dataIndex: 'dataTime11',
    //   customRender: txt => txt && moment(txt).format(dateFormatString) || ''
    // },
    // {
    //   title: '是否为主材包客户',
    //   dataIndex: 'boolean11',
    //   scopedSlots: {customRender: 'switch'}
    // },
    {
      title: '操作',
      dataIndex: 'action',
      width: 240,
      fixed: 'right',
      scopedSlots: { customRender: 'action' }
    }
  ]
  import json from './modules/mocks'
  import moment from 'moment'
  import labels from '@/utils/labels'
  import { Ellipsis } from '@/components'
  import { defaultErrorMessage,dateFormatString } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import EvasionApply from '@/pages/customer-manage/intended-signing/modules/EvasionApply'
  import CustomerTracking from '@/pages/customer-manage/high-sea-pool-customer/modules/CustomerTracking'
  import MaterialsInventory from '@/pages/customer-manage/intended-signing/modules/MaterialsInventory'
  import DesignSketch from '@/pages/customer-manage/intended-signing/modules/DesignSketch'
  import LogisticsBill from '@/pages/customer-manage/intended-signing/modules/LogisticsBill'
  import BudgetDetails from '@/pages/customer-manage/intended-signing/modules/BudgetDetails'
  import CollectionDetails from '@/pages/customer-manage/intended-signing/modules/CollectionDetails'
  import PatrolDetails from '@/pages/customer-manage/intended-signing/modules/PatrolDetails'
  import ReplacePersonnel from '../high-sea-pool-customer/modules/ReplacePersonnel'
  import FinanceBill from '@/pages/customer-manage/intended-signing/modules/FinanceBill'
  import WorkerInfo from '@/pages/customer-manage/intended-signing/modules/WorkerInfo'
  import ReturnVisitDetails from '@/pages/customer-manage/intended-signing/modules/ReturnVisitDetails'
  import ConstructionPlan from '@/pages/customer-manage/intended-signing/modules/ConstructionPlan'
  export default {
    name: 'TableList',
    components: {
      ListPage,
      Ellipsis,
      EvasionApply,
      CustomerTracking,
      MaterialsInventory,
      DesignSketch,
      LogisticsBill,
      BudgetDetails,
      CollectionDetails,
      ReplacePersonnel,
      FinanceBill,
      ReturnVisitDetails,
      PatrolDetails,
      ConstructionPlan,
      WorkerInfo
    },
    data () {
      return {
        json,
        columnX,
        loading: false,
        requestUrl: this.$api.mock.getListPage,
        // 查询参数
        queryParam: {},
        options: {},
        selectedRowKeys: [],
        selectedRows: [],
        // 表头
        columns: columnX,
        checkType:[
          {key: 0 ,name: '材料清单'},
          {key: 1 ,name: '巡检查看'},
          {key: 2 ,name: '效果图'},
          {key: 3 ,name: '物流单据'},
          {key: 4 ,name: '财务单据'},
          {key: 5 ,name: '收款查看'},
          {key: 6 ,name: '付款查看'},
          {key: 7 ,name: '回访查看'},
          {key: 8 ,name: '施工计划'},
          {key: 9 ,name: '预算查看'},
          {key: 10 ,name: '工人信息'},
          {key: 11 ,name: '客户信息'},
          {key: 12 ,name: '主材明细'},
          {key: 13 ,name: '施工文件'},
        ],
        actionAuth: []
      }
    },
    methods: {
      // 获取自定义列
      getColumnX () {
        this.$get({
          url: this.$api.columnXManage.getColumnX,
          params: { type: 'project_completion'}
        }).then((res)=>{
          const list = res?.columnX || []
          const new_columns = []
          list?.forEach(item => {
            if(item.checked){
              new_columns.push(item)
            }
          })
          this.columns = new_columns && new_columns.length ? new_columns : columnX
        }).catch(err => defaultErrorMessage(err,labels.GET_DATA_FAIL))
          .finally(() => {this.confirmLoading = false })
      },
      searchParams() {
        if(this.$refs.listPage) {
          this.selectedRowKeys= []
          this.selectedRows = []
          this.$refs.listPage.updateSelect([],[])
        }
        return this.queryParam
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      handleClick(key,record) {
        switch (key) {
          case 0 : // 材料清单
            return this.$refs.MaterialsInventory.show(record.id)
          case 1 : // 巡检查看
            return this.$refs.PatrolDetails.show(record.id)
          case 2 : // 效果图
            return this.$refs.DesignSketch.show(record.id)
          case 3 : // 物流单据
            return this.$refs.LogisticsBill.show(record.id)
          case 4 : // 财务单据
            return this.$refs.FinanceBill.show(record.id)
          case 5 : // 收款查看
            // 6 付款查看
            return this.$refs.CollectionDetails.show(record.id)
          case 7 : // 回访查看
            return this.$refs.ReturnVisitDetails.show(record.id)
          // 8 施工计划查看
          case 9 : // 预算查看
            return this.$refs.BudgetDetails.show(record.id)
          case 10 : // 工人信息
            return this.$refs.WorkerInfo.show(record.id)
          // 11 客户信息
          default:
            return this.$notification.success({ message: '暂未开发'})
        }
      },
      add() {
      },
      handleEdit (record) {
        console.log(record)
      },
      handleIsOpen(record) {
        console.log(record)
      },
      handleSub (record) {
        console.log(record)
      },
      handleOk () {
        this.$refs.listPage.refresh()
      },
      resetSearchForm () {
        this.queryParam = {}
      },
    },
    activated() {
      this.selectedRowKeys = []
      this.$refs.listPage.updateSelect([],[])
      this.handleOk()
      this.getColumnX()
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