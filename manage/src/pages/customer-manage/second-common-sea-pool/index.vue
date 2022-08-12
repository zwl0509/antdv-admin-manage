<template>
  <div>
    <list-page
      ref="listPage"
      class="small-table"
      columnsName="second_common"
      :showActionBtn="true"
      @resetParams="resetSearchForm"
      :columns="columns"
      :initColumns="columnX"
      :request-url="requestUrl"
      request-type="GET"
      :query-params="searchParams"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :scroll="{ x: scroll_x }">
      <template slot="$search">
        <a-col :md="6" :sm="24">
          <a-form-item label="客户名称">
            <a-input v-model="queryParam.customerName" autocomplete="off" placeholder="请输入客户名称" :max-length="30"/>
          </a-form-item>
        </a-col>
        <a-col :md="6" :sm="24">
          <a-form-item label="小区名称">
            <a-input v-model="queryParam.areaName" autocomplete="off" placeholder="请输入小区名称" :max-length="11"/>
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
          <a-form-item label="客户类型">
            <a-select placeholder="请选择客户类型" allowClear v-model="queryParam.relationship">
              <a-select-option v-for="(item, index) in codeType.relationshipType" :key="index" :value="item.value">
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
      </template>
      <template slot="$operate">
        <a-button type="primary" icon="plus" v-if="actionAuth.includes('SecondCommon.Create')" @click="$refs.createModal.add(queryParam.type)">新建</a-button>
        <a-button type="primary" icon="search" v-if="actionAuth.includes('SecondCommon.Gain')" @click="getCustomer">捞取客户</a-button>
        <!-- <a-button v-if="selectedRowKeys.length && actionAuth.includes('SecondCommon.BatchControl')" type="primary" icon="edit" @click="$refs.BatchAllocation.show(selectedRowKeys,queryParam.type,3)">批量指派</a-button> -->
        <a-button v-if="selectedRowKeys.length && actionAuth.includes('SecondCommon.BatchFlyerOrder')" type="primary" icon="edit" @click="$refs.FlightOrderApply.shows(selectedRowKeys,1)">批量飞单</a-button>
        <a-button v-if="selectedRowKeys.length && actionAuth.includes('SecondCommon.BatchFutureHouse')" type="primary" icon="edit" @click="$refs.FutureHouseApply.show(selectedRowKeys,'1056-20',2)">批量期房</a-button>
        <a-button v-if="selectedRowKeys.length && actionAuth.includes('SecondCommon.BatchRetain')" type="primary" icon="edit" @click="batchRetain()">批量保留</a-button>
        <a-popconfirm v-if="selectedRowKeys.length && actionAuth.includes('SecondCommon.BatchEliminate')" title="是否要批量剔除选中数据？" @confirm="handleSub(selectedRowKeys)">
          <a-button type="primary" icon="delete">批量剔除</a-button>
        </a-popconfirm>
        <a-button type="primary" class="download" icon="download" v-if="actionAuth.includes('SecondCommon.Download')" @click="downloadTemplate">下载模版</a-button>
        <a-button type="primary" class="download" icon="cloud-download" v-if="actionAuth.includes('SecondCommon.Import')" @click="uploadData">导入数据</a-button>
        <a-button type="primary" class="download" icon="download" v-if="actionAuth.includes('SecondCommon.Export')" @click="downloadData">导出数据</a-button>
        <a-button type="primary" class="download" icon="eye" v-if="actionAuth.includes('SecondCommon.LogInfo')" @click="$refs.ImportLogInfo.show('1066-30')">导入日志信息</a-button>
        <a-button type="primary" class="download" icon="eye" v-if="actionAuth.includes('SecondCommon.NewLog')" @click="$refs.CustomerNewLog.show()">客户新增日志</a-button>
        <a-button type="primary" class="download" icon="cloud-download" v-if="actionAuth.includes('SecondCommon.Import')" @click="uploadInfo">导入其他部门</a-button>
      </template>
      <template slot="switch" slot-scope="text">
        <a-switch 
          checked-children="是" 
          un-checked-children="否"
          :checked="!!text" />
      </template>
      <span slot="ellipsis" slot-scope="text">
        <ellipsis :length="16" tooltip>{{ text }}</ellipsis>
      </span>
      <template slot="switch" slot-scope="text">
        <span>{{ !!text ? '是' : '否' }}</span>
      </template>
      <span slot="infoShow" slot-scope="text,record">
        <span>{{ record.infoShow ? record.customerName : record.customerNameHide }}</span>
      </span>
      <span slot="action" slot-scope="text, record">
        <template v-if="!record.multiHouseStatus">
          <template v-if="actionAuth.includes('SecondCommon.Modify')">
            <a @click="$refs.createModal.edit(record,'edit',queryParam.type)">编辑</a>
            <a-divider type="vertical"/>
          </template>
          <template v-if="!record.onCustomerType && actionAuth.includes('SecondCommon.HandoverDesign')">
            <a @click="$refs.HandoverDesign.show([record.id])">移交设计部</a>
            <a-divider type="vertical"/>
          </template>
          <template>
            <template v-if="record.auditStatus == '1076-20' && actionAuth.includes('SecondCommon.Questionnaire')">
              <a @click="$refs.QuestionnaireModal.show(record,'1078-30')">填写问卷</a>
              <a-divider type="vertical"/>
            </template>
            <template v-if="record.auditStatus == '1076-10' && actionAuth.includes('SecondCommon.UploadPhoto')">
              <a @click="$refs.UploadAttach.show(record)">上传图片</a>
              <a-divider type="vertical"/>
            </template>
          </template>
          <template v-if="actionAuth.includes('SecondCommon.CustomerTracking')">
            <a @click="$refs.CustomerTracking.show(record, queryParam.type, actionAuth.includes('SecondCommon.CreateCustomerTracking'))">客户跟踪</a>
            <a-divider type="vertical"/>
          </template>
          <template v-if="actionAuth.includes('SecondCommon.FlyerOrderApply')">
            <a @click="$refs.FlightOrderApply.show(record,[record.id],2)" >飞单申请</a>
          </template>
          <br>
          <template v-if="!record.future && !record.onFuture && actionAuth.includes('SecondCommon.FutureHouseApply')">
            <a @click="$refs.FutureHouseApply.show([record.id],'1056-20',4)">期房申请</a>
            <a-divider type="vertical"/>
          </template>
          <template v-if="!record.onMultiHouse && actionAuth.includes('SecondCommon.MuchHouserApply')">
            <a @click="$refs.createModal.apply(record,'apply',queryParam.type)">多房申请</a>
            <a-divider type="vertical"/>
          </template>
          <template v-if="!record.onRefluxed && actionAuth.includes('SecondCommon.RetainApply')">
            <a @click="$refs.FutureHouseApply.show([record.bindId],'1056-10',3)" v-if="actionAuth.includes('SecondCommon.RetainApply')">保留申请</a>
            <a-divider type="vertical"/>
          </template>
          <template v-if="actionAuth.includes('SecondCommon.Eliminate')">
            <a-popconfirm title="是否要剔除此行？" @confirm="handleSub([record.id])">
              <a class="ant-btn-background-ghost ant-btn-danger" >剔除</a>
            </a-popconfirm>
          </template>
        </template>
        <template v-else>
          <template v-if="actionAuth.includes('SecondCommon.Modify')">
            <a @click="$refs.createModal.edit(record,'detail',queryParam.type)">详情</a>
            <a-divider type="vertical"/>
          </template>
          <template>
            <a class="ant-btn-background-ghost ant-btn-danger">{{ record.multiHouseStatus == 1 ? '多房(审核中)': '多房(已驳回)' }}</a>
          </template>
        </template>
      </span>
    </list-page>
    <action-modal ref="createModal" @ok="handleOk" :codeType="codeType" @getCodeList="getCodeList"></action-modal>
    <!-- 批量分配 -->
    <batch-allocation ref="BatchAllocation" @ok="handleOk"></batch-allocation>
    <!--飞单申请 -->
    <flight-order-apply ref="FlightOrderApply" @ok="handleOk"></flight-order-apply>
    <!-- 期房申请 -->
    <future-house-apply ref="FutureHouseApply" @ok="handleOk"></future-house-apply>
    <!-- 约一见 -->
    <about-first-see ref="AboutFirstSee" @ok="handleOk"></about-first-see>
    <!-- 客户跟踪 -->
    <customer-tracking ref="CustomerTracking" @ok="handleOk"></customer-tracking>
    <!-- 导入数据 -->
    <upload-modal ref="uploadModal" @ok="handleOk"></upload-modal>
    <!-- 捞取客户 -->
    <get-customer ref="GetCustomer" @ok="handleOk" :codeType="codeType" @getCodeList="getCodeList"></get-customer>
    <!-- 导入日志信息 -->
    <import-log-info ref="ImportLogInfo" @ok="handleOk"></import-log-info>
    <!-- 移交设计部 -->
    <handover-design ref="HandoverDesign" @ok="handleOk"></handover-design>
    <!-- 新增客户日志 -->
    <customer-new-log ref="CustomerNewLog" @ok="handleOk"></customer-new-log>
    <!-- 问卷调查 -->
    <questionnaire-modal ref="QuestionnaireModal" @ok="handleOk"></questionnaire-modal>
    <!-- 导入部门信息 -->
    <import-department-info ref="ImportDepartmentInfo" @ok="handleOk"></import-department-info>
    <!-- 移交设计部 => 上传附件 -->
    <upload-attach ref="UploadAttach" @ok="handleOk"></upload-attach>
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
      title: '客户名称',
      dataIndex: 'customerName',
      scopedSlots: { customRender: 'infoShow' }
    },
    {
      title: '性别',
      dataIndex: 'genderName'
    },
    {
      title: '小区',
      dataIndex: 'areaNamePath',
      width: 160,
      scopedSlots: { customRender: 'ellipsis'}
    },
    {
      title: '客户类型',
      dataIndex: 'relationshipName'
    },
    // {
    //   title: '门店',
    //   width: 150,
    //   dataIndex: 'storeName',
    //   scopedSlots: { customRender: 'ellipsis'}
    // },
    {
      title: '回单人',
      dataIndex: 'replyOrderStaff'
    },
    {
      title: '装修风格',
      dataIndex: 'decorationStyleName'
    },
    // {
    //   title: '装修地址详细地址',
    //   width: 200,
    //   dataIndex: 'fullAddress'
    // },
    {
      title: '建筑面积',
      dataIndex: 'buildingArea'
    },
    {
      title: '实用面积',
      dataIndex: 'actualArea'
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
      title: '楼层',
      dataIndex: 'floor'
    },
    {
      title: '客户了解信息',
      dataIndex: 'knownInfoName'
    },
    {
      title: '了解公司途径',
      dataIndex: 'knowCoWayName'
    },
    {
      title: '客户重点关注',
      dataIndex: 'focusOnName'
    },

    {
      title: '操作',
      dataIndex: 'action',
      width: 300,
      fixed: 'right',
      scopedSlots: { customRender: 'action' }
    }
  ]
  import moment from 'moment'
  import labels from '@/utils/labels'
  import { Ellipsis } from '@/components'
  import { defaultErrorMessage,dateFormatString } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  // import ActionModal from '../primitive-common-sea-pool/modules/ActionModal'
  import ImportDepartmentInfo from '@/pages/customer-manage/primitive-common-sea-pool/modules/ImportDepartmentInfo'
  import ActionModal from './modules/ActionModal'
  import EditPhone from '../high-sea-pool-customer/modules/EditPhone'
  import ReplacePersonnel from '../high-sea-pool-customer/modules/ReplacePersonnel'
  import CustomerTracking from '../high-sea-pool-customer/modules/CustomerTracking'
  import TransferCustomer from '../high-sea-pool-customer/modules/TransferCustomer'
  import UploadModal from '../high-sea-pool-customer/modules/UploadModal'
  import BatchAllocation from '../primitive-common-sea-pool/modules/BatchAllocation'
  import FlightOrderApply from '../resource-customer/modules/FlightOrderApply'
  import ReservationApply from '@/pages/customer-manage/second-common-sea-pool/modules/ReservationApply'
  import AboutFirstSee from '../primitive-common-sea-pool/modules/AboutFirstSee'
  import FutureHouseApply from '../primitive-common-sea-pool/modules/FutureHouseApply'
  import GetCustomer from '../primitive-common-sea-pool/modules/GetCustomer'
  import ImportLogInfo from '@/pages/customer-manage/primitive-common-sea-pool/modules/ImportLogInfo'
  import CustomerNewLog from '@/pages/customer-manage/primitive-common-sea-pool/modules/CustomerNewLog'
  import HandoverDesign from '../first-common-sea-pool/modules/HandoverDesign'
  import QuestionnaireModal from '../first-common-sea-pool/modules/QuestionnaireModal'
  import UploadAttach from '@/pages/customer-manage/first-common-sea-pool/modules/UploadAttach.vue'

  export default {
    name: 'TableList',
    components: {
      ImportDepartmentInfo,
      CustomerNewLog,
      ImportLogInfo,
      ListPage,
      Ellipsis,
      EditPhone,
      ActionModal,
      ReplacePersonnel,
      CustomerTracking,
      TransferCustomer,
      UploadModal,
      BatchAllocation,
      FlightOrderApply,
      ReservationApply,
      FutureHouseApply,
      AboutFirstSee,
      GetCustomer,
      HandoverDesign,
      QuestionnaireModal,
      UploadAttach
    },
    data () {
      return {
        columnX,
        loading: false,
        requestUrl: this.$api.customInfo.customerCommon.getListPage,
        form: this.$form.createForm(this),
        // 查询参数
        queryParam: {
          type: '1033-50',
          allData: false
        },
        options: {
          alert: {
            show: true,
            clear: () => {
              this.selectedRowKeys = []
              this.selectedRows = []
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
        
        columns: columnX,
        scroll_x: 2500,
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
          recordType: [],
          replyOrderTag:[],
          industryInvolvedType: [],
          ageRangeType: [],
          importType: []
        },
        isStatus: true
      }
    },
    created () {
      this.$store.dispatch('GetActionAuth').then(res => {
        const arr = []
        res.forEach(item => {
          arr.push(item.key)
        })
        this.actionAuth = arr
      })
    },
    methods: {
      searchParams () {
        return this.queryParam
      },
      // 获取自定义列
      getColumnX () {
        this.$get({
          url: this.$api.columnXManage.getColumnX,
          params: { type: 'second_common'}
        }).then((res)=>{
          const list = res?.columnX || []
          const new_columns = []
          list?.forEach(item => {
            if(item.checked){
              new_columns.push(item)
            }
          })
          this.columns = new_columns && new_columns.length ? new_columns : columnX
          let scrollX = 0
          this.columns.forEach(el=> {
            if(el.width){
              scrollX += el.width
            } else {
              scrollX += 120
            }
          })
          this.scroll_x = scrollX
        }).catch(err => defaultErrorMessage(err,labels.GET_DATA_FAIL))
          .finally(() => {this.confirmLoading = false })
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      // 捞取客户数据
      getCustomer() {
        this.$get({
          url: this.$api.customInfo.customerCommon.getRandCustomer,
          params: { type:  this.queryParam.type},
          needResponse: true
        }).then((res)=>{
          this.handleOk()
          this.$notification.success({
            message: labels.SAVE_SUCCESS,
            description: res.message || ''
          })
        }).catch(err => defaultErrorMessage(err, labels.SAVE_FAIL))
          .finally(() => { this.confirmLoading = false })
      },
      handleSub (customerIds) {
        this.loading = true
        this.$post({
          url: this.$api.customInfo.customerCommon.promote,
          data: {
            customerIds,
            status: '1054-40',
            type: '1033-50'
          },
          needResponse: true
        }).then(res => {
          this.$notification.success({
            message: labels.ELIMINATE_SUCCESS,
            description: res.message || ''
          })
          this.handleOk()
        }).catch(err => defaultErrorMessage(err, labels.ELIMINATE_FAIL))
          .finally(() => { this.loading = false })
      },
      getCodeList() {
        const params = {
          typeList: ['1003','1022','1023','1025','1026','1027','1028','1029','1030','1031','1034','1035','1036','1037','1038','1044','1066']
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
          this.codeType.ageRangeType =  res['1035'] || []  // 年龄区间
          this.codeType.replyOrderTag =  res['1036'] || []  // 回单标志
          this.codeType.trackType = res['1037'] || []  // 跟踪类型
          this.codeType.recordType = res['1038'] || []  // 记录类型
          this.codeType.importType = res['1066'] || [] //导入日志类型
          this.codeType.infoSourceType = res['1044'] || []  // 信息来源
          const filterList = ['1044-03','1044-07']
          const newList =  this.codeType.infoSourceType .filter(item=> { return !filterList.includes(item.value) })
          this.codeType.infoSourceType = newList
        })
      },
      handleOk () {
        this.selectedRowKeys = []
        this.$refs.listPage.refresh()
        this.$refs.listPage.updateSelect([],[])
      },
      resetSearchForm () {
        this.queryParam = {
          type: '1033-50',
          allData: false,
        }
      },
      batchRetain(){
        const batchIds = []
        this.selectedRows.forEach(item =>{
          batchIds.push(item.bindId)
        })
        this.$refs.FutureHouseApply.show(batchIds,'1056-10',1)
      },
      // 上传材料数据
      uploadData () {
        this.$refs.uploadModal.show(this.queryParam.type,'1066-30')
      },
      uploadInfo () {
        this.$refs.ImportDepartmentInfo.show(this.queryParam.type,'1066-30')
      },
      // 下载数据
      downloadData () {
        window.open(process.env.VUE_APP_API_BASE_URL + this.$api.customInfo.highSeaPoolCustomer.export +`?type=${this.queryParam.type || ''}&customerName=${this.queryParam.customerName || ''}&knowCoWay=${this.queryParam.knowCoWay || ''}&mobileNumber=${this.queryParam.mobileNumber || ''}&relationship=${this.queryParam.relationship || ''}&blocked=${(this.queryParam.blocked === 0 ? 0 : this.queryParam.blocked ? 1 : '') }&currentId=${this.$store.state.user.info.id}&allData=false&pageSize=${0}&currentPage=${0}`, '_self')
      },
      // 下载模版
      downloadTemplate(){
        const url = process.env.VUE_APP_TEMPLATE_BASE_URL + 'customer-template-two.xlsx'
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute(
          'download',
          '客户模版'
        )
        document.body.appendChild(link)
        link.click()
      },
    },
    activated() {
      if(this.$refs.listPage) {
        this.selectedRowKeys= []
        this.$refs.listPage.updateSelect([],[])
      }
      this.getCodeList()
      this.getColumnX()
    }
  }
</script>
<style lang="scss" scoped>
  .custom-tree {
    ::v-deep .ant-tree-node-content-wrapper {
      display: inline-block;
      width: calc(100% - 24px);
    }

    ::v-deep .ant-tree-title {
      display: flex;
      justify-content: space-between;
    }
  }

  .borderLeft {
    border-left: solid 1px #eee;
    padding-left: 20px !important;
  }

  ::v-deep .small-table {
    .ant-table-thead > tr > th {
      padding: 10px;
    }
    .ant-table-tbody > tr > td {
      padding: 10px;
    }
  }
</style>