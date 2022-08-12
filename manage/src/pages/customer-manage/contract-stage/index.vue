<template>
  <div>
    <!-- 合同阶段 -->
    <list-page
      ref="listPage"
      class="small-table"
      columnsName="contract-stage"
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
        <a-button v-if="actionAuth.includes('DesignPhase.BatchEvasionApply') && selectedRowKeys.length" type="primary" icon="edit" @click="$refs.EvasionApply.shows(selectedRowKeys,1)">批量逃单</a-button>
        <a-button v-if="actionAuth.includes('DesignPhase.Export')" type="primary" class="download" icon="download" @click="downloadData">导出数据</a-button>
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
        <template v-if="actionAuth.includes('DesignPhase.Detail')">
          <a @click="$refs.createModal.edit(record,'detail',queryParam.type)">查看</a>
        </template>
        <template v-if="actionAuth.includes('DesignPhase.CustomerTracking')">
          <a-divider type="vertical"/>
          <a @click="$refs.CustomerTracking.show(record, queryParam.type, actionAuth.includes('DesignPhase.CreateCustomerTracking'))">客户跟踪</a>
        </template>
        <template v-if="actionAuth.includes('DesignPhase.Evasion')">
          <a-divider type="vertical"/>
          <a @click="$refs.EvasionApply.show([record.id],2)">逃单申请</a>
        </template>
        <br/>
        <template v-if="actionAuth.includes('DesignPhase.ConstructionPlan')">
          <a @click="$refs.ConstructionPlan.show(record)">生成施工计划</a>
          <a-divider type="vertical" v-if="record.currentWorkFlowInfos.length" />
        </template>
        <template v-if="record.currentWorkFlowInfos.length && isFlowInfos(record)">
          <span v-for="(item,index) in record.currentWorkFlowInfos" :key="index">
            <a @click="trackingProcess(record,item)">{{ item.name }}</a>
            <a-divider v-if="record.currentWorkFlowInfos.length !== index + 1" type="vertical"/>
          </span>
        </template>
      </span>
    </list-page>
    <action-modal ref="createModal" @ok="handleOk" :codeType="codeType" @getCodeList="getCodeList"></action-modal>
    <!-- 客户跟踪 -->
    <customer-tracking ref="CustomerTracking" @ok="handleOk"></customer-tracking>
    <!-- 逃单申请 -->
    <evasion-apply ref="EvasionApply" @ok="handleOk"></evasion-apply>
    <!-- 派工表单 -->
    <dispatch-from ref="DispatchFrom" @ok="handleOk"></dispatch-from>
    <!-- 设计合同表单 -->
    <design-contract ref="DesignContract" @ok="handleOk"></design-contract>
    <!-- 施工合同表单 -->
    <sign-contract-from ref="SignContractFrom" @ok="handleOk"></sign-contract-from>
    <!-- 上传附件表单 -->
    <upload-pic ref="UploadPic" @ok="handleOk"></upload-pic>
    <!-- 施工计划 -->
    <construction-plan ref="ConstructionPlan" @ok="handleOk"></construction-plan>
    <!-- 施工计划图 -->
    <gantt-modal ref="GanttModal"></gantt-modal>
  </div>
</template>

<script>
  const columnX =  [
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
      width: 200,
      fixed: 'right',
      scopedSlots: { customRender: 'action' }
    }
  ]
  import labels from '@/utils/labels'
  import { Ellipsis } from '@/components'
  import { defaultErrorMessage } from '@/utils/common'
  import ListPage from '@/components/ListPage'
  import ActionModal from '@/pages/customer-manage/design-phase/modules/ActionModal'
  import CustomerTracking from '@/pages/customer-manage/high-sea-pool-customer/modules/CustomerTracking'
  import EvasionApply from '@/pages/customer-manage/agreement-common-sea-pool/modules/EvasionApply'
  import DispatchFrom from '@/pages/customer-manage/agreement-common-sea-pool/modules/DispatchFrom'
  import DesignContract from '@/pages/customer-manage/agreement-common-sea-pool/modules/DesignContract'
  import UploadPic from '@/pages/customer-manage/design-phase/modules/UploadPic'
  import SignContractFrom from '@/pages/customer-manage/design-phase/modules/SignContractFrom'
  import ConstructionPlan from '@/pages/customer-manage/design-phase/modules/ConstructionPlan'
  import GanttModal from '@/pages/customer-manage/design-phase/modules/GanttModal'
  export default {
    name: 'TableList',
    components: {
      ConstructionPlan,
      ListPage,
      Ellipsis,
      ActionModal,
      CustomerTracking,
      EvasionApply,
      DispatchFrom,
      DesignContract,
      UploadPic,
      SignContractFrom,
      GanttModal
    },
    data () {
      return {
        columnX,
        loading: false,
        requestUrl: this.$api.customInfo.customerCommon.getListPage,
        form: this.$form.createForm(this),
        // 查询参数
        queryParam: {
          type: '1033-70',
          allData: false,
          menuId: this.$route.meta.id
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
          ageRangeType: []
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
          params: { type: 'contract-stage'}
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
      // 跟踪流程
      trackingProcess(record, item) {
        switch (item.workFlowRelationFormCode) {
          case '1059-10': // 派工表单
            this.$refs.DispatchFrom.show(record.id,item)
            break
          case '1059-20': // 量房表单
            this.$refs.DispatchFrom.show(record.id,item)
            break
          case '1059-30': // 设计表单
            this.$refs.DesignContract.show(record.id,item)
            break
          case '1059-40': // 施工表单
            this.$refs.SignContractFrom.show(record.id,item)
            break
          case '1059-50': // 附件表单
            this.$refs.UploadPic.show(record.id,item)
            break
          default:
            this.$notification.warning({
              message: labels.HINT,
              description: '暂无此流程表单，请新增绑定流程表单!'
            })
            break
        }
      },
      isFlowInfos(record) {
        const positionIds = []
        let flag = false
        if(record.currentWorkFlowInfos && record.currentWorkFlowInfos.length){
          record.currentWorkFlowInfos.forEach((item,index)=>{
            item.positionIds?.forEach(info=>{
              positionIds.push(info)
            })
          })
        }
        this.$store.state.user.info.positions?.forEach(info=>{
          positionIds.forEach(ele=> {
            if(info == ele) {
              flag = true
            }
          })
        })
        return flag
      },
      getCodeList() {
        const params = {
          typeList: ['1003','1022','1023','1025','1026','1027','1028','1029','1030','1031','1034','1035','1036','1037','1038','1044']
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
          this.codeType.infoSourceType = res['1044'] || []  // 信息来源
        })
      },
      handleOk () {
        this.$refs.listPage.refresh()
      },
      // 下载数据
      downloadData () {
        window.open(process.env.VUE_APP_API_BASE_URL + this.$api.customInfo.highSeaPoolCustomer.export +`?type=${this.queryParam.type || ''}&customerName=${this.queryParam.customerName || ''}&knowCoWay=${this.queryParam.knowCoWay || ''}&mobileNumber=${this.queryParam.mobileNumber || ''}&relationship=${this.queryParam.relationship || ''}&blocked=${(this.queryParam.blocked === 0 ? 0 : this.queryParam.blocked ? 1 : '') }&currentId=${this.$store.state.user.info.id}&allData=false&pageSize=${0}&currentPage=${0}`, '_self')
      },
      resetSearchForm () {
        this.queryParam = {
          type: '1033-70',
          allData: false,
        }
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