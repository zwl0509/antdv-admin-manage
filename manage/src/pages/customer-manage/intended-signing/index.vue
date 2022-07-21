<template>
  <div>
    <list-page
      ref="listPage"
      @resetParams="resetSearchForm"
      :columns="columns"
      :request-url="requestUrl"
      request-type="GET"
      :query-params="searchParams"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :scroll="{ x: 14000 }">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="客户名称">
            <a-input v-model="queryParam.customerName" autocomplete="off" placeholder="请输入客户名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="营销类型">
            <a-select placeholder="请选择营销类型" allowClear v-model="queryParam.marketingType">
              <a-select-option v-for="(item, index) in codeType.marketingType" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="展示所有客户">
            <a-select placeholder="是否展示所有客户" allowClear v-model="queryParam.isAll">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="信息来源">
            <a-select placeholder="请选择信息来源" allowClear v-model="queryParam.infoSource">
              <a-select-option v-for="(item, index) in codeType.infoSourceType" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="了解公司途径">
            <a-select placeholder="请选择了解公司途径" allowClear v-model="queryParam.knowCoWay">
              <a-select-option v-for="(item, index) in codeType.knowCoWayType" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="是否期房客户">
            <a-select placeholder="请选择期房客户" allowClear v-model="queryParam.future">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="门店名称">
            <a-input v-model="queryParam.storeName" autocomplete="off" placeholder="请输入门店名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :xs="24">
          <a-form-item label="所属行业">
            <a-select placeholder="请选择所属行业" allowClear v-model="queryParam.industryInvolved">
              <a-select-option v-for="(item, index) in codeType.industryInvolvedType" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :xs="24">
          <a-form-item label="回单标志">
            <a-select placeholder="请选择回单标志" allowClear v-model="queryParam.replyOrderTag">
              <a-select-option v-for="(item, index) in codeType.replyOrderTag" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="是否逃单">
            <a-select placeholder="请选择是否逃单" allowClear v-model="queryParam.lost">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="是否远程客户">
            <a-select placeholder="请选择是否远程客户" allowClear v-model="queryParam.remote">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="是否重点小区">
            <a-select placeholder="请选择是否重点小区" allowClear v-model="queryParam.keyArea">
              <a-select-option v-for="(item, index) in $store.state.enabledList" :key="index" :value="item.value">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>

        <a-col :md="6" :sm="24">
          <a-form-item label="回访时间">
            <a-range-picker v-model="queryParam.data" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="预计装修日期">
            <a-range-picker v-model="queryParam.decorationDate" style="width: 100%"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="创建日期">
            <a-range-picker v-model="queryParam.createDate" style="width: 100%"/>
          </a-form-item>
        </a-col>
      </template>
      <template slot="switch" slot-scope="text">
        <span>{{ !!text? '是' : '否' }}</span>
      </template>
      <span slot="action" slot-scope="text, record">
        <template v-if="record.type == '1033-30'">
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
          <a @click="$refs.createModal.edit(record,'detail')">客户资料</a>
          <a-divider type="vertical"/>
          <a @click="$refs.CustomerTracking.show(record.id)">客户跟踪</a>
          <br>
          <a @click="$refs.EvasionApply.show(record.id)">逃单申请</a>
          <a-divider v-if="record.currentWorkFlowInfos.length" type="vertical" />
        </template>
        <template v-if="record.currentWorkFlowInfos.length">
          <span v-for="(item,index) in record.currentWorkFlowInfos" :key="index">
            <a @click="$refs.Dispatch.show(record,item)">{{ item.name }}</a>
            <a-divider v-if="index !== record.currentWorkFlowInfos.length - 1" type="vertical" />
          </span>
        </template>
      </span>
    </list-page>
    <!-- 派人员 -->
    <dispatch ref="Dispatch" @ok="handleOk"></dispatch>
    <replace-personnel ref="ReplacePersonnel"></replace-personnel>
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
    <!-- 客户资料 -->
    <action-modal ref="createModal" @ok="handleOk" :codeType="codeType" @getCodeList="getCodeList"></action-modal>
  </div>
</template>

<script>
  import moment from 'moment'
  import labels from '@/utils/labels'
  import { Ellipsis } from '@/components'
  import { defaultErrorMessage,dateFormatString } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import EvasionApply from './modules/EvasionApply'
  import CustomerTracking from '../high-sea-pool-customer/modules/CustomerTracking'
  import MaterialsInventory from './modules/MaterialsInventory'
  import DesignSketch from './modules/DesignSketch'
  import LogisticsBill from './modules/LogisticsBill'
  import BudgetDetails from './modules/BudgetDetails'
  import CollectionDetails from './modules/CollectionDetails'
  import PatrolDetails from './modules/PatrolDetails'
  import ReplacePersonnel from '../high-sea-pool-customer/modules/ReplacePersonnel'
  import FinanceBill from './modules/FinanceBill'
  import WorkerInfo from '@/pages/customer-manage/intended-signing/modules/WorkerInfo'
  import ReturnVisitDetails from './modules/ReturnVisitDetails'
  import ConstructionPlan from './modules/ConstructionPlan'
  import Dispatch from './modules/Dispatch'
  import ActionModal from './modules/ActionModal'

  export default {
    name: 'TableList',
    components: {
      ListPage,
      Ellipsis,
      WorkerInfo,
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
      Dispatch,
      ActionModal,
    },
    data () {
      return {
        loading: false,
        requestUrl: this.$api.customInfo.intendedCustomInfo.getListPage,
        // 查询参数
        queryParam: {
          isAll: 0
        },
        options: {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
            },
          },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
          },

        },

        selectedRowKeys: [],
        selectedRows: [],
        // 表头
        columns: [
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
            dataIndex: 'customerName1',
          },
          {
            title: '工地状态',
            dataIndex: 'type1',
          },
          {
            title: '客户编码',
            dataIndex: 'customerCode'
          },
          {
            title: '客户名称',
            dataIndex: 'customerName'
          },
          {
            title: '客户状态',
            dataIndex: 'type2'
          },
          {
            title: '营销类型',
            dataIndex: 'marketingTypeName'
          },
          {
            title: '客户阶段',
            dataIndex: 'typeName'
          },
          {
            title: '未跟踪天数',
            dataIndex: 'daysNotTracked'
          },
          {
            title: '施工未推进天数',
            dataIndex: 'number2'
          },

          {
            title: '装修完整地址',
            width: 240,
            dataIndex: 'finalAddress'
          },
          {
            title: '客户来源',
            dataIndex: 'type3'
          },
          {
            title: '成功率',
            dataIndex: 'successRate'
          },
          {
            title: '设计合同号',
            dataIndex: 'code2'
          },
          {
            title: '施工合同号',
            dataIndex: 'code3'
          },
          {
            title: '是否期房客户',
            dataIndex: 'future',
            scopedSlots: {customRender: 'switch'}
          },

          {
            title: '房型',
            dataIndex: 'houseTypeName'
          },
          {
            title: '户型',
            dataIndex: 'roomTypeName'
          },
          {
            title: '预计装修造价',
            dataIndex: 'budget'
          },
          {
            title: '预计装修日期',
            dataIndex: 'dateForDecoration',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '派分总部门',
            dataIndex: 'subManagerOrg'
          },
          {
            title: '分总',
            dataIndex: 'subManager'
          },
          {
            title: '网销客服',
            dataIndex: 'type10'
          },
          {
            title: '项目经理',
            dataIndex: 'name2'
          },
          {
            title: '项目经理等级',
            dataIndex: 'status2'
          },
          {
            title: '设计师',
            dataIndex: 'name3'
          },
          {
            title: '预算员',
            dataIndex: 'name4'
          },
          {
            title: '软装馆经理',
            dataIndex: 'name5'
          },
          {
            title: '品管',
            dataIndex: 'name6'
          },
          {
            title: '生活馆经理',
            dataIndex: 'name7'
          },
          {
            title: '业务员',
            dataIndex: 'salesman'
          },
          {
            title: '财务',
            dataIndex: 'name9'
          },
          {
            title: '实际开工日期',
            dataIndex: 'dataTime2',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '实际完工日期',
            dataIndex: 'dataTime3',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '设计合同定金',
            dataIndex: 'number5'
          },
          {
            title: '是否首谈成功',
            dataIndex: 'boolean3',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '折前设计费',
            dataIndex: 'number6',
          },
          {
            title: '折后设计费',
            dataIndex: 'number7'
          },
          {
            title: '折后设计费单价',
            dataIndex: 'number8'
          },
          {
            title: '已收设计费',
            dataIndex: 'number9'
          },
          {
            title: '是否免费设计',
            dataIndex: 'boolean4',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '施工合同金额',
            dataIndex: 'number10'
          },
          {
            title: '合同工期',
            dataIndex: 'dataTime4',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''

          },
          {
            title: '已收工程款',
            dataIndex: 'number11'
          },
          {
            title: '预算金额',
            dataIndex: 'number12'
          },
          {
            title: '预算优惠金额',
            dataIndex: 'number13'
          },
          {
            title: '结算金额',
            dataIndex: 'number14'
          },
          {
            title: '结算优惠金额',
            dataIndex: 'number15'
          },
          {
            title: '收款比例',
            dataIndex: 'number111'
          },
          {
            title: '施工状况',
            dataIndex: 'text4'
          },
          {
            title: '财务状况',
            dataIndex: 'text6'
          },
          {
            title: '门店名称',
            dataIndex: 'storeName'
          },
          {
            title: '生活馆管家',
            dataIndex: 'name11'
          },
          {
            title: '软装管家',
            dataIndex: 'name12'
          },
          {
            title: '主材管家',
            dataIndex: 'name13'
          },
          {
            title: '建材馆管家',
            dataIndex: 'name14'
          },
          {
            title: '索菲亚管家',
            dataIndex: 'name15'
          },
          {
            title: '预计出施工图日期',
            dataIndex: 'dataTime5',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '预计出效果图日期',
            dataIndex: 'dataTime6',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '预计平面图日期',
            dataIndex: 'dataTime7',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '业务员部门',
            dataIndex: 'salesmanOrg'
          },
          {
            title: '年龄区间',
            dataIndex: 'ageRangeName'
          },
          {
            title: '回访时间',
            dataIndex: 'returnVisitDate',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '房价',
            dataIndex: 'housePrice'
          },

          {
            title: '回单标志',
            dataIndex: 'text7',
          },
          {
            title: '所属行业',
            dataIndex: 'industryInvolvedName',
          },
          {
            title: '是否回访',
            dataIndex: 'returnVisit',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '是否远程客户',
            dataIndex: 'remote',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '是否重点小区',
            dataIndex: 'keyArea',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '月收入',
            dataIndex: 'monthlyIncomeName',
          },
          {
            title: '平面图状况',
            dataIndex: 'planarGraphCondition',
          },
          {
            title: '回单部门',
            dataIndex: 'replyOrderOrg',
          },
          {
            title: '了解公司途径',
            dataIndex: 'knowCoWayName',
          },
          {
            title: '电子邮件',
            dataIndex: 'mail',
          },
          {
            title: '回单人',
            dataIndex: 'replyOrderStaff',
          },
          {
            title: '配饰设计师',
            dataIndex: 'name17',
          },
          {
            title: '宅配设计师',
            dataIndex: 'name18',
          },
          {
            title: '是否选材',
            dataIndex: 'boolean8',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '客群服务模式',
            dataIndex: 'text9',
          },
          {
            title: '是否二次上门',
            dataIndex: 'boolean9',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '二次上门日期',
            dataIndex: 'dataTime9',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '优惠活动',
            dataIndex: 'type19',
          },
          {
            title: '竣工验收日期',
            dataIndex: 'dataTime10',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '施工进度',
            dataIndex: 'type20',
          },
          {
            title: '客服',
            dataIndex: 'text10',
          },
          {
            title: '是否逃单',
            dataIndex: 'lost',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: 'e签宝编号',
            dataIndex: 'code4',
          },
          {
            title: 'e签约状态',
            dataIndex: 'type21',
          },
          {
            title: 'e签约时间',
            dataIndex: 'dataTime11',
            customRender: txt => txt && moment(txt).format(dateFormatString) || ''
          },
          {
            title: '是否为主材包客户',
            dataIndex: 'boolean11',
            scopedSlots: {customRender: 'switch'}
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 260,
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        actionAuth: [],
        codeType: {
          houseType: [],
          roomType:[],
          genderType: [],
          infoSourceType: [],
          knowCoWayType: [],
          marketingType: [],
          relationshipType: [],
          decorationStyleType: [],
          focusOnType: [],
          knownInfoType: [],
          infoChannelType:[],
          trackType: [],
          recordType: []
        },
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
      }
    },
    created () {
      // this.$store.dispatch('GetActionAuth').then(res => {
      //   const arr = []
      //   res.forEach(item => {
      //     arr.push(item.key)
      //   })
      //   this.actionAuth = arr
      // })
    },
    methods: {
      searchParams () {
        this.queryParam.menuId =  this.queryParam.isAll ? '' : this.$route.meta.id
        if (this.queryParam.date) {

          this.queryParam.beginDateForMeasure = moment(this.queryParam.date[0]).format('YYYY-MM-DD')
          this.queryParam.endDateForMeasure = moment(this.queryParam.date[1]).format('YYYY-MM-DD')
        }
        if (this.queryParam.decorationDate) {
          this.queryParam.beginDateForDecoration = moment(this.queryParam.decorationDate[0]).format('YYYY-MM-DD')
          this.queryParam.endDateForDecoration = moment(this.queryParam.decorationDate[1]).format('YYYY-MM-DD')
        }
        if (this.queryParam.createDate) {
          this.queryParam.beginDateForCreated = moment(this.queryParam.createDate[0]).format('YYYY-MM-DD')
          this.queryParam.endDateForCreated = moment(this.queryParam.createDate[1]).format('YYYY-MM-DD')
        }
        delete this.queryParam.date
        delete this.queryParam.decorationDate
        delete this.queryParam.createDate
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
      add(record) {
        console.log(record)
      },
      getCodeList() {
        const params = {
          typeList: ['1003','1022','1023','1025','1026','1027','1028','1029','1030','1031','1034','1036','1037','1038','1044']
        }
        this.$getCodesList(params, res => {
          this.codeType.genderType = res['1003'] || [] // 性别
          this.codeType.relationshipType = res['1022'] || [] // 客户类型
          this.codeType.marketingType = res['1023'] || [] // 营销类型
          this.codeType.houseType = res['1025'] || []  // 房型
          this.codeType.roomType = res['1026'] || [] // 户型
          this.codeType.decorationStyleType = res['1027'] || []  // 装修风格
          this.codeType.infoChannelType = res['1028'] || [] // 信息渠道
          this.codeType.knowCoWayType = res['1029'] || []  // 了解公司途径
          this.codeType.knownInfoType = res['1030'] || []  // 客户了解信息
          this.codeType.focusOnType = res['1031'] || []  // 客户重点关注
          this.codeType.industryInvolvedType =  res['1034'] || []  // 所属行业
          this.codeType.replyOrderTag =  res['1036'] || []  // 回单标志
          this.codeType.trackType = res['1037'] || []  // 跟踪类型
          this.codeType.recordType = res['1038'] || []  // 记录类型
          this.codeType.infoSourceType = res['1044'] || []  // 信息来源
        })
      },
      handleOk () {
        this.$refs.listPage.refresh()
      },
      resetSearchForm () {
        this.queryParam = {
          isAll: 0
        }
      },
    },
    activated() {
      this.selectedRowKeys= []
      this.$refs.listPage.updateSelect([],[])
      this.handleOk()
      this.getCodeList()
    }
  }
</script>
<style lang="scss" scoped>
</style>